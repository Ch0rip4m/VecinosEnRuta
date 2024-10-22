# Generated by Django 5.0.4 on 2024-10-22 18:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DatabaseManager', '0015_notificaciones_es_comunidad_notificaciones_es_ruta'),
    ]

    operations = [
        migrations.AddField(
            model_name='notificaciones',
            name='id_comunidad',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='DatabaseManager.comunidades', verbose_name='ID de comunidad'),
        ),
        migrations.AlterField(
            model_name='notificaciones',
            name='id_ruta',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='DatabaseManager.rutas', verbose_name='ID de la ruta'),
        ),
    ]