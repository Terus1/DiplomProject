from django.contrib import admin
from django.contrib.auth import get_user_model
from django import forms
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from . import models
from .forms import CustomUserCreationForm


# class CarAdmin(admin.ModelAdmin):
#     list_display = ['machines_factory_number', 'model_of_technique', 'engine_model', 'transmission_model', 'driving_bridge_model']
#     # def formfield_for_foreignkey(self, db_field, request, **kwargs):
#     #     if db_field.name == "model_of_technique":
#     #         kwargs["queryset"] = models.ModelReference.objects.exclude(name="")
#     #     elif db_field.name == "engine_model":
#     #         kwargs["queryset"] = models.ModelReference.objects.exclude(model_of_engine="")
#     #     elif db_field.name == "transmission_model":
#     #         kwargs["queryset"] = models.ModelReference.objects.exclude(model_of_transmission="")
#     #     elif db_field.name == "driving_bridge_model":
#     #         kwargs["queryset"] = models.ModelReference.objects.exclude(driving_bridge_model="")
#     #     return super().formfield_for_foreignkey(db_field, request, **kwargs)
#
#
# class ModelReferenceAdmin(admin.ModelAdmin):
#     list_display = ['name', 'model_of_engine', 'model_of_transmission', 'driving_bridge_model']

class ClientAdmin(admin.ModelAdmin):
    list_display = ("user", "name", "contact_info")  # Отображаем поля
    search_fields = ("name", "user__username")  # Позволяем искать по никнейму и логину пользователя


# Регистрируем пользователя с кастомной формой
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    model = User
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'groups']
    search_fields = ['username', 'email']
    ordering = ['username']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'nickname', 'password1', 'password2'),
        }),
    )


admin.site.register(models.ModelTechnique)  # Модель техники
admin.site.register(models.ModelEngine)  # Модель двигателя
admin.site.register(models.ModelTransmission)  # Модель трансмиссии
admin.site.register(models.ModelDrivingBridge)  # Модель ведущего моста
admin.site.register(models.ModelControlledBridge)  # Модель управляемого моста
admin.site.register(models.ServiceCompany)  # Сервисная компания
admin.site.register(models.Client, ClientAdmin)  # Клиент
admin.site.register(models.Recipient)   # Грузополучатель
admin.site.register(models.TypeMaintenance)     # Вид ТО
admin.site.register(models.FailureNode)  # Узел отказа
admin.site.register(models.RecoveryMethod)  # Способ восстановления

admin.site.register(models.Car)  # Машина
admin.site.register(models.TechnicalMaintenance)  # ТО
admin.site.register(models.Complaint)  # Рекламация

