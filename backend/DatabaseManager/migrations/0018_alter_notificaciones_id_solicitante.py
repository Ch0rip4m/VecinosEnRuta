# Generated by Django 5.0.4 on 2024-10-23 14:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DatabaseManager', '0017_remove_notificaciones_id_usuario_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notificaciones',
            name='id_solicitante',
            field=models.ForeignKey(default=0, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='propietario_solicitud', to=settings.AUTH_USER_MODEL, verbose_name='ID del solicitante'),
        ),
    ]
