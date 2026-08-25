import os
from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management import call_command
from django.core.management.base import BaseCommand

from apps.products.models import Product
from apps.site_config.default_policies import (
    DEFAULT_PRIVACY_POLICY,
    DEFAULT_REFUND_POLICY,
    DEFAULT_TERMS_OF_SERVICE,
)
from apps.site_config.models import SiteSettings, Testimonial, WhyChooseItem


class Command(BaseCommand):
    help = 'Seed initial data for Tasty Fingers'

    def handle(self, *args, **options):
        # Always remove legacy hair-type categories that were auto-seeded in older deploys.
        call_command('cleanup_legacy_categories')

        if not User.objects.filter(username='admin').exists():
            admin_password = os.environ.get('ADMIN_INITIAL_PASSWORD', 'admin123!')
            User.objects.create_superuser(
                username='admin',
                email='admin@tastyfingers.com',
                password=admin_password,
            )
            self.stdout.write(self.style.SUCCESS('Admin user created (username: admin)'))
            if admin_password == 'admin123!':
                self.stdout.write(self.style.WARNING('Change the default admin password after first login.'))

        settings, _ = SiteSettings.objects.get_or_create(pk=1)
        settings.site_name = 'Tasty Fingers'
        settings.tagline = 'Premium Restaurant & Food Ordering'
        settings.meta_description = (
            'Order delicious Nigerian and continental meals online from Tasty Fingers — '
            'jollof rice, soups, peppered meats, seafood, snacks, drinks, and combo meals. '
            'Delivery, takeaway, and pickup available.'
        )
        settings.delivery_fee = Decimal('4000')
        settings.currency = 'NGN'
        settings.currency_symbol = '₦'
        settings.is_vat_inclusive = False
        settings.about_title = 'About Tasty Fingers'
        settings.about_subtitle = 'Fresh Meals, Delivered with Care'
        settings.brand_story = (
            'Tasty Fingers was born from a love of bold flavours and generous portions. '
            'We prepare Nigerian favourites and chef specials — from jollof rice and egusi '
            'to peppered turkey, seafood, small chops, and refreshing drinks — for delivery, '
            'takeaway, and pickup across Nigeria.'
        )
        settings.mission = (
            'To serve freshly prepared, flavourful meals that bring comfort and joy '
            'to every table — online, on time, every time.'
        )
        settings.vision = (
            "To become Nigeria's most loved online restaurant for authentic meals, "
            'reliable delivery, and memorable dining experiences.'
        )
        settings.why_choose_title = 'Why Choose Tasty Fingers'
        settings.testimonials_title = 'What Our Guests Say'
        settings.testimonials_subtitle = (
            'Real stories from real customers who have experienced the Tasty Fingers difference'
        )
        settings.why_choose_subtitle = 'Fresh flavours, generous portions, delivered with care'
        settings.hero_eyebrow = 'Premium Restaurant'
        settings.hero_title = 'Order Your Favourite Meals'
        settings.hero_subtitle = (
            'Explore our menu of Nigerian classics and chef specials — rice dishes, soups, '
            'peppered meats, seafood, snacks, and drinks. Freshly prepared for delivery or pickup.'
        )
        settings.hero_primary_cta_label = 'View Menu'
        settings.hero_primary_cta_url = '/shop'
        settings.hero_secondary_cta_label = 'Browse Categories'
        settings.hero_secondary_cta_url = '/categories'
        settings.hero_disclaimer = 'Delivery & pickup · Secure checkout · Freshly prepared meals'
        settings.hero_social_proof_text = 'Trusted by food lovers across Nigeria'
        settings.contact_email = 'contact@tastyfingers.com'
        settings.whatsapp_number = '+2348135380528'
        settings.instagram_url = ''
        settings.tiktok_url = ''
        if not settings.privacy_policy:
            settings.privacy_policy = DEFAULT_PRIVACY_POLICY
        if not settings.terms_of_service:
            settings.terms_of_service = DEFAULT_TERMS_OF_SERVICE
        if not settings.refund_policy:
            settings.refund_policy = DEFAULT_REFUND_POLICY
        settings.save()
        self.stdout.write(self.style.SUCCESS('Site settings configured'))

        self.stdout.write(
            self.style.WARNING(
                'Categories are managed in Django admin — no demo categories are seeded.'
            )
        )

        if Product.objects.exists():
            self.stdout.write('Meals already exist, skipping product seed')
        else:
            self.stdout.write(
                'No meals found. Add meals in Django admin under your food categories '
                '(Rice, Soups, Peppered Meats, Seafood, Drinks, and more).'
            )

        if not WhyChooseItem.objects.exists():
            why_choose_data = [
                ('Freshly Prepared', 'Meals cooked to order with quality ingredients', 0),
                ('Full Menu Variety', 'Rice, soups, meats, seafood, snacks & drinks', 1),
                ('Delivery & Pickup', 'Order online for home delivery or restaurant pickup', 2),
                ('Generous Portions', 'Satisfying servings for individuals and families', 3),
                ('Chef Specials', 'Signature dishes and combo meals worth ordering again', 4),
                ('Fast Kitchen Prep', 'Efficient preparation so your order arrives hot', 5),
                ('Secure Checkout', 'Pay safely online with Paystack or Flutterwave', 6),
            ]
            for title, description, order in why_choose_data:
                WhyChooseItem.objects.create(
                    title=title,
                    description=description,
                    order=order,
                    is_active=True,
                )
            self.stdout.write(self.style.SUCCESS('Why Choose items created (upload images in Django admin)'))

        if not Testimonial.objects.exists():
            Testimonial.objects.create(
                name='Adaeze O.',
                role='Verified Guest',
                content=(
                    'The jollof and peppered turkey were outstanding. Everything arrived hot '
                    'and full of flavour. Tasty Fingers is the real deal!'
                ),
                rating=5,
                is_featured=True,
                order=1,
            )
            Testimonial.objects.create(
                name='Chioma M.',
                role='Loyal Customer',
                content=(
                    "I've ordered from many places but nothing compares. The soups and "
                    'seafood packs are beautifully prepared. Worth every naira.'
                ),
                rating=5,
                is_featured=True,
                order=2,
            )
            self.stdout.write(self.style.SUCCESS('Testimonials created'))

        self.stdout.write(self.style.SUCCESS('Seed complete!'))
