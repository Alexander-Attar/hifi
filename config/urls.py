from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'hifi.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^hifi/$','mixtapes.views.hifi',name='hifi'),
    url(r'^sound/$','mixtapes.views.sound',name='sound'),
    url(r'^$','mixtapes.views.home',name='home'),
)
