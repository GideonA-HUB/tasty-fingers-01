from django.db import models


class SiteAsset(models.Model):
    ASSET_TYPES = [
        ('favicon', 'Favicon'),
        ('logo', 'Logo'),
        ('logo_light', 'Logo Light'),
        ('logo_dark', 'Logo Dark'),
        ('hero_banner', 'Hero Banner'),
        ('about_image', 'About Image'),
    ]

    asset_type = models.CharField(max_length=20, choices=ASSET_TYPES, unique=True)
    image = models.ImageField(upload_to='site_assets/')
    alt_text = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Asset'
        verbose_name_plural = 'Site Assets'

    def __str__(self):
        return f'{self.get_asset_type_display()}'


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default='Tasty Fingers')
    tagline = models.CharField(max_length=255, default='Premium Restaurant & Food Ordering')
    meta_description = models.TextField(blank=True)
    meta_keywords = models.TextField(blank=True)
    contact_email = models.EmailField(default='contact@tastyfingers.com')
    contact_phone = models.CharField(max_length=20, blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    instagram_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    tiktok_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    about_title = models.CharField(max_length=255, blank=True)
    about_subtitle = models.CharField(
        max_length=255,
        blank=True,
        default='Fresh Meals, Delivered with Care',
        help_text='Subtitle shown below the About page heading',
    )
    about_content = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    brand_story = models.TextField(blank=True)
    ceo_name = models.CharField(max_length=120, blank=True, help_text='CEO / Founder display name')
    ceo_title = models.CharField(max_length=120, blank=True, default='Founder & CEO')
    ceo_bio = models.TextField(blank=True, help_text='Short biography shown on the About page')
    ceo_photo = models.ImageField(upload_to='about/', blank=True, null=True)
    privacy_policy = models.TextField(blank=True)
    terms_of_service = models.TextField(blank=True)
    refund_policy = models.TextField(blank=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=4000)
    currency = models.CharField(max_length=3, default='NGN')
    currency_symbol = models.CharField(max_length=5, default='₦')
    is_vat_inclusive = models.BooleanField(default=False)
    vat_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    instagram_feed_enabled = models.BooleanField(default=False)
    instagram_access_token = models.CharField(max_length=500, blank=True)
    why_choose_title = models.CharField(max_length=255, default='Why Choose Tasty Fingers')
    why_choose_subtitle = models.CharField(
        max_length=500,
        blank=True,
        default='Fresh flavours, generous portions, delivered with care',
    )
    testimonials_title = models.CharField(
        max_length=255,
        blank=True,
        default='What Our Guests Say',
        help_text='Homepage testimonials section title',
    )
    testimonials_subtitle = models.CharField(
        max_length=500,
        blank=True,
        default='Real stories from real customers who have experienced the Tasty Fingers difference',
        help_text='Homepage testimonials section subtitle',
    )
    # Homepage hero (PulseFit-style) — editable in Django admin + owner dashboard
    hero_eyebrow = models.CharField(
        max_length=120,
        blank=True,
        default='Premium Restaurant',
        help_text='Small label above the homepage hero title',
    )
    hero_title = models.CharField(
        max_length=200,
        blank=True,
        default='Order Your Favourite Meals',
        help_text='Main homepage hero headline',
    )
    hero_subtitle = models.TextField(
        blank=True,
        default=(
            'Explore our menu of Nigerian classics and chef specials — rice dishes, soups, '
            'peppered meats, seafood, snacks, and drinks. Freshly prepared for delivery or pickup.'
        ),
        help_text='Supporting text under the homepage hero title',
    )
    hero_primary_cta_label = models.CharField(max_length=60, blank=True, default='View Menu')
    hero_primary_cta_url = models.CharField(max_length=255, blank=True, default='/shop')
    hero_secondary_cta_label = models.CharField(max_length=60, blank=True, default='Browse Categories')
    hero_secondary_cta_url = models.CharField(max_length=255, blank=True, default='/categories')
    hero_disclaimer = models.CharField(
        max_length=200,
        blank=True,
        default='Delivery & pickup · Secure checkout · Freshly prepared meals',
    )
    hero_social_proof_text = models.CharField(
        max_length=120,
        blank=True,
        default='Trusted by food lovers across Nigeria',
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class CurrencySettings(models.Model):
    """Singleton FX rates and delivery fees — base prices are always in NGN."""

    ngn_per_usd = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        default=1450,
        help_text='NGN per 1 USD (e.g. 1450 means $1 = ₦1,450)',
    )
    ngn_per_gbp = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        default=1920,
        help_text='NGN per 1 GBP (e.g. 1920 means £1 = ₦1,920)',
    )
    ngn_per_cad = models.DecimalField(
        max_digits=12,
        decimal_places=4,
        default=1100,
        help_text='NGN per 1 CAD (e.g. 1100 means C$1 = ₦1,100)',
    )
    local_delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=4000,
        help_text='Flat delivery fee for orders within Nigeria (NGN)',
    )
    international_delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=50000,
        help_text='Flat delivery fee for US, UK, and Canada orders (NGN)',
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Store currency & FX'
        verbose_name_plural = 'Store currency & FX'

    def __str__(self):
        return 'Store currency & FX'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    company_logo = models.ImageField(upload_to='testimonials/logos/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.name


class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} - {self.email}'


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email


class WhyChooseItem(models.Model):
    """Homepage parallax feature card — up to 7 items, managed in Django admin."""
    title = models.CharField(max_length=120)
    description = models.TextField()
    image = models.ImageField(upload_to='why_choose/', blank=True, null=True)
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(
        default=0,
        help_text='Display order in parallax (0 = first layer, max 6)',
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Why Choose Item'
        verbose_name_plural = 'Why Choose Items'

    def __str__(self):
        return self.title


class HeroImage(models.Model):
    image = models.ImageField(upload_to='hero_images/')
    alt_text = models.CharField(max_length=255, blank=True)
    category = models.CharField(
        max_length=80,
        blank=True,
        default='COLLECTION',
        help_text='Small label on the homepage hero carousel card (e.g. JOLLOF, SOUPS)',
    )
    title = models.CharField(
        max_length=160,
        blank=True,
        default='',
        help_text='Title shown on the homepage hero carousel card',
    )
    link_url = models.CharField(
        max_length=255,
        blank=True,
        default='/shop',
        help_text='Where the carousel card navigates when clicked',
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Hero Image'
        verbose_name_plural = 'Hero Images'

    def __str__(self):
        return self.title or self.alt_text or f'Hero Image {self.order}'


class AdminActivityLog(models.Model):
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('status_change', 'Status Change'),
    ]

    user = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=100, blank=True)
    object_id = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} - {self.action} - {self.created_at}'


class SaleAnnouncement(models.Model):
    """Homepage sale / preorder announcement — images and copy managed in Django admin."""

    title = models.CharField(max_length=120, default='Weekend Meal Deals')
    badge_text = models.CharField(max_length=80, blank=True, default='CHEF SPECIALS')
    headline = models.CharField(
        max_length=160,
        blank=True,
        default='Fresh meals at special prices',
    )
    offer_website = models.CharField(max_length=80, blank=True, default='10% OFF WEBSITE ORDERS')
    offer_whatsapp = models.CharField(max_length=80, blank=True, default='FREE DRINK ON COMBO MEALS')
    offer_extra = models.CharField(max_length=80, blank=True, default='FAMILY PACK DEALS')
    marquee_text = models.TextField(
        default=(
            'Tasty Fingers presents Weekend Meal Deals — freshly prepared favourites at special prices '
            'with 10% off website orders, free drink on combo meals, and family pack deals. '
            'Please read our Terms of Service before ordering.'
        ),
        help_text='Continuous scrolling announcement text shown on the homepage banner.',
    )
    megaphone_image = models.ImageField(
        upload_to='announcements/',
        blank=True,
        null=True,
        help_text='Optional megaphone / shout graphic (left side on desktop).',
    )
    poster_image = models.ImageField(
        upload_to='announcements/',
        blank=True,
        null=True,
        help_text='Optional sale poster graphic (right side / mobile hero).',
    )
    cta_label = models.CharField(max_length=60, blank=True, default='Order Specials')
    cta_url = models.CharField(max_length=255, blank=True, default='/shop')
    start_date = models.DateField(null=True, blank=True, help_text='Promo start date')
    end_date = models.DateField(null=True, blank=True, help_text='Promo end date')
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text='Lower numbers appear first when several are active.')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-updated_at']
        verbose_name = 'Sale announcement'
        verbose_name_plural = 'Sale announcements'

    def __str__(self):
        return self.title


class EventServiceType(models.Model):
    """Catering event types — birthdays, weddings, outdoor events, etc."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='booking_services/', blank=True, null=True)
    starting_price = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        help_text='Optional starting price in NGN',
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Event Service Type'
        verbose_name_plural = 'Event Service Types'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class TrainingProgram(models.Model):
    """Culinary training programs offered by Tasty Fingers."""

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    duration = models.CharField(max_length=100, blank=True, help_text='e.g. 4 weeks, 2 days')
    price = models.DecimalField(max_digits=12, decimal_places=2)
    image = models.ImageField(upload_to='training_programs/', blank=True, null=True)
    highlights = models.TextField(
        blank=True,
        help_text='One highlight per line (shown on the bookings page)',
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Training Program'
        verbose_name_plural = 'Training Programs'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class BookingInquiry(models.Model):
    """Customer event catering or training inquiries."""

    INQUIRY_TYPES = [
        ('event', 'Event Catering'),
        ('training', 'Training Program'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Under Review'),
        ('quoted', 'Quote Sent'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    EVENT_SIZES = [
        ('small', 'Small (1–25 guests)'),
        ('medium', 'Medium (26–75 guests)'),
        ('large', 'Large (76–150 guests)'),
        ('xlarge', 'Extra Large (150+ guests)'),
    ]

    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPES)
    event_service = models.ForeignKey(
        EventServiceType, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='inquiries',
    )
    training_program = models.ForeignKey(
        TrainingProgram, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='inquiries',
    )
    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    organization = models.CharField(max_length=200, blank=True)
    event_date = models.DateField(null=True, blank=True)
    event_time = models.TimeField(null=True, blank=True)
    event_location = models.CharField(max_length=300, blank=True)
    guest_count = models.PositiveIntegerField(null=True, blank=True)
    event_size = models.CharField(max_length=20, choices=EVENT_SIZES, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    menu_preferences = models.TextField(blank=True, help_text='Preferred meals, dietary needs, etc.')
    message = models.TextField(blank=True)
    reference_image = models.ImageField(upload_to='booking_references/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Booking Inquiry'
        verbose_name_plural = 'Booking Inquiries'

    def __str__(self):
        return f'{self.full_name} — {self.get_inquiry_type_display()} ({self.status})'

