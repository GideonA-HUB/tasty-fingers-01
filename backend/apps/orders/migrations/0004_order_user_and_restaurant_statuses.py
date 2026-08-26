# Generated for order user link + restaurant statuses

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('orders', '0003_order_delivery_type_order_international_region'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='user',
            field=models.ForeignKey(
                blank=True,
                help_text='Linked customer account (optional for guest checkout)',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='orders',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(
                choices=[
                    ('pending', 'Pending Payment'),
                    ('paid', 'Paid'),
                    ('confirmed', 'Confirmed'),
                    ('preparing', 'Preparing'),
                    ('ready', 'Ready for Pickup'),
                    ('out_for_delivery', 'Out for Delivery'),
                    ('processing', 'Preparing'),
                    ('shipped', 'Out for Delivery'),
                    ('delivered', 'Delivered'),
                    ('cancelled', 'Cancelled'),
                    ('refunded', 'Refunded'),
                ],
                default='pending',
                max_length=20,
            ),
        ),
    ]
