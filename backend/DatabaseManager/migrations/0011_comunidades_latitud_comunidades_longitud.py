# Generated by Django 5.0.4 on 2024-10-11 19:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DatabaseManager', '0010_delete_chat'),
    ]

    operations = [
        migrations.AddField(
            model_name='comunidades',
            name='latitud',
            field=models.FloatField(default=0, verbose_name='Latitud'),
        ),
        migrations.AddField(
            model_name='comunidades',
            name='longitud',
            field=models.FloatField(default=0, verbose_name='Longitud'),
        ),
    ]