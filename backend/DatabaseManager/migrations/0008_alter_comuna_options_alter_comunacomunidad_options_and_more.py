# Generated by Django 5.0.4 on 2024-09-22 20:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('DatabaseManager', '0007_comuna_region_remove_comunidades_comuna_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comuna',
            options={'verbose_name': 'Comuna', 'verbose_name_plural': 'Comunas'},
        ),
        migrations.AlterModelOptions(
            name='comunacomunidad',
            options={'verbose_name': 'ComunaComunidad', 'verbose_name_plural': 'ComunaComunidades'},
        ),
        migrations.AlterModelOptions(
            name='comunaregion',
            options={'verbose_name': 'ComunaRegion', 'verbose_name_plural': 'ComunaRegiones'},
        ),
        migrations.AlterModelOptions(
            name='region',
            options={'verbose_name': 'Region', 'verbose_name_plural': 'Regiones'},
        ),
    ]
