from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'price', 'quantity', 'subtotal']
    can_delete = False
    exclude = ['length', 'lace_type', 'color']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'full_name', 'email', 'total', 'delivery_type',
        'international_region', 'status', 'is_paid', 'agreed_to_terms',
        'payment_method_label', 'created_at',
    ]
    list_filter = [
        'status', 'delivery_type', 'international_region', 'is_paid',
        'agreed_to_terms', 'payment_method', 'created_at',
    ]
    search_fields = ['order_number', 'email', 'full_name', 'phone']
    readonly_fields = [
        'order_number', 'subtotal', 'delivery_fee', 'total',
        'payment_method_label', 'payment_reference', 'paid_at',
        'created_at', 'updated_at',
    ]
    raw_id_fields = ['user']
    inlines = [OrderItemInline]
    fieldsets = (
        ('Order Info', {'fields': ('order_number', 'status', 'is_paid', 'paid_at')}),
        ('Customer', {
            'fields': (
                'user', 'full_name', 'email', 'phone',
                'agreed_to_terms', 'terms_agreed_at',
            ),
        }),
        ('Delivery', {
            'fields': (
                'delivery_type', 'international_region',
                'address', 'city', 'state', 'country', 'order_notes',
            ),
        }),
        ('Payment', {'fields': ('payment_method', 'payment_method_label', 'payment_reference')}),
        ('Totals', {'fields': ('subtotal', 'delivery_fee', 'total')}),
        ('Refund', {'fields': ('refund_amount', 'refund_reason'), 'classes': ('collapse',)}),
        ('Timestamps', {'fields': ('shipped_at', 'delivered_at', 'cancelled_at', 'created_at', 'updated_at')}),
    )

    @admin.display(description='Payment method', ordering='payment_method')
    def payment_method_label(self, obj):
        return obj.payment_method_display
