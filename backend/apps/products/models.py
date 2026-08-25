from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    item_count_display = models.PositiveIntegerField(default=0, help_text='Display count override')
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Food Category'
        verbose_name_plural = 'Food Categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def product_count(self):
        return self.products.filter(is_active=True, is_archived=False).count()


LENGTH_CHOICES = [
    ('8', '8"'), ('10', '10"'), ('12', '12"'), ('14', '14"'), ('16', '16"'),
    ('18', '18"'), ('20', '20"'), ('22', '22"'), ('24', '24"'),
    ('26', '26"'), ('28', '28"'), ('30', '30"'), ('32', '32"'),
    ('34', '34"'), ('36', '36"'), ('40', '40"'),
]

LACE_TYPE_CHOICES = [
    ('hd_lace', 'HD Lace'),
    ('transparent_lace', 'Transparent Lace'),
    ('swiss_lace', 'Swiss Lace'),
    ('frontal', 'Frontal'),
    ('closure', 'Closure'),
    ('fringe', 'Fringe'),
    ('full_lace', 'Full Lace'),
    ('glueless', 'Glueless'),
    ('none', 'None'),
]


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    sale_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    length = models.CharField(max_length=5, choices=LENGTH_CHOICES, blank=True)
    density = models.CharField(
        'Portion / Size',
        max_length=50,
        blank=True,
        help_text='Portion or size label, e.g. Small, Medium, Large, Family Pack',
    )
    lace_type = models.CharField(max_length=30, choices=LACE_TYPE_CHOICES, blank=True)
    color = models.CharField(max_length=100, blank=True)
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, blank=True, unique=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    is_flash_sale = models.BooleanField(default=False)
    flash_sale_start_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text='When this meal’s flash sale becomes active on the storefront.',
    )
    flash_sale_end_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text='When this meal’s flash sale ends on the storefront.',
    )
    is_active = models.BooleanField(default=True)
    is_archived = models.BooleanField(default=False)
    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Meal'
        verbose_name_plural = 'Meals'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base_slug}-{counter}'
                counter += 1
            self.slug = slug

        if self.is_flash_sale:
            now = timezone.now()
            if not self.flash_sale_start_at:
                self.flash_sale_start_at = now
            if not self.flash_sale_end_at:
                self.flash_sale_end_at = self.flash_sale_start_at + timedelta(days=3)
            elif self.flash_sale_end_at <= self.flash_sale_start_at:
                self.flash_sale_end_at = self.flash_sale_start_at + timedelta(days=3)
        else:
            self.flash_sale_start_at = None
            self.flash_sale_end_at = None
        super().save(*args, **kwargs)

    @property
    def current_price(self):
        if self.sale_price and self.sale_price < self.price:
            return self.sale_price
        return self.price

    @property
    def is_on_sale(self):
        return self.sale_price is not None and self.sale_price < self.price

    @property
    def discount_percentage(self):
        if self.is_on_sale:
            return int(((self.price - self.sale_price) / self.price) * 100)
        return 0

    @property
    def primary_image(self):
        img = self.images.filter(is_primary=True).first()
        if not img:
            img = self.images.first()
        return img

    @property
    def in_stock(self):
        return self.stock > 0


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f'{self.product.name} - Image {self.order}'

    def save(self, *args, **kwargs):
        if self.is_primary:
            ProductImage.objects.filter(product=self.product, is_primary=True).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


class ProductVideo(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='videos')
    video = models.FileField(upload_to='products/videos/')
    title = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f'{self.product.name} - Video'


class ProductReview(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    rating = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Meal Review'
        verbose_name_plural = 'Meal Reviews'

    def __str__(self):
        return f'{self.name} - {self.product.name} ({self.rating}/5)'
