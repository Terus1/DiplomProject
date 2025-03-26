from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.models import Group, Permission, AnonymousUser
from django.views.generic import ListView, DetailView

from rest_framework import generics, status
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions, DjangoModelPermissionsOrAnonReadOnly
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from . import serializers
from . import models
from . import filters
from . import permissions


class GroupViewSet(ReadOnlyModelViewSet):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer

    def get_queryset(self):
        return self.request.user.groups.all()


class PermissionViewSet(ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = serializers.PermissionSerializer


class UserPermissionsView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        permissions = user.get_all_permissions()    # Покажет все права пользователя
        return Response({'permissions': list(permissions)})


class UserGroupsView(APIView):
    permission_classes = [IsAuthenticated]  # Только для авторизованных пользователей

    def get(self, request, *args, **kwargs):
        user = request.user
        groups = request.user.groups.all().values('id', 'name')
        return Response({'groups': list(groups)})


# Фильтр-класс, который расширяет возможности обычного ListView
class CarsFilteredListView(ListView):
    filterset_class = None

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.filterset_class:
            self.filterset = self.filterset_class(self.request.GET, queryset=queryset)
            queryset = self.filterset.qs
        return queryset

    def render_to_response(self, context, **response_kwargs):
        """Возвращаем JSON-ответ, а не HTML"""
        queryset = self.get_queryset()
        serializer = serializers.CarSerializer(queryset, many=True, context={'request': self.request})
        return JsonResponse(serializer.data, safe=False, **response_kwargs)


# Представление списка машин
class CarsListView(CarsFilteredListView):
    model = models.Car
    template_name = 'cars_list.html'    # Это теперь не используется
    context_object_name = 'cars'
    filterset_class = filters.CarFilter



# Представление конкретной машины
class CarDetailView(DetailView):
    model = models.Car
    template_name = 'car_detail.html'
    context_object_name = 'car'


# def api_view(request):
#     return JsonResponse({'message': 'Hello from Django!'})


class CarViewSet(ModelViewSet):
    queryset = models.Car.objects.all()
    serializer_class = serializers.CarSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    serializer = serializers.UserSerializer(user)
    if isinstance(user, AnonymousUser):
        print('Пользователь не аутентифицирован')
        return Response({"error": "Пользователь не аутентифицирован"}, status=401)
    return Response(serializer.data)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.CustomTokenObtainPairSerializer


class ModelOfTechniqueListView(ModelViewSet):
    queryset = models.ModelTechnique.objects.all()
    serializer_class = serializers.ModelOfTechniqueSerializer


class ModelOfEngineListView(ModelViewSet):
    queryset = models.ModelEngine.objects.all()
    serializer_class = serializers.ModelOfEngineSerializer


class ModelOfTransmissionListView(ModelViewSet):
    queryset = models.ModelTransmission.objects.all()
    serializer_class = serializers.ModelOfTransmissionSerializer


class ModelOfDrivingBridgeListView(ModelViewSet):
    queryset = models.ModelDrivingBridge.objects.all()
    serializer_class = serializers.ModelOfDrivingBridgeSerializer


class ModelOfControlledBridgeListView(ModelViewSet):
    queryset = models.ModelControlledBridge.objects.all()
    serializer_class = serializers.ModelOfControlledBridgeSerializer


class ServiceCompanyListView(ModelViewSet):
    queryset = models.ServiceCompany.objects.all()
    serializer_class = serializers.ServiceCompanySerializer


class ClientListView(ModelViewSet):
    queryset = models.Client.objects.all()
    serializer_class = serializers.ClientSerializer


class RecipientListView(ModelViewSet):
    queryset = models.Recipient.objects.all()
    serializer_class = serializers.RecipientSerializer


class TechnicalMaintenanceListView(ModelViewSet):
    queryset = models.TechnicalMaintenance.objects.all()
    serializer_class = serializers.TechnicalMaintenanceSerializer
    permission_classes = [DjangoModelPermissions]


class ComplaintListView(ModelViewSet):
    queryset = models.Complaint.objects.all()
    serializer_class = serializers.ComplaintSerializer
    permission_classes = [DjangoModelPermissions]


class TypeOfMaintenanceListView(ModelViewSet):
    queryset = models.TypeMaintenance.objects.all()
    serializer_class = serializers.TypeOfMaintenanceSerializer


class FailureNodeListView(ModelViewSet):
    queryset = models.FailureNode.objects.all()
    serializer_class = serializers.FailureNodeSerializer


class RecoveryMethodListView(ModelViewSet):
    queryset = models.RecoveryMethod.objects.all()
    serializer_class = serializers.RecoveryMethodSerializer
