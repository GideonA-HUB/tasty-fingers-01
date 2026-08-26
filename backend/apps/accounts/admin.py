from django.contrib import admin

from .models import CustomerProfile


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ['customer_id', 'user', 'phone', 'avatar', 'city', 'state', 'created_at']
    list_filter = ['avatar', 'created_at']
    search_fields = ['customer_id', 'user__email', 'user__first_name', 'user__last_name', 'phone']
    readonly_fields = ['customer_id', 'created_at', 'updated_at']
    raw_id_fields = ['user']
