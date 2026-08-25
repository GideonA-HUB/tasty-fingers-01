import logging

from django.http import HttpResponse
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminUser
from apps.core.email_utils import send_newsletter_confirmation_email
from apps.notifications.services import EmailService, NotificationService

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
from .serializers import (
    AdminActivityLogSerializer,
    BookingInquiryCreateSerializer,
    BookingInquirySerializer,
    ContactSubmissionSerializer,
    CurrencySettingsSerializer,
    EventServiceTypeSerializer,
    HeroImageSerializer,
    NewsletterSubscribeSerializer,
    NewsletterSubscriberSerializer,
    SaleAnnouncementSerializer,
    SiteAssetSerializer,
    SiteSettingsSerializer,
    TestimonialSerializer,
    TrainingProgramSerializer,
    WhyChooseItemSerializer,
)

logger = logging.getLogger(__name__)


class SiteSettingsView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        settings_obj = SiteSettings.get_settings()
        return Response(SiteSettingsSerializer(settings_obj, context={'request': request}).data)


class CurrencySettingsView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        settings_obj = CurrencySettings.get_settings()
        return Response(CurrencySettingsSerializer(settings_obj).data)


class SaleAnnouncementsView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = SaleAnnouncementSerializer
    pagination_class = None

    def get_queryset(self):
        from datetime import date
        from django.db.models import Q

        today = date.today()
        # Show active announcements until the sale ends (allow publishing before start_date)
        return SaleAnnouncement.objects.filter(is_active=True).filter(
            Q(end_date__isnull=True) | Q(end_date__gte=today),
        )[:5]


class AdminSaleAnnouncementsView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = SaleAnnouncementSerializer
    queryset = SaleAnnouncement.objects.all()
    pagination_class = None


class AdminSaleAnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = SaleAnnouncementSerializer
    queryset = SaleAnnouncement.objects.all()


class AdminCurrencySettingsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        settings_obj = CurrencySettings.get_settings()
        return Response(CurrencySettingsSerializer(settings_obj).data)

    def patch(self, request):
        settings_obj = CurrencySettings.get_settings()
        serializer = CurrencySettingsSerializer(settings_obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(CurrencySettingsSerializer(settings_obj).data)


class SiteAssetsView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        assets = SiteAsset.objects.filter(is_active=True)
        data = {}
        for asset in assets:
            request_ctx = {'request': request}
            serializer = SiteAssetSerializer(asset, context=request_ctx)
            data[asset.asset_type] = serializer.data
        return Response(data)


class TestimonialListView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = TestimonialSerializer
    pagination_class = None

    def get_queryset(self):
        return Testimonial.objects.filter(is_active=True, is_featured=True)


class WhyChooseListView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = WhyChooseItemSerializer
    pagination_class = None

    def get_queryset(self):
        return WhyChooseItem.objects.filter(is_active=True)[:7]


class HeroImagesView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = HeroImageSerializer
    pagination_class = None

    def get_queryset(self):
        return HeroImage.objects.filter(is_active=True).order_by('order', '-created_at')[:16]


class ContactSubmitView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = ContactSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()
        EmailService.send_contact_notification(submission)
        NotificationService.notify_contact_submission(submission)
        return Response({'message': 'Thank you for contacting us.'}, status=status.HTTP_201_CREATED)


class NewsletterSubscribeView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = NewsletterSubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = serializer.save()
        
        # Send newsletter confirmation email
        try:
            send_newsletter_confirmation_email(subscriber)
        except Exception:
            logger.exception('Failed to send newsletter confirmation email to %s', subscriber.email)
        
        return Response({'message': 'Successfully subscribed.'}, status=status.HTTP_201_CREATED)


class AdminContactListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ContactSubmissionSerializer
    queryset = ContactSubmission.objects.all()
    pagination_class = None


class AdminNewsletterListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = NewsletterSubscriberSerializer
    queryset = NewsletterSubscriber.objects.all()
    pagination_class = None


class AdminNewsletterDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = NewsletterSubscriberSerializer
    queryset = NewsletterSubscriber.objects.all()


class AdminSettingsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        settings_obj = SiteSettings.get_settings()
        return Response(SiteSettingsSerializer(settings_obj, context={'request': request}).data)

    def patch(self, request):
        settings_obj = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings_obj, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(SiteSettingsSerializer(settings_obj, context={'request': request}).data)


class AdminTestimonialsView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = TestimonialSerializer
    queryset = Testimonial.objects.all()
    pagination_class = None


class AdminTestimonialDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = TestimonialSerializer
    queryset = Testimonial.objects.all()


class AdminHeroImagesView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = HeroImageSerializer
    queryset = HeroImage.objects.all()
    pagination_class = None


class AdminHeroImageView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = HeroImageSerializer
    queryset = HeroImage.objects.all()


class AdminWhyChooseItemsView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = WhyChooseItemSerializer
    queryset = WhyChooseItem.objects.all()
    pagination_class = None


class AdminWhyChooseItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = WhyChooseItemSerializer
    queryset = WhyChooseItem.objects.all()


class AdminActivityLogsView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminActivityLogSerializer
    queryset = AdminActivityLog.objects.all()
    ordering = ['-created_at']
    pagination_class = None


class EventServiceTypesView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = EventServiceTypeSerializer
    pagination_class = None

    def get_queryset(self):
        return EventServiceType.objects.filter(is_active=True)


class TrainingProgramsView(generics.ListAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = TrainingProgramSerializer
    pagination_class = None

    def get_queryset(self):
        return TrainingProgram.objects.filter(is_active=True)


class BookingSubmitView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = BookingInquiryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        try:
            EmailService.send_booking_notification(inquiry)
        except Exception:
            logger.exception('Failed to send booking notification for inquiry %s', inquiry.id)
        try:
            NotificationService.notify_booking_submission(inquiry)
        except Exception:
            logger.exception('Failed to create booking notification for inquiry %s', inquiry.id)
        return Response(
            {'message': 'Your booking request has been received. We will contact you shortly.', 'id': inquiry.id},
            status=status.HTTP_201_CREATED,
        )


class AdminEventServicesView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = EventServiceTypeSerializer
    queryset = EventServiceType.objects.all()
    pagination_class = None


class AdminEventServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = EventServiceTypeSerializer
    queryset = EventServiceType.objects.all()


class AdminTrainingProgramsView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = TrainingProgramSerializer
    queryset = TrainingProgram.objects.all()
    pagination_class = None


class AdminTrainingProgramDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = TrainingProgramSerializer
    queryset = TrainingProgram.objects.all()


class AdminBookingInquiriesView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = BookingInquirySerializer
    queryset = BookingInquiry.objects.select_related('event_service', 'training_program')
    pagination_class = None


class AdminBookingInquiryDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = BookingInquirySerializer
    queryset = BookingInquiry.objects.select_related('event_service', 'training_program')


class SitemapView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        from apps.products.models import Category, Product

        site_url = request.build_absolute_uri('/').rstrip('/')
        settings_obj = SiteSettings.get_settings()
        urls = [
            {'loc': site_url, 'changefreq': 'daily', 'priority': '1.0'},
            {'loc': f'{site_url}/shop', 'changefreq': 'daily', 'priority': '0.9'},
            {'loc': f'{site_url}/about', 'changefreq': 'monthly', 'priority': '0.7'},
            {'loc': f'{site_url}/contact', 'changefreq': 'monthly', 'priority': '0.7'},
            {'loc': f'{site_url}/bookings', 'changefreq': 'weekly', 'priority': '0.9'},
        ]
        for cat in Category.objects.filter(is_active=True):
            urls.append({
                'loc': f'{site_url}/shop/category/{cat.slug}',
                'changefreq': 'weekly',
                'priority': '0.8',
            })
        for product in Product.objects.filter(is_active=True, is_archived=False):
            urls.append({
                'loc': f'{site_url}/product/{product.slug}',
                'changefreq': 'weekly',
                'priority': '0.8',
                'lastmod': product.updated_at.strftime('%Y-%m-%d'),
            })

        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        for entry in urls:
            xml += '  <url>\n'
            xml += f'    <loc>{entry["loc"]}</loc>\n'
            if entry.get('lastmod'):
                xml += f'    <lastmod>{entry["lastmod"]}</lastmod>\n'
            xml += f'    <changefreq>{entry["changefreq"]}</changefreq>\n'
            xml += f'    <priority>{entry["priority"]}</priority>\n'
            xml += '  </url>\n'
        xml += '</urlset>'

        return HttpResponse(xml, content_type='application/xml')


class RobotsTxtView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        site_url = request.build_absolute_uri('/').rstrip('/')
        content = f"""User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /admin-dashboard/

Sitemap: {site_url}/sitemap.xml
"""
        return HttpResponse(content, content_type='text/plain')
