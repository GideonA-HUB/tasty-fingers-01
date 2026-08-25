from django.conf import settings

from apps.core.resend_client import send_html_email_async


def send_order_confirmation_email(order):
    """Customer email after checkout — order received, awaiting payment."""
    send_html_email_async(
        to=order.email,
        subject=f'Order Received — {order.order_number} | {settings.SITE_NAME}',
        template_name='emails/order_confirmation.html',
        context={
            'order': order,
            'order_items': order.items.all(),
            'is_paid': order.is_paid,
        },
    )


def send_order_notification_email(order):
    """Owner email when a new order is placed."""
    send_html_email_async(
        to=settings.ADMIN_EMAIL,
        subject=f'New Order — {order.order_number} | ₦{order.total:,.0f}',
        template_name='emails/order_notification.html',
        context={
            'order': order,
            'order_items': order.items.all(),
            'admin_email': settings.ADMIN_EMAIL,
        },
    )


def send_payment_confirmation_email(order):
    """Customer email after successful payment — includes transaction ID."""
    send_html_email_async(
        to=order.email,
        subject=f'Payment Confirmed — {order.order_number} | {settings.SITE_NAME}',
        template_name='emails/payment_confirmation.html',
        context={
            'order': order,
            'order_items': order.items.all(),
        },
    )


def send_payment_admin_notification(order):
    """Owner email when payment is confirmed."""
    send_html_email_async(
        to=settings.ADMIN_EMAIL,
        subject=f'Payment Received — {order.full_name} paid for {order.order_number} | ₦{order.total:,.0f}',
        template_name='emails/payment_admin_notification.html',
        context={
            'order': order,
            'order_items': order.items.all(),
        },
    )


def send_newsletter_confirmation_email(subscriber):
    """Welcome email after newsletter subscription."""
    send_html_email_async(
        to=subscriber.email,
        subject=f"Welcome to {settings.SITE_NAME} — You're In!",
        template_name='emails/newsletter_confirmation.html',
        context={'subscription': subscriber},
    )


def send_order_status_email(order, status_label):
    """Customer email when order status changes (confirmed, shipped, delivered)."""
    send_html_email_async(
        to=order.email,
        subject=f'{status_label} — {order.order_number} | {settings.SITE_NAME}',
        template_name='emails/order_status.html',
        context={
            'order': order,
            'status_label': status_label,
        },
    )


def send_contact_notification_email(submission):
    """Owner email when someone submits the contact form."""
    send_html_email_async(
        to=settings.ADMIN_EMAIL,
        subject=f'New Contact Message — {submission.name}',
        template_name='emails/contact_notification.html',
        context={'submission': submission},
    )


def send_booking_notification_email(inquiry):
    """Owner email when a booking/training inquiry is submitted."""
    send_html_email_async(
        to=settings.ADMIN_EMAIL,
        subject=f'New Booking Inquiry — {inquiry.full_name} | {settings.SITE_NAME}',
        template_name='emails/booking_notification.html',
        context={'inquiry': inquiry},
    )
