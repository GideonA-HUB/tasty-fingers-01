# Generated for customer profiles

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomerProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer_id', models.CharField(editable=False, help_text='Unique public customer ID, e.g. TF-A1B2C3D4', max_length=20, unique=True)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('avatar', models.CharField(choices=[('chef', 'Chef'), ('plate', 'Plate'), ('jollof', 'Jollof Bowl'), ('pepper', 'Pepper'), ('fork', 'Fork & Knife'), ('smile', 'Smile'), ('star', 'Star'), ('heart', 'Heart')], default='chef', help_text='Selected profile avatar', max_length=30)),
                ('address', models.TextField(blank=True)),
                ('city', models.CharField(blank=True, max_length=100)),
                ('state', models.CharField(blank=True, max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='customer_profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Customer Profile',
                'verbose_name_plural': 'Customer Profiles',
                'ordering': ['-created_at'],
            },
        ),
    ]
