from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^hifi/$','hifi.views.hifi',name='hifi'),
    url(r'^sound/$','hifi.views.sound',name='sound'),
    url(r'^$','hifi.views.home',name='home'),
)
