from django.db import models


class Image(models.Model):
    name = models.CharField(max_length=255, blank=True)
    url = models.CharField(max_length=255, unique=True, blank=True)

    def __unicode__(self):
        return self.name
