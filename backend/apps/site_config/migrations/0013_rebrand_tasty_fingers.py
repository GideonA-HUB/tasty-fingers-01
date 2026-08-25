# Generated manually for Tasty Fingers rebrand

from decimal import Decimal

from django.db import migrations, models

from apps.site_config.default_policies import (
    DEFAULT_PRIVACY_POLICY,
    DEFAULT_REFUND_POLICY,
    DEFAULT_TERMS_OF_SERVICE,
)

META_DESCRIPTION = (
    'Order delicious Nigerian and continental meals online from Tasty Fingers — '
    'jollof rice, soups, peppered meats, seafood, snacks, drinks, and combo meals. '
    'Delivery, takeaway, and pickup available.'
)

BRAND_STORY = (
    'Tasty Fingers was born from a love of bold flavours and generous portions. '
    'We prepare Nigerian favourites and chef specials — from jollof rice and egusi '
    'to peppered turkey, seafood, small chops, and refreshing drinks — for delivery, '
    'takeaway, and pickup across Nigeria.'
)

MISSION = (
    'To serve freshly prepared, flavourful meals that bring comfort and joy '
    'to every table — online, on time, every time.'
)

VISION = (
    "To become Nigeria's most loved online restaurant for authentic meals, "
    'reliable delivery, and memorable dining experiences.'
)

HERO_SUBTITLE = (
    'Explore our menu of Nigerian classics and chef specials — rice dishes, soups, '
    'peppered meats, seafood, snacks, and drinks. Freshly prepared for delivery or pickup.'
)

TESTIMONIALS_SUBTITLE = (
    'Real stories from real customers who have experienced the Tasty Fingers difference'
)

NEW_MARQUEE = (
    'Tasty Fingers presents Weekend Meal Deals — freshly prepared favourites at special prices '
    'with 10% off website orders, free drink on combo meals, and family pack deals. '
    'Please read our Terms of Service before ordering.'
)

WHY_CHOOSE_DATA = [
    ('Freshly Prepared', 'Meals cooked to order with quality ingredients', 0),
    ('Full Menu Variety', 'Rice, soups, meats, seafood, snacks & drinks', 1),
    ('Delivery & Pickup', 'Order online for home delivery or restaurant pickup', 2),
    ('Generous Portions', 'Satisfying servings for individuals and families', 3),
    ('Chef Specials', 'Signature dishes and combo meals worth ordering again', 4),
    ('Fast Kitchen Prep', 'Efficient preparation so your order arrives hot', 5),
    ('Secure Checkout', 'Pay safely online with Paystack or Flutterwave', 6),
]

# Fashion / accessories titles → restaurant copy
FASHION_WHY_CHOOSE = {
    'Authentic Luxury Pieces': (
        'Freshly Prepared',
        'Meals cooked to order with quality ingredients',
    ),
    'Curated Collections': (
        'Full Menu Variety',
        'Rice, soups, meats, seafood, snacks & drinks',
    ),
    'For Her & Him': (
        'Delivery & Pickup',
        'Order online for home delivery or restaurant pickup',
    ),
    'Gift-Ready': (
        'Generous Portions',
        'Satisfying servings for individuals and families',
    ),
    'Premium Craftsmanship': (
        'Chef Specials',
        'Signature dishes and combo meals worth ordering again',
    ),
    'Authentic Luxury Hair': (
        'Freshly Prepared',
        'Meals cooked to order with quality ingredients',
    ),
    'Global Sourcing': (
        'Full Menu Variety',
        'Rice, soups, meats, seafood, snacks & drinks',
    ),
    'Premium Lace': (
        'Delivery & Pickup',
        'Order online for home delivery or restaurant pickup',
    ),
    'Natural Look': (
        'Generous Portions',
        'Satisfying servings for individuals and families',
    ),
}

FASHION_TOKENS = (
    'jewellery',
    'jewelry',
    'fashion',
    'accessories',
    'luxury',
    'wig',
    'hair',
    'lace',
    'bag',
    'watch',
    'sunglasses',
    'perfume',
    'gift-ready',
    'gift ready',
    'craftsmanship',
    'curated',
    'style',
)

TESTIMONIAL_TOKENS = ('jbluxe', 'fashion', 'jewellery', 'jewelry', 'accessories', 'necklace')

RESTAURANT_TESTIMONIALS = [
    (
        'The jollof and peppered turkey were outstanding. Everything arrived hot '
        'and full of flavour. Tasty Fingers is the real deal!'
    ),
    (
        "I've ordered from many places but nothing compares. The soups and "
        'seafood packs are beautifully prepared. Worth every naira.'
    ),
]


def _contains_any(text, tokens):
    lower = (text or '').lower()
    return any(token in lower for token in tokens)


def rebrand_forward(apps, schema_editor):
    SiteSettings = apps.get_model('site_config', 'SiteSettings')
    SaleAnnouncement = apps.get_model('site_config', 'SaleAnnouncement')
    WhyChooseItem = apps.get_model('site_config', 'WhyChooseItem')
    Testimonial = apps.get_model('site_config', 'Testimonial')

    settings, _ = SiteSettings.objects.get_or_create(pk=1)
    settings.site_name = 'Tasty Fingers'
    settings.tagline = 'Premium Restaurant & Food Ordering'
    settings.meta_description = META_DESCRIPTION
    settings.delivery_fee = Decimal('4000')
    settings.currency = 'NGN'
    settings.currency_symbol = '₦'
    settings.is_vat_inclusive = False
    settings.about_title = 'About Tasty Fingers'
    settings.about_subtitle = 'Fresh Meals, Delivered with Care'
    settings.brand_story = BRAND_STORY
    settings.mission = MISSION
    settings.vision = VISION
    settings.why_choose_title = 'Why Choose Tasty Fingers'
    settings.why_choose_subtitle = 'Fresh flavours, generous portions, delivered with care'
    settings.testimonials_title = 'What Our Guests Say'
    settings.testimonials_subtitle = TESTIMONIALS_SUBTITLE
    settings.hero_eyebrow = 'Premium Restaurant'
    settings.hero_title = 'Order Your Favourite Meals'
    settings.hero_subtitle = HERO_SUBTITLE
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

    for field_name, default_text in (
        ('privacy_policy', DEFAULT_PRIVACY_POLICY),
        ('terms_of_service', DEFAULT_TERMS_OF_SERVICE),
        ('refund_policy', DEFAULT_REFUND_POLICY),
    ):
        current = getattr(settings, field_name, '') or ''
        if 'jbluxe' in current.lower():
            setattr(settings, field_name, default_text)

    settings.save()

    if not WhyChooseItem.objects.exists():
        for title, description, order in WHY_CHOOSE_DATA:
            WhyChooseItem.objects.create(
                title=title,
                description=description,
                order=order,
                is_active=True,
            )
    else:
        for item in WhyChooseItem.objects.all():
            if item.title in FASHION_WHY_CHOOSE:
                item.title, item.description = FASHION_WHY_CHOOSE[item.title]
                item.save()
            elif _contains_any(item.title, FASHION_TOKENS) or _contains_any(
                item.description, FASHION_TOKENS
            ):
                # Map by order index into restaurant defaults when possible
                idx = min(item.order or 0, len(WHY_CHOOSE_DATA) - 1)
                item.title = WHY_CHOOSE_DATA[idx][0]
                item.description = WHY_CHOOSE_DATA[idx][1]
                item.save()

    testimonial_idx = 0
    for t in Testimonial.objects.all():
        if _contains_any(t.content, TESTIMONIAL_TOKENS):
            t.content = RESTAURANT_TESTIMONIALS[testimonial_idx % len(RESTAURANT_TESTIMONIALS)]
            if t.role and _contains_any(t.role, ('client', 'fashion')):
                t.role = 'Verified Guest'
            t.save()
            testimonial_idx += 1

    for announcement in SaleAnnouncement.objects.filter(is_active=True):
        blob = ' '.join(
            [
                announcement.title or '',
                announcement.badge_text or '',
                announcement.headline or '',
                announcement.offer_website or '',
                announcement.offer_whatsapp or '',
                announcement.offer_extra or '',
                announcement.marquee_text or '',
                announcement.cta_label or '',
            ]
        ).lower()
        if any(
            token in blob
            for token in ('jbluxe', 'preorder', 'gift wrap', 'factory prices', 'wigging')
        ):
            announcement.title = 'Weekend Meal Deals'
            announcement.badge_text = 'CHEF SPECIALS'
            announcement.headline = 'Fresh meals at special prices'
            announcement.offer_website = '10% OFF WEBSITE ORDERS'
            announcement.offer_whatsapp = 'FREE DRINK ON COMBO MEALS'
            announcement.offer_extra = 'FAMILY PACK DEALS'
            announcement.marquee_text = NEW_MARQUEE
            announcement.cta_label = 'Order Specials'
            announcement.cta_url = '/shop'
            announcement.save()


def rebrand_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0012_testimonials_section_fields'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sitesettings',
            name='site_name',
            field=models.CharField(default='Tasty Fingers', max_length=100),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='tagline',
            field=models.CharField(default='Premium Restaurant & Food Ordering', max_length=255),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='contact_email',
            field=models.EmailField(default='contact@tastyfingers.com', max_length=254),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='about_subtitle',
            field=models.CharField(
                blank=True,
                default='Fresh Meals, Delivered with Care',
                help_text='Subtitle shown below the About page heading',
                max_length=255,
            ),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='why_choose_title',
            field=models.CharField(default='Why Choose Tasty Fingers', max_length=255),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='why_choose_subtitle',
            field=models.CharField(
                blank=True,
                default='Fresh flavours, generous portions, delivered with care',
                max_length=500,
            ),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='testimonials_title',
            field=models.CharField(
                blank=True,
                default='What Our Guests Say',
                help_text='Homepage testimonials section title',
                max_length=255,
            ),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='testimonials_subtitle',
            field=models.CharField(
                blank=True,
                default=TESTIMONIALS_SUBTITLE,
                help_text='Homepage testimonials section subtitle',
                max_length=500,
            ),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='hero_eyebrow',
            field=models.CharField(
                blank=True,
                default='Premium Restaurant',
                help_text='Small label above the homepage hero title',
                max_length=120,
            ),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='hero_title',
            field=models.CharField(
                blank=True,
                default='Order Your Favourite Meals',
                help_text='Main homepage hero headline',
                max_length=200,
            ),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='hero_subtitle',
            field=models.TextField(
                blank=True,
                default=HERO_SUBTITLE,
                help_text='Supporting text under the homepage hero title',
            ),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='hero_primary_cta_label',
            field=models.CharField(blank=True, default='View Menu', max_length=60),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='hero_disclaimer',
            field=models.CharField(
                blank=True,
                default='Delivery & pickup · Secure checkout · Freshly prepared meals',
                max_length=200,
            ),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='hero_social_proof_text',
            field=models.CharField(
                blank=True,
                default='Trusted by food lovers across Nigeria',
                max_length=120,
            ),
        ),
        migrations.AlterField(
            model_name='saleannouncement',
            name='title',
            field=models.CharField(default='Weekend Meal Deals', max_length=120),
        ),
        migrations.AlterField(
            model_name='saleannouncement',
            name='badge_text',
            field=models.CharField(blank=True, default='CHEF SPECIALS', max_length=80),
        ),
        migrations.AlterField(
            model_name='saleannouncement',
            name='headline',
            field=models.CharField(
                blank=True,
                default='Fresh meals at special prices',
                max_length=160,
            ),
        ),
        migrations.AlterField(
            model_name='saleannouncement',
            name='offer_website',
            field=models.CharField(blank=True, default='10% OFF WEBSITE ORDERS', max_length=80),
        ),
        migrations.AlterField(
            model_name='saleannouncement',
            name='offer_whatsapp',
            field=models.CharField(blank=True, default='FREE DRINK ON COMBO MEALS', max_length=80),
        ),
        migrations.AlterField(
            model_name='saleannouncement',
            name='offer_extra',
            field=models.CharField(blank=True, default='FAMILY PACK DEALS', max_length=80),
        ),
        migrations.AlterField(
            model_name='saleannouncement',
            name='marquee_text',
            field=models.TextField(
                default=NEW_MARQUEE,
                help_text='Continuous scrolling announcement text shown on the homepage banner.',
            ),
        ),
        migrations.AlterField(
            model_name='saleannouncement',
            name='cta_label',
            field=models.CharField(blank=True, default='Order Specials', max_length=60),
        ),
        migrations.RunPython(rebrand_forward, rebrand_reverse),
    ]
