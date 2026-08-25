import logging
import threading

from django.conf import settings
from django.template.loader import render_to_string

from apps.core.media import absolute_media_url

logger = logging.getLogger(__name__)

BRAND_PINK = '#000000'
BRAND_PINK_DARK = '#1A1A1A'


def get_logo_url():
    """Public HTTPS logo URL for email clients."""
    from apps.site_config.models import SiteAsset

    frontend_url = (
        getattr(settings, 'FRONTEND_URL', None)
        or getattr(settings, 'SITE_URL', None)
        or 'https://tasty-fingers-01-production.up.railway.app'
    ).rstrip('/')

    for asset_type in ('logo', 'logo_light'):
        try:
            asset = SiteAsset.objects.get(asset_type=asset_type, is_active=True)
            url = absolute_media_url(None, asset.image)
            if url:
                if url.startswith(('http://', 'https://')):
                    return url
                return f'{frontend_url}{url if url.startswith("/") else f"/{url}"}'
        except SiteAsset.DoesNotExist:
            continue

    return f'{frontend_url}/logo.png'


def get_email_context(extra=None):
    """Build shared template context with site settings and social links."""
    from apps.site_config.models import SiteSettings

    site = SiteSettings.get_settings()
    site_url = (
        getattr(settings, 'FRONTEND_URL', None)
        or getattr(settings, 'SITE_URL', 'https://tasty-fingers-01-production.up.railway.app')
    ).rstrip('/')
    ctx = {
        'site_name': site.site_name or getattr(settings, 'SITE_NAME', 'Tasty Fingers'),
        'site_url': site_url,
        'logo_url': get_logo_url(),
        'brand_pink': BRAND_PINK,
        'brand_pink_dark': BRAND_PINK_DARK,
        'instagram_url': site.instagram_url or '',
        'tiktok_url': site.tiktok_url or '',
        'contact_email': site.contact_email or 'contact@tastyfingers.com',
        'whatsapp_url': 'https://wa.me/2348135380528',
    }
    if extra:
        ctx.update(extra)
    return ctx


def send_html_email(to, subject, template_name, context=None):
    """
    Send an HTML email via Resend API.
    Returns True on success, False if API key missing (dev).
    """
    recipients = [to] if isinstance(to, str) else list(to)

    if not settings.RESEND_API_KEY:
        logger.warning('[EMAIL SKIPPED] RESEND_API_KEY not set. To: %s | Subject: %s', recipients, subject)
        return False

    ctx = get_email_context(context)
    html = render_to_string(template_name, ctx)

    import resend

    resend.api_key = settings.RESEND_API_KEY
    resend.Emails.send({
        'from': settings.DEFAULT_FROM_EMAIL,
        'to': recipients,
        'subject': subject,
        'html': html,
    })
    logger.info('Email sent to %s: %s', recipients, subject)
    return True


def send_html_email_async(to, subject, template_name, context=None):
    """Fire-and-forget email send so API responses are not blocked."""

    def _worker():
        try:
            send_html_email(to, subject, template_name, context)
        except Exception:
            logger.exception('Async email failed. To: %s | Subject: %s', to, subject)

    threading.Thread(target=_worker, daemon=True).start()
