from decimal import Decimal

from django.utils import timezone
from rest_framework import serializers

from apps.products.models import Product
from apps.site_config.models import CurrencySettings

from .models import Order, OrderItem

INTERNATIONAL_REGION_LABELS = {
    'US': 'United States',
    'UK': 'United Kingdom',
    'CA': 'Canada',
}


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_slug', 'product_image',
            'price', 'quantity', 'length', 'lace_type', 'color', 'subtotal',
        ]
        read_only_fields = ['product_name', 'product_slug', 'product_image', 'price', 'subtotal']


class CartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class CheckoutSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True, default='Nigeria')
    order_notes = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.ChoiceField(choices=['paystack', 'flutterwave'])
    agreed_to_terms = serializers.BooleanField()
    is_international_delivery = serializers.BooleanField(default=False)
    international_region = serializers.ChoiceField(
        choices=[('US', 'United States'), ('UK', 'United Kingdom'), ('CA', 'Canada')],
        required=False,
        allow_blank=True,
    )
    items = CartItemSerializer(many=True)

    def validate_agreed_to_terms(self, value):
        if not value:
            raise serializers.ValidationError(
                'You must agree to our Terms of Service and Refund Policy before placing an order.'
            )
        return value

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError('Cart cannot be empty.')
        return items

    def validate(self, data):
        is_international = data.get('is_international_delivery', False)
        region = data.get('international_region') or ''

        if is_international:
            if not region:
                raise serializers.ValidationError({
                    'international_region': 'Please select whether you are in the US, UK, or Canada.',
                })
            data['delivery_type'] = 'international'
            data['country'] = INTERNATIONAL_REGION_LABELS[region]
        else:
            data['delivery_type'] = 'local'
            data['international_region'] = ''
            data['country'] = 'Nigeria'

        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        payment_method = validated_data.pop('payment_method')
        validated_data.pop('is_international_delivery', None)
        delivery_type = validated_data.get('delivery_type', 'local')

        currency_settings = CurrencySettings.get_settings()
        if delivery_type == 'international':
            delivery_fee = Decimal(str(currency_settings.international_delivery_fee))
        else:
            delivery_fee = Decimal(str(currency_settings.local_delivery_fee))

        subtotal = Decimal('0')
        order_items = []

        for item_data in items_data:
            try:
                product = Product.objects.get(
                    pk=item_data['product_id'],
                    is_active=True,
                    is_archived=False,
                )
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    {'items': f'Product {item_data["product_id"]} not found.'}
                )

            if product.stock < item_data['quantity']:
                raise serializers.ValidationError(
                    {'items': f'Insufficient stock for {product.name}.'}
                )

            price = product.current_price
            item_subtotal = price * item_data['quantity']
            subtotal += item_subtotal

            primary_image = product.primary_image
            image_url = ''
            if primary_image:
                request = self.context.get('request')
                image_url = primary_image.image.url
                if request:
                    image_url = request.build_absolute_uri(image_url)

            order_items.append({
                'product': product,
                'product_name': product.name,
                'product_slug': product.slug,
                'product_image': image_url,
                'price': price,
                'quantity': item_data['quantity'],
                'length': product.length,
                'lace_type': product.lace_type,
                'color': product.color,
                'subtotal': item_subtotal,
            })

        total = subtotal + delivery_fee

        validated_data.pop('agreed_to_terms', None)

        request = self.context.get('request')
        user = None
        if request and getattr(request, 'user', None) and request.user.is_authenticated:
            if not request.user.is_staff:
                user = request.user

        order = Order.objects.create(
            **validated_data,
            user=user,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total=total,
            payment_method=payment_method,
            agreed_to_terms=True,
            terms_agreed_at=timezone.now(),
        )

        for item in order_items:
            OrderItem.objects.create(order=order, **item)

        return order


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_method_display = serializers.ReadOnlyField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'full_name', 'email', 'phone',
            'address', 'city', 'state', 'country',
            'delivery_type', 'international_region',
            'order_notes',
            'subtotal', 'delivery_fee', 'total', 'status', 'status_display', 'payment_method',
            'payment_method_display',
            'payment_reference', 'is_paid', 'paid_at', 'agreed_to_terms', 'terms_agreed_at',
            'items', 'created_at',
        ]


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'refund_amount', 'refund_reason']


class AdminOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    delivery_type_display = serializers.CharField(source='get_delivery_type_display', read_only=True)
    international_region_display = serializers.SerializerMethodField()
    payment_method_display = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'full_name', 'email', 'phone',
            'address', 'city', 'state', 'country',
            'delivery_type', 'delivery_type_display',
            'international_region', 'international_region_display',
            'order_notes',
            'subtotal', 'delivery_fee', 'total', 'status', 'payment_method',
            'payment_method_display',
            'payment_reference', 'is_paid', 'paid_at', 'shipped_at', 'delivered_at',
            'cancelled_at', 'refund_amount', 'refund_reason',
            'agreed_to_terms', 'terms_agreed_at',
            'items', 'created_at', 'updated_at',
        ]
        read_only_fields = ['order_number', 'created_at', 'updated_at']

    def get_international_region_display(self, obj):
        if not obj.international_region:
            return ''
        return dict(Order.INTERNATIONAL_REGION_CHOICES).get(obj.international_region, obj.international_region)
