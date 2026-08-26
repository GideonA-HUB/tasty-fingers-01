from django.db.models import Q
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdminUser

from .filters import ProductFilter
from .models import Category, Product, ProductReview
from .serializers import (
    CategoryDetailSerializer,
    CategoryListSerializer,
    ProductAdminSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProductReviewCreateSerializer,
    ProductReviewListSerializer,
    ProductReviewSerializer,
)


class CategoryListView(generics.ListAPIView):
    serializer_class = CategoryListSerializer
    pagination_class = None

    def get_queryset(self):
        qs = Category.objects.filter(is_active=True)
        if self.request.query_params.get('featured') == 'true':
            qs = qs.filter(is_featured=True)
        return qs


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategoryDetailSerializer
    lookup_field = 'slug'


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'short_description', 'category__name', 'density']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_archived=False).select_related('category').prefetch_related('images', 'reviews')


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_archived=False).select_related('category').prefetch_related('images', 'videos', 'reviews')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Product.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
        serializer = self.get_response_serializer(instance)
        return Response(serializer.data)

    def get_response_serializer(self, instance):
        return self.get_serializer(instance)


class FeaturedProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = None

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, is_archived=False, is_featured=True
        ).select_related('category').prefetch_related('images', 'reviews')[:100]


class BestsellerProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = None

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, is_archived=False, is_bestseller=True
        ).select_related('category').prefetch_related('images', 'reviews')[:100]


class NewArrivalProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = None

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, is_archived=False, is_new_arrival=True
        ).select_related('category').prefetch_related('images', 'reviews')[:100]


class FlashSaleProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = None

    def get_queryset(self):
        from django.db.models import Q
        from django.utils import timezone

        now = timezone.now()
        # Include upcoming + active flash sales; hide products whose sale window has ended
        return Product.objects.filter(
            is_active=True,
            is_archived=False,
            is_flash_sale=True,
        ).filter(
            Q(flash_sale_end_at__isnull=True) | Q(flash_sale_end_at__gt=now),
        ).select_related('category').prefetch_related('images', 'reviews')[:100]


class ProductSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'results': [], 'count': 0})

        products = Product.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(short_description__icontains=query) |
            Q(category__name__icontains=query) |
            Q(density__icontains=query),
            is_active=True,
            is_archived=False,
        ).select_related('category').prefetch_related('images', 'reviews')[:20]

        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response({'results': serializer.data, 'count': len(serializer.data)})


class AdminProductListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ProductAdminSerializer
    filterset_class = ProductFilter
    search_fields = ['name', 'sku']
    pagination_class = None

    def get_queryset(self):
        return Product.objects.all().select_related('category').prefetch_related('images', 'videos')

    def perform_create(self, serializer):
        from .models import ProductImage, ProductVideo

        product = serializer.save()
        for index, image_file in enumerate(self.request.FILES.getlist('images')):
            ProductImage.objects.create(
                product=product,
                image=image_file,
                is_primary=index == 0,
                order=index,
            )
        for index, video_file in enumerate(self.request.FILES.getlist('videos')):
            ProductVideo.objects.create(
                product=product,
                video=video_file,
                order=index,
            )


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ProductAdminSerializer
    queryset = Product.objects.all().select_related('category').prefetch_related('images', 'videos')

    def perform_update(self, serializer):
        from .models import ProductImage, ProductVideo

        product = serializer.save()
        existing_image_count = product.images.count()
        for index, image_file in enumerate(self.request.FILES.getlist('images')):
            ProductImage.objects.create(
                product=product,
                image=image_file,
                is_primary=existing_image_count == 0 and index == 0,
                order=existing_image_count + index,
            )
        existing_video_count = product.videos.count()
        for index, video_file in enumerate(self.request.FILES.getlist('videos')):
            ProductVideo.objects.create(
                product=product,
                video=video_file,
                order=existing_video_count + index,
            )


class ProductReviewsView(generics.ListCreateAPIView):
    serializer_class = ProductReviewSerializer
    pagination_class = None

    def get_queryset(self):
        product_slug = self.kwargs.get('slug')
        return ProductReview.objects.filter(
            product__slug=product_slug,
            is_approved=True
        ).select_related('product')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductReviewCreateSerializer
        return ProductReviewListSerializer

    def perform_create(self, serializer):
        product_slug = self.kwargs.get('slug')
        product = Product.objects.get(slug=product_slug)
        serializer.save(product=product, is_approved=False)


class AdminCategoryListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = CategoryDetailSerializer
    queryset = Category.objects.all()
    pagination_class = None


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = CategoryDetailSerializer
    queryset = Category.objects.all()


class AdminReviewListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ProductReviewListSerializer
    queryset = ProductReview.objects.all()
    pagination_class = None


class AdminReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = ProductReviewSerializer
    queryset = ProductReview.objects.all()


class AdminReviewApproveView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            review = ProductReview.objects.get(pk=pk)
        except ProductReview.DoesNotExist:
            return Response({'detail': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        review.is_approved = True
        review.save()
        return Response(ProductReviewListSerializer(review).data)


class AdminReviewRejectView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            review = ProductReview.objects.get(pk=pk)
        except ProductReview.DoesNotExist:
            return Response({'detail': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        review.is_approved = False
        review.save()
        return Response(ProductReviewListSerializer(review).data)
