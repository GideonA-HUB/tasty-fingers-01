from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import AVATAR_CHOICES, CustomerProfile


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid credentials.')
        if not user.is_staff or not user.is_superuser:
            raise serializers.ValidationError('Access denied. Admin only.')
        data['user'] = user
        return data


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class CustomerRegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    password = serializers.CharField(min_length=8, write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        if User.objects.filter(username__iexact=email).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return email

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        email = validated_data['email']
        full_name = validated_data['full_name'].strip()
        parts = full_name.split(None, 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
        )
        profile, _ = CustomerProfile.objects.get_or_create(user=user)
        if validated_data.get('phone'):
            profile.phone = validated_data['phone']
            profile.save(update_fields=['phone'])
        return user


class CustomerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data['email'].strip().lower()
        user = authenticate(username=email, password=data['password'])
        if not user:
            # Try finding by email if username differs
            try:
                u = User.objects.get(email__iexact=email)
                user = authenticate(username=u.username, password=data['password'])
            except User.DoesNotExist:
                user = None
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')
        if user.is_staff and user.is_superuser:
            raise serializers.ValidationError('Please use the admin login for staff accounts.')
        data['user'] = user
        return data


class CustomerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.SerializerMethodField()
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    avatar_choices = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = [
            'customer_id', 'email', 'full_name', 'first_name', 'last_name',
            'phone', 'avatar', 'avatar_choices', 'address', 'city', 'state',
            'created_at',
        ]
        read_only_fields = ['customer_id', 'email', 'created_at']

    def get_full_name(self, obj):
        name = obj.user.get_full_name().strip()
        return name or obj.user.email

    def get_avatar_choices(self, obj):
        return [{'value': v, 'label': l} for v, l in AVATAR_CHOICES]

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            if 'first_name' in user_data:
                user.first_name = user_data['first_name']
            if 'last_name' in user_data:
                user.last_name = user_data['last_name']
            user.save()
        return super().update(instance, validated_data)
