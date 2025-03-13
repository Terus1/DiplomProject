import django_filters

from . import models


class CarFilter(django_filters.FilterSet):
    model_of_technique = django_filters.CharFilter(field_name='model_of_technique__name', lookup_expr='icontains')     # Фильтр по модели техники
    engine_model = django_filters.CharFilter(field_name='engine_model__name', lookup_expr='icontains')   # Фильтр по модели двигателя
    transmission_model = django_filters.CharFilter(field_name='transmission_model__name', lookup_expr='icontains')     # Фильтр по модели трансмиссии
    driving_bridge_model = django_filters.CharFilter(field_name='driving_bridge_model__name', lookup_expr='icontains')   # Фильтр по модели ведущего моста
    controlled_bridge_model = django_filters.CharFilter(field_name='controlled_bridge_model__name', lookup_expr='icontains')    # Фильтр по модели управляемого моста

    class Meta:
        model = models.Car
        fields = ['id', 'model_of_technique', 'engine_model', 'transmission_model']

