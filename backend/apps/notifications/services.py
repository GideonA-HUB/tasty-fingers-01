from django.conf import settings

from apps.core.email_utils import (
    send_contact_notification_email,
    send_order_status_email,
    send_payment_admin_notification,
)

from .models import Notification


class EmailService:
    @classmethod
    def send_contact_notification(cls, submission):
        send_contact_notification_email(submission)

    @classmethod
    def send_booking_notification(cls, inquiry):
        from apps.core.email_utils import send_booking_notification_email
        send_booking_notification_email(inquiry)

    @classmethod
    def send_order_confirmed(cls, order):
        send_order_status_email(order, 'Order Confirmed')

    @classmethod
    def send_order_delivered(cls, order):
        send_order_status_email(order, 'Order Delivered')

    @classmethod
    def notify_admin_payment_confirmed(cls, order):
        send_payment_admin_notification(order)


class NotificationService:
    LARGE_ORDER_THRESHOLD = 500000

    @classmethod
    def notify_new_order(cls, order):
        Notification.objects.create(
            notification_type='new_order',
            title=f'New Order: {order.order_number}',
            message=f'{order.full_name} placed an order worth ₦{order.total:,.2f}',
            related_order=order,
            metadata={'total': str(order.total)},
        )

        if order.total >= cls.LARGE_ORDER_THRESHOLD:
            cls.notify_large_order(order)

    @classmethod
    def notify_payment_received(cls, order):
        Notification.objects.create(
            notification_type='payment_received',
            title=f'Payment Received: {order.order_number}',
            message=f'Payment of ₦{order.total:,.2f} confirmed for {order.full_name}',
            related_order=order,
        )
        EmailService.notify_admin_payment_confirmed(order)

    @classmethod
    def notify_large_order(cls, order):
        Notification.objects.create(
            notification_type='large_order',
            title=f'Large Order Alert: {order.order_number}',
            message=f'High-value order of ₦{order.total:,.2f} from {order.full_name}',
            related_order=order,
        )

    @classmethod
    def notify_order_status_change(cls, order):
        if order.status == 'confirmed':
            EmailService.send_order_confirmed(order)
        elif order.status == 'delivered':
            EmailService.send_order_delivered(order)

    @classmethod
    def notify_contact_submission(cls, submission):
        Notification.objects.create(
            notification_type='contact_submission',
            title=f'New Contact: {submission.name}',
            message=submission.message[:200],
        )

    @classmethod
    def notify_booking_submission(cls, inquiry):
        label = inquiry.get_inquiry_type_display()
        service = ''
        if inquiry.event_service:
            service = inquiry.event_service.name
        elif inquiry.training_program:
            service = inquiry.training_program.title
        Notification.objects.create(
            notification_type='booking_inquiry',
            title=f'New Booking: {inquiry.full_name}',
            message=f'{label} — {service}. Guests: {inquiry.guest_count or "N/A"}',
            metadata={'inquiry_id': inquiry.id, 'email': inquiry.email},
        )
