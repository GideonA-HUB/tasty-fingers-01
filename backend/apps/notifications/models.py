from django.db import models


class Notification(models.Model):
    TYPE_CHOICES = [
        ('new_order', 'New Order'),
        ('payment_received', 'Payment Received'),
        ('large_order', 'Large Order Alert'),
        ('order_cancelled', 'Order Cancelled'),
        ('contact_submission', 'Contact Submission'),
        ('booking_inquiry', 'Booking Inquiry'),
        ('low_stock', 'Low Stock'),
        ('daily_summary', 'Daily Summary'),
        ('weekly_summary', 'Weekly Summary'),
        ('monthly_summary', 'Monthly Summary'),
    ]

    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_order = models.ForeignKey(
        'orders.Order', on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications'
    )
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
