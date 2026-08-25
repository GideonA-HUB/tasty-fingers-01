# Generated for Tasty Fingers bookings & training

from decimal import Decimal

from django.db import migrations, models
import django.db.models.deletion


def seed_booking_defaults(apps, schema_editor):
    EventServiceType = apps.get_model('site_config', 'EventServiceType')
    TrainingProgram = apps.get_model('site_config', 'TrainingProgram')

    services = [
        ('Birthday Party', 'birthday-party', 'Memorable birthday catering with finger foods, jollof, small chops, and custom menus.', Decimal('150000'), 0),
        ('Wedding Reception', 'wedding-reception', 'Elegant wedding catering — full buffet, live stations, and premium service.', Decimal('500000'), 1),
        ('Outdoor Event', 'outdoor-event', 'Garden parties, picnics, beach events, and open-air celebrations.', Decimal('200000'), 2),
        ('Corporate Event', 'corporate-event', 'Office lunches, conferences, product launches, and team celebrations.', Decimal('250000'), 3),
        ('Show & Concert', 'show-concert', 'Backstage catering, VIP lounges, and crowd-ready finger food packages.', Decimal('350000'), 4),
        ('Family Gathering', 'family-gathering', 'Reunions, naming ceremonies, and large family celebrations.', Decimal('180000'), 5),
    ]
    for name, slug, desc, price, order in services:
        EventServiceType.objects.get_or_create(
            slug=slug,
            defaults={
                'name': name,
                'description': desc,
                'starting_price': price,
                'order': order,
                'is_active': True,
            },
        )

    programs = [
        (
            'Professional Finger Food Masterclass',
            'finger-food-masterclass',
            'Learn to prepare premium finger foods, spring rolls, puff-puff variations, and sauced chicken & turkey like a pro.',
            '2 weeks',
            Decimal('85000'),
            'Hands-on kitchen sessions\nRecipe cards included\nCertificate of completion\nSmall batch sizes',
            0,
        ),
        (
            'Nigerian Catering Essentials',
            'catering-essentials',
            'Master jollof, party rice, small chops, and event-scale meal preparation for aspiring caterers.',
            '4 weeks',
            Decimal('150000'),
            'Event planning basics\nPortion scaling\nFood safety & hygiene\nBusiness setup guidance',
            1,
        ),
        (
            'Sauced Meats & Grill Techniques',
            'sauced-meats-grill',
            'Specialized training in peppered chicken, turkey, suya-style grills, and signature Tasty Fingers sauces.',
            '1 week',
            Decimal('65000'),
            'Sauce formulation secrets\nGrill & oven techniques\nPlating for events\nTake-home spice blends',
            2,
        ),
    ]
    for title, slug, desc, duration, price, highlights, order in programs:
        TrainingProgram.objects.get_or_create(
            slug=slug,
            defaults={
                'title': title,
                'description': desc,
                'duration': duration,
                'price': price,
                'highlights': highlights,
                'order': order,
                'is_active': True,
            },
        )


class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0014_alter_heroimage_category_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventServiceType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('slug', models.SlugField(blank=True, max_length=140, unique=True)),
                ('description', models.TextField(blank=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='booking_services/')),
                ('starting_price', models.DecimalField(blank=True, decimal_places=2, help_text='Optional starting price in NGN', max_digits=12, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Event Service Type',
                'verbose_name_plural': 'Event Service Types',
                'ordering': ['order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='TrainingProgram',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('slug', models.SlugField(blank=True, max_length=220, unique=True)),
                ('description', models.TextField()),
                ('duration', models.CharField(blank=True, help_text='e.g. 4 weeks, 2 days', max_length=100)),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('image', models.ImageField(blank=True, null=True, upload_to='training_programs/')),
                ('highlights', models.TextField(blank=True, help_text='One highlight per line (shown on the bookings page)')),
                ('is_active', models.BooleanField(default=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Training Program',
                'verbose_name_plural': 'Training Programs',
                'ordering': ['order', 'title'],
            },
        ),
        migrations.CreateModel(
            name='BookingInquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inquiry_type', models.CharField(choices=[('event', 'Event Catering'), ('training', 'Training Program')], max_length=20)),
                ('full_name', models.CharField(max_length=120)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=20)),
                ('organization', models.CharField(blank=True, max_length=200)),
                ('event_date', models.DateField(blank=True, null=True)),
                ('event_time', models.TimeField(blank=True, null=True)),
                ('event_location', models.CharField(blank=True, max_length=300)),
                ('guest_count', models.PositiveIntegerField(blank=True, null=True)),
                ('event_size', models.CharField(blank=True, choices=[('small', 'Small (1–25 guests)'), ('medium', 'Medium (26–75 guests)'), ('large', 'Large (76–150 guests)'), ('xlarge', 'Extra Large (150+ guests)')], max_length=20)),
                ('budget', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('menu_preferences', models.TextField(blank=True, help_text='Preferred meals, dietary needs, etc.')),
                ('message', models.TextField(blank=True)),
                ('reference_image', models.ImageField(blank=True, null=True, upload_to='booking_references/')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('reviewing', 'Under Review'), ('quoted', 'Quote Sent'), ('confirmed', 'Confirmed'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('admin_notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('event_service', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inquiries', to='site_config.eventservicetype')),
                ('training_program', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='inquiries', to='site_config.trainingprogram')),
            ],
            options={
                'verbose_name': 'Booking Inquiry',
                'verbose_name_plural': 'Booking Inquiries',
                'ordering': ['-created_at'],
            },
        ),
        migrations.RunPython(seed_booking_defaults, migrations.RunPython.noop),
    ]
