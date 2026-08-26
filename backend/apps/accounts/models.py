import uuid

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


AVATAR_CHOICES = [
    ('chef', 'Chef'),
    ('plate', 'Plate'),
    ('jollof', 'Jollof Bowl'),
    ('pepper', 'Pepper'),
    ('fork', 'Fork & Knife'),
    ('smile', 'Smile'),
    ('star', 'Star'),
    ('heart', 'Heart'),
]


class CustomerProfile(models.Model):
    """Storefront customer profile — unique ID, avatar, contact details."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer_profile',
    )
    customer_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        help_text='Unique public customer ID, e.g. TF-A1B2C3D4',
    )
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.CharField(
        max_length=30,
        choices=AVATAR_CHOICES,
        default='chef',
        help_text='Selected profile avatar',
    )
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Customer Profile'
        verbose_name_plural = 'Customer Profiles'

    def __str__(self):
        return f'{self.customer_id} — {self.user.get_full_name() or self.user.email}'

    def save(self, *args, **kwargs):
        if not self.customer_id:
            self.customer_id = f'TF-{uuid.uuid4().hex[:8].upper()}'
        super().save(*args, **kwargs)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def ensure_customer_profile(sender, instance, created, **kwargs):
    """Create a profile for non-staff users on signup."""
    if created and not instance.is_staff:
        CustomerProfile.objects.get_or_create(user=instance)
