from django.apps import AppConfig
from django.contrib.auth import get_user_model
from django.db.models.signals import post_migrate
from django.conf import settings


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.accounts'

    def ready(self):
        import apps.accounts.models  # noqa: F401 — register profile signals
        post_migrate.connect(create_admin_user, sender=self)


def create_admin_user(sender, **kwargs):
    User = get_user_model()

    # Only create if the environment variables are set
    admin_username = getattr(settings, 'ADMIN_USERNAME', None)
    admin_password = getattr(settings, 'ADMIN_PASSWORD', None)
    admin_email = getattr(settings, 'ADMIN_USER_EMAIL', None)

    if admin_username and admin_password and admin_email:
        # Check if admin user already exists
        if not User.objects.filter(username=admin_username).exists():
            user = User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password=admin_password,
            )
            print(f"Admin user '{admin_username}' created successfully from environment variables with is_staff={user.is_staff} and is_superuser={user.is_superuser}.")
        else:
            user = User.objects.get(username=admin_username)
            print(f"Admin user '{admin_username}' already exists with is_staff={user.is_staff} and is_superuser={user.is_superuser}. Skipping creation.")
