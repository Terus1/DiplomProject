from django.db import models
from django.contrib.auth.models import User, AbstractUser, Group, Permission
from django.conf import settings


# # 1. Модель техники (двигатель, трансмиссия, мосты)
# class ModelReference(models.Model):
#     # model_of_technique = models.CharField(max_length=255, unique=True, verbose_name='Название модели техники')
#     model_of_engine = models.CharField(max_length=255, unique=True, verbose_name='Название модели двигателя')
#     model_of_transmission = models.CharField(max_length=255, unique=True, verbose_name='Название модели трансмиссии')
#     driving_bridge_model = models.CharField(max_length=255, unique=True, verbose_name='Название модели ведущего моста')
#     name = models.CharField(max_length=255, unique=True, verbose_name='Название модели техники')  # Название модели
#     description = models.TextField(blank=True, null=True, verbose_name='Описание модели')  # Описание модели
#
#     class Meta:
#         verbose_name = 'Модель техники'
#         verbose_name_plural = 'Модели техник'
#
#     def __str__(self):
#         return self.name


# ---------------------------------------------------Справочники деталей------------------------------------------------
# Модель техники
class ModelTechnique(models.Model):
    name = models.CharField(max_length=255, verbose_name='Модель техники')
    description = models.TextField(blank=True, null=True, verbose_name='Описание техники')

    class Meta:
        verbose_name = 'Модель техники'
        verbose_name_plural = 'Модели техник'

    def __str__(self):
        return f'{self.name}'


# Модель двигателя
class ModelEngine(models.Model):
    name = models.CharField(max_length=255, verbose_name='Модель двигателя')
    description = models.TextField(blank=True, null=True, verbose_name='Описание двигателя')

    class Meta:
        verbose_name = 'Модель двигателя'
        verbose_name_plural = 'Модели двигателей'

    def __str__(self):
        return f'{self.name}'


# Модель трансмиссии
class ModelTransmission(models.Model):
    name = models.CharField(max_length=255, verbose_name='Модель трансмиссии')
    description = models.TextField(blank=True, null=True, verbose_name='Описание трансмиссии')

    class Meta:
        verbose_name = 'Модель трансмиссии'
        verbose_name_plural = 'Модели трансмиссий'

    def __str__(self):
        return f'{self.name}'


# Модель ведущего моста
class ModelDrivingBridge(models.Model):
    name = models.CharField(max_length=255, verbose_name='Модель ведущего моста')
    description = models.TextField(blank=True, null=True, verbose_name='Описание ведущего моста')

    class Meta:
        verbose_name = 'Модель ведущего моста'
        verbose_name_plural = 'Модели ведущих мостов'

    def __str__(self):
        return f'{self.name}'


# Модель управляемого моста
class ModelControlledBridge(models.Model):
    name = models.CharField(max_length=255, verbose_name='Модель управляемого моста')
    description = models.TextField(blank=True, null=True, verbose_name='Описание управляемого моста')

    class Meta:
        verbose_name = 'Модель управляемого моста'
        verbose_name_plural = 'Модели управляемых мостов'

    def __str__(self):
        return f'{self.name}'


class Recipient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    name = models.CharField(max_length=128, verbose_name='Имя модели грузополучателя')

    class Meta:
        verbose_name = 'Модель грузополучателя'
        verbose_name_plural = 'Модели грузополучателя'

    def __str__(self):
        return f'{self.name}'
# ---------------------------------------------Справочник сервисной компании--------------------------------------------
# Сервисная компания
class ServiceCompany(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name='Название сервис.компании')  # Название компании
    description = models.TextField(blank=True, null=True, verbose_name='Описание сервис.компании')  # Описание компании

    class Meta:
        verbose_name = 'Сервисная компания'
        verbose_name_plural = 'Сервисные компании'

    def __str__(self):
        return self.name


# -----------------------------------------------Справочник узла отказа-------------------------------------------------

# Узел отказа
class FailureNode(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name='Название узла отказа')  # Название узла отказа
    description = models.TextField(blank=True, null=True, verbose_name='Описание узла отказа')  # Описание узла отказа

    class Meta:
        verbose_name = 'Узел отказа'
        verbose_name_plural = 'Узлы отказа'

    def __str__(self):
        return self.name


# ---------------------------------------------Справочник способа восстановления----------------------------------------

# Способ восстановления
class RecoveryMethod(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name='Название способа')  # Название способа
    description = models.TextField(blank=True, null=True, verbose_name='Описание способа')  # Описание способа

    class Meta:
        verbose_name = 'Способ восстановления'
        verbose_name_plural = 'Способы восстановления'

    def __str__(self):
        return self.name


# ---------------------------------------------Справочник вида ТО-------------------------------------------------------

# Вид ТО
class TypeMaintenance(models.Model):
    name = models.CharField(max_length=255, verbose_name='Вид ТО')
    description = models.TextField(blank=True, null=True, verbose_name='Описание ТО')

    class Meta:
        verbose_name = 'Вид ТО'
        verbose_name_plural = 'Виды ТО'

    def __str__(self):
        return f'{self.name}'


# Клиент
class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    name = models.CharField(max_length=255, verbose_name='Имя клиента')  # Имя клиента
    contact_info = models.TextField(blank=True, null=True,
                                    verbose_name='Контактные данные клиента')  # Контактные данные клиента

    class Meta:
        verbose_name = 'Клиент'
        verbose_name_plural = 'Клиенты'

    def __str__(self):
        return self.name


# ----------------------------------------------------------Сущности-----------------------------------------------------

# Содержит информацию о характеристиках и комплектации проданных машин, а также информацию о месте эксплуатации.
class Car(models.Model):
    # 1. Заводской № машины. Формат: текстовое поле. Источник данных: уникальный номер машины/свободный ввод
    machines_factory_number = models.CharField(max_length=255, unique=True, verbose_name='Заводской № машины')

    # 2. Модель техники. Формат: текстовое поле. Источник данных: справочник
    model_of_technique = models.ForeignKey(ModelTechnique, on_delete=models.PROTECT, related_name="cars",
                                           verbose_name='Модель техники', null=True, blank=True)

    # 3. Модель двигателя. Формат: текстовое поле. Источник данных: справочник
    engine_model = models.ForeignKey(ModelEngine, on_delete=models.PROTECT, related_name="engines",
                                     verbose_name='Модель двигателя', null=True, blank=True)
    # 4. Заводской № двигателя. Формат: текстовое поле. Источник данных: свободный ввод
    engine_serial_number = models.CharField(max_length=255, unique=True, verbose_name='Заводской № двигателя')

    # 5. Модель трансмиссии. Формат: текстовое поле. Источник данных: справочник
    transmission_model = models.ForeignKey(ModelTransmission, on_delete=models.PROTECT, related_name="transmissions",
                                           verbose_name='Модель трансмиссии', null=True, blank=True)

    # 6. Заводской № трансмиссии. Формат: текстовое поле. Источник данных: свободный ввод
    factory_number_of_transmission = models.CharField(max_length=255, unique=True,
                                                      verbose_name='Заводской № трансмиссии')

    # 7. Модель ведущего моста. Формат: текстовое поле. Источник данных: справочник
    driving_bridge_model = models.ForeignKey(ModelDrivingBridge, on_delete=models.PROTECT, related_name="driving_bridges",
                                             verbose_name='Модель ведущего моста', null=True, blank=True)

    # 8. Зав. № ведущего моста. Формат: текстовое поле. Источник данных: свободный ввод
    factory_number_of_drive_axle = models.CharField(max_length=255, unique=True, verbose_name='Зав. № ведущего моста')

    # 9. Модель управляемого моста. Формат: текстовое поле. Источник данных: справочник
    controlled_bridge_model = models.ForeignKey(ModelControlledBridge, on_delete=models.PROTECT,
                                                related_name="controlled_bridges",
                                                verbose_name='Модель управляемого моста', null=True, blank=True)

    # 10. Зав. № управляемого моста. Формат: текстовое поле. Источник данных: свободный ввод
    factory_number_of_controlled_bridge = models.CharField(max_length=255, unique=True,
                                                           verbose_name='Зав. № управляемого моста')

    # 11. Договор поставки №, дата. Формат: текстовое поле. Источник данных: свободный ввод
    delivery_contract_number_and_date = models.CharField(max_length=255, blank=True, null=True, verbose_name='Договор поставки №, дата')

    # 12. Дата отгрузки с завода. Формат: дата. Источник данных: календарь
    date_of_shipment_from_the_factory = models.DateField(verbose_name='Дата отгрузки с завода')

    # 13. Грузополучатель (конечный потребитель). Формат: текстовое поле. Источник данных: свободный ввод
    recipient = models.ForeignKey(Recipient, max_length=255, on_delete=models.PROTECT, related_name='cars', verbose_name='Грузополучатель (конечный потребитель)')

    # 14. Адрес поставки (эксплуатации). Формат: текстовое поле. Источник данных: свободный ввод
    delivery_address = models.CharField(max_length=255, verbose_name='Адрес поставки (эксплуатации)')

    # 15. Комплектация (доп. опции). Формат: текстовое поле. Источник данных: свободный ввод
    equipment = models.TextField(verbose_name='Комплектация (доп. опции)')

    # 16. Клиент. Формат: текстовое поле. Источник данных: справочник пользователей с соответствующими правами
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='cars', verbose_name='Клиент', null=True, blank=True)

    # 17. Сервисная компания. Формат: текстовое поле. Источник данных: справочник пользователей с соответствующими правами
    service_company = models.ForeignKey(ServiceCompany, on_delete=models.PROTECT, related_name='cars',
                                        verbose_name='Сервисная компания', null=True, blank=True)

    class Meta:
        verbose_name = 'Машина'
        verbose_name_plural = 'Машины'

    def __str__(self):
        return f'Зав № машины: "{self.machines_factory_number}". Сервисная компания: "{self.service_company}"'


# Содержит информацию об истории проведения ТО каждой машины.
# Каждый объект ТО привязан к определённой Машине (см п.1 в сущности «Машина»).
# У каждой машины может быть несколько проведённых ТО.
class TechnicalMaintenance(models.Model):
    # 1. Вид ТО. Формат: текстовое поле. Источник данных: справочник.
    type_of_maintenance = models.ForeignKey(TypeMaintenance, on_delete=models.PROTECT, related_name="maintenance_types",
                                            verbose_name='Вид ТО')

    # 2. Дата проведения ТО. Формат: дата. Источник данных: календарь
    date_of_maintenance = models.DateField(verbose_name='Дата проведения ТО')

    # 3. Наработка, м/час. Формат: числовое поле. Источник данных: свободный ввод
    to_operating_time = models.FloatField(verbose_name='Наработка, м/час')

    # 4. № заказ-наряда. Формат: числовое поле. Источник данных: свободный ввод
    order_number = models.CharField(max_length=255, verbose_name='№ заказ-наряда')

    # 5. Дата заказ-наряда. Формат: дата. Источник данных: календарь
    order_date = models.DateField(verbose_name='Дата заказ-наряда')

    # 6. Организация, проводившая ТО. Формат: текстовое поле. Источник данных: справочник
    organization_carried_out_maintenance = models.ForeignKey(ServiceCompany, on_delete=models.PROTECT,
                                                             related_name="maintenance_organizations",
                                                             verbose_name='Организация, проводившая ТО')

    # 7. Машина. Формат: текстовое поле. Источник данных: база данных машин
    to_car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='technical_maintenances',
                               verbose_name='Машина')

    # 8. Сервисная компания. Формат: текстовое поле. Источник данных: справочник пользователей с соответствующими правами
    service_company = models.ForeignKey(ServiceCompany, on_delete=models.PROTECT, related_name='technical_maintenances',
                                        verbose_name='Сервисная компания')

    class Meta:
        verbose_name = 'ТО'
        verbose_name_plural = 'ТО'

    def __str__(self):
        return f'Вид ТО - {self.type_of_maintenance} | Заводской № машины - {self.to_car.machines_factory_number}'


# Содержит информацию о заявленных клиентами рекламациях, и сроках их устранения.
class Complaint(models.Model):
    # 1. Дата отказа. Формат: дата. Источник данных: календарь
    date_of_refusal = models.DateField(verbose_name='Дата отказа')

    # 2. Наработка, м/час. Формат: числовое поле. Источник данных: свободный ввод
    complaint_operating_time = models.FloatField(verbose_name='Наработка, м/час')

    # 3. Узел отказа. Формат: текстовое поле. Источник данных: справочник
    failure_node = models.ForeignKey(FailureNode, on_delete=models.PROTECT, related_name='complaints',
                                     verbose_name='Узел отказа')

    # 4. Описание отказа. Формат: текстовое поле. Источник данных: свободный ввод
    description_of_failure = models.TextField(verbose_name='Описание отказа')

    # 5. Способ восстановления. Формат: текстовое поле. Источник данных: справочник
    recovery_method = models.ForeignKey(RecoveryMethod, on_delete=models.PROTECT, related_name="complaints",
                                        verbose_name='Способ восстановления')

    # 6. Используемые запасные части. Формат: текстовое поле. Источник данных: свободный ввод
    used_spare_parts = models.TextField(verbose_name='Используемые запасные части')

    # 7. Дата восстановления. Формат: дата. Источник данных: календарь
    date_of_restoration = models.DateField(verbose_name='Дата восстановления')

    # 8. Время простоя техники. Формат: числовое поле. Источник данных: расчетное поле: [п.7] - [п.1]
    equipment_downtime = models.FloatField(editable=False, verbose_name='Время простоя техники')

    # 9. Машина. Формат: текстовое поле. Источник данных: база данных машин
    complaint_car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name="complaints", verbose_name='Машина')

    # 10. Cервисная компания. Формат: текстовое поле. Источник данных: справочник пользователей с соответствующими правами
    service_company = models.ForeignKey(ServiceCompany, on_delete=models.PROTECT, related_name="complaints",
                                        verbose_name='Cервисная компания')

    # Автоматически считываем время простоя
    def save(self, *args, **kwargs):
        if self.date_of_restoration and self.date_of_refusal:
            self.equipment_downtime = (self.date_of_restoration - self.date_of_refusal).days
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Рекламация'
        verbose_name_plural = 'Рекламации'

    def __str__(self):
        return f'Узел отказа: {self.failure_node.name} | Способ восстановления: {self.recovery_method.name}'
