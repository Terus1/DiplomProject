from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import serializers
from . import views


from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
    openapi.Info(
        title="API Docs",
        default_version="v1",
        description="Документация для API",
    ),
    public=True,
    permission_classes=(AllowAny,),
    authentication_classes=[],
)


router = DefaultRouter()

router.register(r'groups', views.GroupViewSet, basename='group')
router.register(r'permissions', views.PermissionViewSet, basename='permission')
router.register(r'cars', views.CarViewSet, basename='cars')
router.register(r'technical-maintenances', views.TechnicalMaintenanceListView, basename='technical-maintenances')
router.register(r'complaints', views.ComplaintListView, basename='complaints')

# Роутеры для машин
router.register(r'techniques', views.ModelOfTechniqueListView, basename='techniques')
router.register(r'engines', views.ModelOfEngineListView, basename='engines')
router.register(r'transmissions', views.ModelOfTransmissionListView, basename='transmissions')
router.register(r'driving-bridges', views.ModelOfDrivingBridgeListView, basename='driving-bridges')
router.register(r'controlled-bridges', views.ModelOfControlledBridgeListView, basename='controlled-bridges')
router.register(r'service-companies', views.ServiceCompanyListView, basename='service-companies')
router.register(r'clients', views.ClientListView, basename='clients')
router.register(r'recipients', views.RecipientListView, basename='recipients')

# Роутеры для ТО
router.register(r'type_of_maintenances', views.TypeOfMaintenanceListView, basename='type_of_maintenances')

# Роутеры для рекламаций
router.register(r'failure_nodes', views.FailureNodeListView, basename='failure_nodes')
router.register(r'recovery_methods', views.RecoveryMethodListView, basename='recovery_methods')


urlpatterns = [
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="swagger-ui"),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/user/', views.get_current_user, name='current-user'),
    path('api/user/groups/', views.UserGroupsView.as_view(), name='user-groups'),
    path('api/user/permissions/', views.UserPermissionsView.as_view(), name='user-permissions'),
    path('cars/', views.CarsListView.as_view(), name='cars_list'),
    path('car/<int:pk>', views.CarDetailView.as_view(), name='car_detail'),

    # path('api/techniques/', views.ModelOfTechniqueListView.as_view(), name='techniques'),
    # path('api/engines/', views.ModelOfEngineListView.as_view(), name='engines'),
    # path('api/transmissions/', views.ModelOfTransmissionListView.as_view(), name='transmissions'),
    # path('api/driving-bridges/', views.ModelOfDrivingBridgeListView.as_view(), name='driving-bridges'),
    # path('api/controlled-bridges/', views.ModelOfControlledBridgeListView.as_view(), name='controlled-bridges'),
    # path('api/service-companies/', views.ServiceCompanyListView.as_view(), name='service-companies'),
    # path('api/clients/', views.ClientListView.as_view(), name='clients'),
]
