from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminUser
from apps.core.email_utils import send_order_confirmation_email, send_order_notification_email
from apps.notifications.services import NotificationService

from .models import Order
from .serializers import CheckoutSerializer, OrderSerializer, OrderStatusUpdateSerializer, AdminOrderSerializer
from .agreement_serializers import TermsAgreementSerializer


class CheckoutView(APIView):
    authentication_classes = []  # set below to allow optional JWT
    permission_classes = []

    def get_authenticators(self):
        from rest_framework_simplejwt.authentication import JWTAuthentication
        return [JWTAuthentication()]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        send_order_confirmation_email(order)
        send_order_notification_email(order)
        NotificationService.notify_new_order(order)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, order_number):
        try:
            order = Order.objects.prefetch_related('items').get(order_number=order_number)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data)


class AdminTermsAgreementListView(generics.ListAPIView):
    """Orders where the customer agreed to Terms of Service & Refund Policy at checkout."""
    permission_classes = [IsAdminUser]
    serializer_class = TermsAgreementSerializer
    pagination_class = None

    def get_queryset(self):
        return Order.objects.filter(agreed_to_terms=True).order_by('-terms_agreed_at')


class AdminOrderListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminOrderSerializer
    filterset_fields = ['status', 'is_paid', 'payment_method']
    search_fields = ['order_number', 'email', 'full_name', 'phone']
    ordering_fields = ['created_at', 'total']
    ordering = ['-created_at']
    pagination_class = None

    def get_queryset(self):
        status_filter = self.request.query_params.get('status')
        delivery_type = self.request.query_params.get('delivery_type')
        queryset = Order.objects.prefetch_related('items').all()
        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        if delivery_type and delivery_type != 'all':
            queryset = queryset.filter(delivery_type=delivery_type)
        return queryset


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Order.objects.prefetch_related('items').all()
    lookup_field = 'order_number'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return OrderStatusUpdateSerializer
        return AdminOrderSerializer

    def perform_update(self, serializer):
        old_status = self.get_object().status
        order = serializer.save()
        if old_status != order.status:
            NotificationService.notify_order_status_change(order)
            if order.status == 'delivered':
                order.delivered_at = timezone.now()
                order.save(update_fields=['delivered_at'])
            elif order.status in ('shipped', 'out_for_delivery'):
                order.shipped_at = timezone.now()
                order.save(update_fields=['shipped_at'])
            elif order.status == 'cancelled':
                order.cancelled_at = timezone.now()
                order.save(update_fields=['cancelled_at'])


class AdminOrderStatusUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        old_status = order.status
        order = serializer.save()
        
        if old_status != order.status:
            NotificationService.notify_order_status_change(order)
            if order.status == 'delivered':
                order.delivered_at = timezone.now()
                order.save(update_fields=['delivered_at'])
            elif order.status in ('shipped', 'out_for_delivery'):
                order.shipped_at = timezone.now()
                order.save(update_fields=['shipped_at'])
            elif order.status == 'cancelled':
                order.cancelled_at = timezone.now()
                order.save(update_fields=['cancelled_at'])
        
        return Response(AdminOrderSerializer(order).data)
