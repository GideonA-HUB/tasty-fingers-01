from rest_framework import serializers

from apps.core.media import absolute_media_url

from .models import (
    AdminActivityLog,
    BookingInquiry,
    ContactSubmission,
    EventServiceType,
    HeroImage,
    NewsletterSubscriber,
    SiteAsset,
    SiteSettings,
    CurrencySettings,
    SaleAnnouncement,
    Testimonial,
    TrainingProgram,
    WhyChooseItem,
)


class SiteSettingsSerializer(serializers.ModelSerializer):
    ceo_photo = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            'site_name', 'tagline', 'meta_description', 'meta_keywords',
            'contact_email', 'contact_phone', 'whatsapp_number', 'address',
            'instagram_url', 'facebook_url', 'twitter_url', 'tiktok_url', 'youtube_url',
            'about_title', 'about_subtitle', 'about_content',
            'mission', 'vision', 'brand_story',
            'ceo_name', 'ceo_title', 'ceo_bio', 'ceo_photo',
            'privacy_policy', 'terms_of_service', 'refund_policy',
            'delivery_fee', 'currency', 'currency_symbol',
            'is_vat_inclusive', 'vat_rate',
            'why_choose_title', 'why_choose_subtitle',
            'testimonials_title', 'testimonials_subtitle',
            'hero_eyebrow', 'hero_title', 'hero_subtitle',
            'hero_primary_cta_label', 'hero_primary_cta_url',
            'hero_secondary_cta_label', 'hero_secondary_cta_url',
            'hero_disclaimer', 'hero_social_proof_text',
        ]

    def get_ceo_photo(self, obj):
        return absolute_media_url(self.context.get('request'), obj.ceo_photo)


class SiteAssetSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = SiteAsset
        fields = ['asset_type', 'image', 'alt_text']

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)


class TestimonialSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    company_logo = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = [
            'id', 'name', 'role', 'content', 'rating',
            'image', 'company_logo', 'is_featured', 'is_active', 'order',
        ]

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)

    def get_company_logo(self, obj):
        return absolute_media_url(self.context.get('request'), obj.company_logo)


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['id', 'name', 'email', 'phone', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'is_read', 'created_at']


class NewsletterSubscribeSerializer(serializers.Serializer):
    """Accept newsletter sign-ups; allow re-subscription without 400 on duplicate email."""

    email = serializers.EmailField()

    def validate_email(self, value):
        return value.strip().lower()

    def create(self, validated_data):
        email = validated_data['email']
        subscriber, _created = NewsletterSubscriber.objects.get_or_create(
            email=email,
            defaults={'is_active': True},
        )
        if not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save(update_fields=['is_active'])
        return subscriber


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'is_active', 'subscribed_at']


class HeroImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = HeroImage
        fields = ['id', 'image', 'alt_text', 'category', 'title', 'link_url', 'order', 'is_active']

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)


class WhyChooseItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = WhyChooseItem
        fields = ['id', 'title', 'description', 'image', 'alt_text', 'order', 'is_active']

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)


class AdminActivityLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = AdminActivityLog
        fields = [
            'id', 'user', 'action', 'model_name', 'object_id',
            'description', 'ip_address', 'created_at',
        ]


class CurrencySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencySettings
        fields = [
            'ngn_per_usd',
            'ngn_per_gbp',
            'ngn_per_cad',
            'local_delivery_fee',
            'international_delivery_fee',
            'updated_at',
        ]
        read_only_fields = ['updated_at']


class SaleAnnouncementSerializer(serializers.ModelSerializer):
    megaphone_image = serializers.SerializerMethodField()
    poster_image = serializers.SerializerMethodField()

    class Meta:
        model = SaleAnnouncement
        fields = [
            'id',
            'title',
            'badge_text',
            'headline',
            'offer_website',
            'offer_whatsapp',
            'offer_extra',
            'marquee_text',
            'megaphone_image',
            'poster_image',
            'cta_label',
            'cta_url',
            'start_date',
            'end_date',
            'is_active',
            'order',
        ]

    def get_megaphone_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.megaphone_image)

    def get_poster_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.poster_image)


class EventServiceTypeSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = EventServiceType
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'starting_price', 'is_active', 'order',
        ]

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)


class TrainingProgramSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    highlights_list = serializers.SerializerMethodField()

    class Meta:
        model = TrainingProgram
        fields = [
            'id', 'title', 'slug', 'description', 'duration', 'price',
            'image', 'highlights', 'highlights_list', 'is_active', 'order',
        ]

    def get_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.image)

    def get_highlights_list(self, obj):
        if not obj.highlights:
            return []
        return [line.strip() for line in obj.highlights.splitlines() if line.strip()]


class BookingInquiryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingInquiry
        fields = [
            'inquiry_type', 'event_service', 'training_program',
            'full_name', 'email', 'phone', 'organization',
            'event_date', 'event_time', 'event_location',
            'guest_count', 'event_size', 'budget',
            'menu_preferences', 'message', 'reference_image',
        ]

    def validate(self, data):
        inquiry_type = data.get('inquiry_type')
        if inquiry_type == 'event' and not data.get('event_service'):
            raise serializers.ValidationError({'event_service': 'Please select an event type.'})
        if inquiry_type == 'training' and not data.get('training_program'):
            raise serializers.ValidationError({'training_program': 'Please select a training program.'})
        return data


class BookingInquirySerializer(serializers.ModelSerializer):
    event_service_name = serializers.CharField(source='event_service.name', read_only=True, default='')
    training_program_title = serializers.CharField(source='training_program.title', read_only=True, default='')
    reference_image = serializers.SerializerMethodField()
    inquiry_type_display = serializers.CharField(source='get_inquiry_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    event_size_display = serializers.CharField(source='get_event_size_display', read_only=True)

    class Meta:
        model = BookingInquiry
        fields = [
            'id', 'inquiry_type', 'inquiry_type_display',
            'event_service', 'event_service_name',
            'training_program', 'training_program_title',
            'full_name', 'email', 'phone', 'organization',
            'event_date', 'event_time', 'event_location',
            'guest_count', 'event_size', 'event_size_display',
            'budget', 'menu_preferences', 'message',
            'reference_image', 'status', 'status_display',
            'admin_notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_reference_image(self, obj):
        return absolute_media_url(self.context.get('request'), obj.reference_image)
