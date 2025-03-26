from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth.models import Group, Permission
from django.contrib.auth.models import User

from . import models


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'content_type']


class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']


class CarSerializer(serializers.ModelSerializer):
    # Было
    # model_of_technique = serializers.SerializerMethodField()
    # engine_model = serializers.SerializerMethodField()
    # transmission_model = serializers.SerializerMethodField()
    # driving_bridge_model = serializers.SerializerMethodField()
    # controlled_bridge_model = serializers.SerializerMethodField()
    # client = serializers.SerializerMethodField()
    # service_company = serializers.SerializerMethodField()
    #
    # class Meta:
    #     model = models.Car
    #     fields = [
    #         'id',
    #         'machines_factory_number',
    #         'model_of_technique',
    #         'engine_model',
    #         'engine_serial_number',
    #         'transmission_model',
    #         'factory_number_of_transmission',
    #         'driving_bridge_model',
    #         'factory_number_of_drive_axle',
    #         'controlled_bridge_model',
    #         'factory_number_of_controlled_bridge',
    #         'delivery_contract_number_and_date',
    #         'date_of_shipment_from_the_factory',
    #         'recipient',
    #         'delivery_address',
    #         'equipment',
    #         'client',
    #         'service_company',
    #     ]
    #
    # def get_model_of_technique(self, obj):
    #     if obj.model_of_technique:
    #         return {
    #             'name': obj.model_of_technique.name,
    #             'description': obj.model_of_technique.description
    #         }
    #     return None
    #
    # def get_engine_model(self, obj):
    #     if obj.engine_model:
    #         return {
    #             'name': obj.engine_model.name,
    #             'description': obj.engine_model.description
    #         }
    #     return None
    #
    # def get_transmission_model(self, obj):
    #     if obj.transmission_model:
    #         return {
    #             'name': obj.transmission_model.name,
    #             'description': obj.transmission_model.description
    #         }
    #     return None
    #
    # def get_driving_bridge_model(self, obj):
    #     if obj.driving_bridge_model:
    #         return {
    #             'name': obj.driving_bridge_model.name,
    #             'description': obj.driving_bridge_model.description
    #         }
    #     return None
    #
    # def get_controlled_bridge_model(self, obj):
    #     if obj.controlled_bridge_model:
    #         return {
    #             'name': obj.controlled_bridge_model.name,
    #             'description': obj.controlled_bridge_model.description
    #         }
    #     return None
    #
    # def get_client(self, obj):
    #     return obj.client.name if obj.client else None
    #
    # def get_service_company(self, obj):
    #     return obj.service_company.name if obj.service_company else None
    #
    # def to_representation(self, instance):
    #     """Фильтруем поля в зависимости от авторизации пользователя"""
    #     data = super().to_representation(instance)
    #     request = self.context.get('request')
    #
    #     # Если пользователь не авторизован, скрываем определенные поля
    #     if not request or not request.user or not request.user.is_authenticated:
    #         hidden_fields = [
    #             'date_of_shipment_from_the_factory',
    #             'recipient',
    #             'delivery_address',
    #             'equipment',
    #             'client',
    #             'service_company'
    #         ]
    #         for field in hidden_fields:
    #             data.pop(field, None)  # Удаляем поле, если оно есть
    #
    #     return data

    # Стало
    # Поля для отправки ID на сервер
    model_of_technique = serializers.PrimaryKeyRelatedField(
        queryset=models.ModelTechnique.objects.all(), required=False, allow_null=True
    )
    engine_model = serializers.PrimaryKeyRelatedField(
        queryset=models.ModelEngine.objects.all(), required=False, allow_null=True
    )
    transmission_model = serializers.PrimaryKeyRelatedField(
        queryset=models.ModelTransmission.objects.all(), required=False, allow_null=True
    )
    driving_bridge_model = serializers.PrimaryKeyRelatedField(
        queryset=models.ModelDrivingBridge.objects.all(), required=False, allow_null=True
    )
    controlled_bridge_model = serializers.PrimaryKeyRelatedField(
        queryset=models.ModelControlledBridge.objects.all(), required=False, allow_null=True
    )
    client = serializers.PrimaryKeyRelatedField(
        queryset=models.Client.objects.all(), required=False, allow_null=True
    )
    service_company = serializers.PrimaryKeyRelatedField(
        queryset=models.ServiceCompany.objects.all(), required=False, allow_null=True
    )
    recipient = serializers.PrimaryKeyRelatedField(
        queryset=models.Recipient.objects.all(), required=False, allow_null=True
    )

    # Поля для отображения на клиенте
    model_of_technique_details = serializers.SerializerMethodField()
    engine_model_details = serializers.SerializerMethodField()
    transmission_model_details = serializers.SerializerMethodField()
    driving_bridge_model_details = serializers.SerializerMethodField()
    controlled_bridge_model_details = serializers.SerializerMethodField()
    client_details = serializers.SerializerMethodField()
    service_company_details = serializers.SerializerMethodField()
    recipient_details = serializers.SerializerMethodField()


    class Meta:
        model = models.Car
        fields = [
            'id',
            'machines_factory_number',
            'model_of_technique', 'model_of_technique_details',
            'engine_model', 'engine_model_details',
            'engine_serial_number',
            'transmission_model', 'transmission_model_details',
            'factory_number_of_transmission',
            'driving_bridge_model', 'driving_bridge_model_details',
            'factory_number_of_drive_axle',
            'controlled_bridge_model', 'controlled_bridge_model_details',
            'factory_number_of_controlled_bridge',
            'delivery_contract_number_and_date',
            'date_of_shipment_from_the_factory',
            'recipient', 'recipient_details',
            'delivery_address',
            'equipment',
            'client', 'client_details',
            'service_company', 'service_company_details',

        ]

    # Методы для получения детализированных данных
    def get_model_of_technique_details(self, obj):
        if obj.model_of_technique:
            return {'name': obj.model_of_technique.name, 'description': obj.model_of_technique.description}
        return None

    def get_engine_model_details(self, obj):
        if obj.engine_model:
            return {'name': obj.engine_model.name, 'description': obj.engine_model.description}
        return None

    def get_transmission_model_details(self, obj):
        if obj.transmission_model:
            return {'name': obj.transmission_model.name, 'description': obj.transmission_model.description}
        return None

    def get_driving_bridge_model_details(self, obj):
        if obj.driving_bridge_model:
            return {'name': obj.driving_bridge_model.name, 'description': obj.driving_bridge_model.description}
        return None

    def get_controlled_bridge_model_details(self, obj):
        if obj.controlled_bridge_model:
            return {'name': obj.controlled_bridge_model.name, 'description': obj.controlled_bridge_model.description}
        return None

    def get_client_details(self, obj):
        return obj.client.name if obj.client else None

    def get_service_company_details(self, obj):
        return obj.service_company.name if obj.service_company else None

    def get_recipient_details(self, obj):
        return obj.recipient.name if obj.recipient else None



class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nickname = serializers.CharField(source='client.name', read_only=True)
    username = serializers.CharField()
    # password = serializers.CharField()
    email = serializers.EmailField()

    # class Meta:
    #     model = User
    #     fields = ['id', 'username', 'nickname', 'email']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Добавляем дополнительные поля, если нужно
        token['username'] = user.username
        return token


class ModelOfTechniqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ModelTechnique
        fields = ['id', 'name', 'description']


class ModelOfEngineSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ModelEngine
        fields = ['id', 'name', 'description']


class ModelOfTransmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ModelTransmission
        fields = ['id', 'name', 'description']


class ModelOfDrivingBridgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ModelDrivingBridge
        fields = ['id', 'name', 'description']


class ModelOfControlledBridgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ModelControlledBridge
        fields = ['id', 'name', 'description']


class ServiceCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ServiceCompany
        fields = ['id', 'name', 'description']


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Client
        fields = ['id', 'user', 'name', 'contact_info']


class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Recipient
        fields = ['id', 'user', 'name']


class TechnicalMaintenanceSerializer(serializers.ModelSerializer):
    type_of_maintenance_name = serializers.CharField(source='type_of_maintenance.name', read_only=True)
    type_of_maintenance_description = serializers.CharField(source='type_of_maintenance.description', read_only=True)

    organization_carried_out_maintenance_name = serializers.CharField(source='organization_carried_out_maintenance.name', read_only=True)
    organization_carried_out_maintenance_description = serializers.CharField(
        source='organization_carried_out_maintenance.description', read_only=True)

    to_car_name = serializers.CharField(source='to_car.machines_factory_number', read_only=True)
    service_company_name = serializers.CharField(source='service_company.name', read_only=True)
    service_company_description = serializers.CharField(source='service_company.description', read_only=True)

    class Meta:
        model = models.TechnicalMaintenance
        fields = ['id', 'type_of_maintenance', 'type_of_maintenance_name', 'type_of_maintenance_description',
                  'organization_carried_out_maintenance',
                  'organization_carried_out_maintenance_name', 'organization_carried_out_maintenance_description',
                  'to_car', 'to_car_name', 'service_company',
                  'service_company_name', 'service_company_description', 'date_of_maintenance', 'to_operating_time',
                  'order_number',
                  'order_date']


class ComplaintSerializer(serializers.ModelSerializer):
    failure_node_name = serializers.CharField(source='failure_node.name', read_only=True)

    recovery_method_name = serializers.CharField(source='recovery_method.name', read_only=True)
    recovery_method_description = serializers.CharField(source='recovery_method.description', read_only=True)

    complaint_car_name = serializers.CharField(source='complaint_car.machines_factory_number', read_only=True)
    service_company_name = serializers.CharField(source='service_company.name', read_only=True)
    service_company_description = serializers.CharField(source='service_company.description', read_only=True)


    class Meta:
        model = models.Complaint
        fields = ['id', 'date_of_refusal', 'complaint_operating_time', 'failure_node', 'failure_node_name',
                  'description_of_failure', 'recovery_method', 'recovery_method_name', 'recovery_method_description',
                  'used_spare_parts', 'date_of_restoration',
                  'equipment_downtime',
                  'complaint_car', 'complaint_car_name', 'service_company', 'service_company_name',
                  'service_company_description']


class TypeOfMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TypeMaintenance
        fields = ['id', 'name', 'description']


class FailureNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FailureNode
        fields = ['id', 'name', 'description']


class RecoveryMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RecoveryMethod
        fields = ['id', 'name', 'description']
