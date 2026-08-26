from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AdminCustomerListView,
    AdminLoginView,
    AdminLogoutView,
    AdminMetricsView,
    AdminProfileView,
    CustomerLoginView,
    CustomerOrdersView,
    CustomerProfileView,
    CustomerRegisterView,
    TrackOrderView,
)

urlpatterns = [
    # Admin
    path('login/', AdminLoginView.as_view(), name='admin-login'),
    path('logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('profile/', AdminProfileView.as_view(), name='admin-profile'),
    path('metrics/', AdminMetricsView.as_view(), name='admin-metrics'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('admin/customers/', AdminCustomerListView.as_view(), name='admin-customers'),
    # Customer auth
    path('register/', CustomerRegisterView.as_view(), name='customer-register'),
    path('customer/login/', CustomerLoginView.as_view(), name='customer-login'),
    path('customer/profile/', CustomerProfileView.as_view(), name='customer-profile'),
    path('customer/orders/', CustomerOrdersView.as_view(), name='customer-orders'),
    path('track-order/', TrackOrderView.as_view(), name='track-order'),
]
