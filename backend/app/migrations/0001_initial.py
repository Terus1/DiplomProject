# Generated by Django 4.2.19 on 2025-02-10 19:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Car',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('machines_factory_number', models.CharField(max_length=255, unique=True)),
                ('engine_serial_number', models.CharField(max_length=255, unique=True)),
                ('factory_number_of_transmission', models.CharField(max_length=255, unique=True)),
                ('factory_number_of_drive_axle', models.CharField(max_length=255, unique=True)),
                ('factory_number_of_controlled_bridge', models.CharField(max_length=255, unique=True)),
                ('delivery_contract_number_and_date', models.TextField()),
                ('date_of_shipment_from_the_factory', models.DateField()),
                ('recipient', models.TextField()),
                ('delivery_address', models.TextField()),
                ('equipment', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('contact_info', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FailureNode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ModelReference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='RecoveryMethod',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ServiceCompany',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='TechnicalMaintenance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_of_maintenance', models.TextField()),
                ('date_of_maintenance', models.DateField()),
                ('to_operating_time', models.FloatField()),
                ('order_number', models.TextField()),
                ('order_date', models.DateField()),
                ('organization_carried_out_maintenance', models.TextField()),
                ('service_company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='app.servicecompany')),
                ('to_car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.car')),
            ],
        ),
        migrations.CreateModel(
            name='Complaint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_of_refusal', models.DateField()),
                ('complaint_operating_time', models.FloatField()),
                ('description_of_failure', models.TextField()),
                ('used_spare_parts', models.TextField()),
                ('date_of_restoration', models.DateField()),
                ('equipment_downtime', models.FloatField(editable=False)),
                ('complaint_car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.car')),
                ('failure_node', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='app.failurenode')),
                ('recovery_method', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='app.recoverymethod')),
                ('service_company', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='app.servicecompany')),
            ],
        ),
        migrations.AddField(
            model_name='car',
            name='client',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='app.client'),
        ),
        migrations.AddField(
            model_name='car',
            name='controlled_bridge_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='controlled_bridges', to='app.modelreference'),
        ),
        migrations.AddField(
            model_name='car',
            name='driving_bridge_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='driving_bridges', to='app.modelreference'),
        ),
        migrations.AddField(
            model_name='car',
            name='engine_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='engines', to='app.modelreference'),
        ),
        migrations.AddField(
            model_name='car',
            name='model_of_technique',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='cars', to='app.modelreference'),
        ),
        migrations.AddField(
            model_name='car',
            name='service_company',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='app.servicecompany'),
        ),
        migrations.AddField(
            model_name='car',
            name='transmission_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='transmissions', to='app.modelreference'),
        ),
    ]
