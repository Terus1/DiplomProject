# Generated by Django 4.2.19 on 2025-02-11 10:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_modelcontrolledbridge_modeldrivingbridge_modelengine_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='car',
            name='delivery_contract_number_and_date',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Договор поставки №, дата'),
        ),
    ]
