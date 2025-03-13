# Generated by Django 4.2.19 on 2025-02-10 23:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_remove_modelreference_model_of_technique_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='car',
            name='driving_bridge_model',
            field=models.ForeignKey(limit_choices_to={'driving_bridge_model__isnull': False}, on_delete=django.db.models.deletion.PROTECT, related_name='driving_bridges', to='app.modelreference', verbose_name='Модель ведущего моста'),
        ),
        migrations.AlterField(
            model_name='car',
            name='engine_model',
            field=models.ForeignKey(limit_choices_to={'model_of_engine__isnull': False}, on_delete=django.db.models.deletion.PROTECT, related_name='engines', to='app.modelreference', verbose_name='Модель двигателя'),
        ),
        migrations.AlterField(
            model_name='car',
            name='transmission_model',
            field=models.ForeignKey(limit_choices_to={'model_of_transmission__isnull': False}, on_delete=django.db.models.deletion.PROTECT, related_name='transmissions', to='app.modelreference', verbose_name='Модель трансмиссии'),
        ),
        migrations.AlterField(
            model_name='modelreference',
            name='name',
            field=models.CharField(max_length=255, unique=True, verbose_name='Название модели техники'),
        ),
    ]
