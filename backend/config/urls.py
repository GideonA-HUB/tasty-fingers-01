from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import RedirectView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from apps.site_config.spa import SpaIndexView
from apps.site_config.views import RobotsTxtView, SitemapView

admin.site.site_header = 'Tasty Fingers Administration'
admin.site.site_title = 'Tasty Fingers Admin'
admin.site.index_title = 'Tasty Fingers'

urlpatterns = [
    path('admin', RedirectView.as_view(url='/admin/', permanent=True)),
    path('admin/', admin.site.urls),
    path('api/v1/', include('apps.core.urls')),
    path('api/v1/products/', include('apps.products.urls')),
    path('api/v1/orders/', include('apps.orders.urls')),
    path('api/v1/payments/', include('apps.payments.urls')),
    path('api/v1/accounts/', include('apps.accounts.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
    path('api/v1/site/', include('apps.site_config.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('sitemap.xml', SitemapView.as_view(), name='sitemap'),
    path('robots.txt', RobotsTxtView.as_view(), name='robots'),
]

# Serve uploaded media in all environments (filesystem storage when Cloudinary is not set).
# Must be registered before the SPA catch-all so /media/* is not swallowed.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if not settings.DEBUG:
    # Exclude api, admin (with or without trailing slash), static, media, sitemap, robots
    urlpatterns += [
        re_path(
            r'^(?!api/|admin(?:/|$)|static/|media/|sitemap\.xml|robots\.txt).*$',
            SpaIndexView.as_view(),
            name='frontend',
        ),
    ]
