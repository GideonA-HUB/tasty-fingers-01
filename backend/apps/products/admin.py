from datetime import timedelta

from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html

from .models import Category, Product, ProductImage, ProductVideo, ProductReview


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order', 'preview']
    readonly_fields = ['preview']
    verbose_name = 'Meal Image'
    verbose_name_plural = 'Meal Images'

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:60px;border-radius:4px;" />', obj.image.url)
        return '-'
    preview.short_description = 'Preview'


class ProductVideoInline(admin.TabularInline):
    model = ProductVideo
    extra = 0
    fields = ['video', 'title', 'order']
    verbose_name = 'Meal Video'
    verbose_name_plural = 'Meal Videos'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_featured', 'is_active', 'order', 'product_count']
    list_filter = ['is_featured', 'is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'price', 'sale_price', 'stock', 'density',
        'is_featured', 'is_bestseller', 'is_new_arrival', 'is_flash_sale', 'is_active',
    ]
    list_filter = [
        'category', 'is_featured', 'is_bestseller', 'is_new_arrival',
        'is_flash_sale', 'is_active', 'is_archived',
    ]
    search_fields = ['name', 'sku', 'description', 'short_description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductVideoInline]
    fieldsets = (
        ('Meal Details', {
            'fields': ('name', 'slug', 'category', 'sku', 'short_description', 'description'),
            'description': 'Core information shown on the menu and meal detail page.',
        }),
        ('Pricing & Availability', {
            'fields': ('price', 'sale_price', 'stock', 'density'),
            'description': 'Set meal price, optional deal price, available quantity, and portion size.',
        }),
        ('Menu Placement', {
            'fields': (
                'is_featured',
                'is_bestseller',
                'is_new_arrival',
                'is_flash_sale',
                'flash_sale_start_at',
                'flash_sale_end_at',
                'is_active',
                'is_archived',
            ),
            'description': (
                'Featured = Chef’s Picks · Bestseller = Popular Meals · '
                'New Arrival = Tasty Combos · Today’s Deal = limited-time offers.'
            ),
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',),
        }),
    )
    actions = [
        'mark_featured',
        'mark_bestseller',
        'start_todays_deal',
        'stop_todays_deal',
        'archive_meals',
    ]

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        formfield = super().formfield_for_dbfield(db_field, request, **kwargs)
        labels = {
            'is_featured': "Chef's Pick (Featured)",
            'is_bestseller': 'Popular Meal',
            'is_new_arrival': 'Tasty Combo',
            'is_flash_sale': "Today's Deal",
            'flash_sale_start_at': "Deal starts at",
            'flash_sale_end_at': "Deal ends at",
            'density': 'Portion / Size',
            'stock': 'Available Quantity',
            'sale_price': 'Deal Price (optional)',
            'sku': 'Meal Code (SKU)',
            'is_active': 'Available on menu',
            'is_archived': 'Archived (hidden)',
        }
        if db_field.name in labels and formfield is not None:
            formfield.label = labels[db_field.name]
        helps = {
            'flash_sale_start_at': 'When this deal becomes active on the storefront.',
            'flash_sale_end_at': 'When this deal ends on the storefront.',
            'density': 'e.g. Small, Medium, Large, Family Pack, Combo',
            'stock': 'How many portions are currently available to order.',
        }
        if db_field.name in helps and formfield is not None:
            formfield.help_text = helps[db_field.name]
        return formfield

    @admin.action(description="Mark as Chef's Pick")
    def mark_featured(self, request, queryset):
        queryset.update(is_featured=True)

    @admin.action(description='Mark as Popular Meal')
    def mark_bestseller(self, request, queryset):
        queryset.update(is_bestseller=True)

    @admin.action(description="Start 3-day Today's Deal for selected")
    def start_todays_deal(self, request, queryset):
        now = timezone.now()
        queryset.update(
            is_flash_sale=True,
            flash_sale_start_at=now,
            flash_sale_end_at=now + timedelta(days=3),
        )

    @admin.action(description="Stop Today's Deal for selected")
    def stop_todays_deal(self, request, queryset):
        queryset.update(
            is_flash_sale=False,
            flash_sale_start_at=None,
            flash_sale_end_at=None,
        )

    @admin.action(description='Archive selected meals')
    def archive_meals(self, request, queryset):
        queryset.update(is_archived=True, is_active=False)


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ['name', 'product', 'rating', 'is_approved', 'created_at']
    list_filter = ['rating', 'is_approved', 'created_at']
    search_fields = ['name', 'email', 'comment', 'product__name']
    list_editable = ['is_approved']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['approve_reviews', 'reject_reviews']

    @admin.action(description='Approve selected reviews')
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)

    @admin.action(description='Reject selected reviews')
    def reject_reviews(self, request, queryset):
        queryset.update(is_approved=False)
