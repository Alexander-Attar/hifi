import random
import datetime
import calendar
import logging
from pprint import pprint

import requests
import soundcloud

from decorators import template
from django.shortcuts import render
from django.http import HttpResponseRedirect


logger = logging.getLogger(__name__)

@template('home.html')
def home(request):
    pass

    # images = []
    # tumblr_url = 'http://api.tumblr.com/v2/tagged?api_key=YP7Ou3HkhMg9eXEsHK3ZEXK041U8yhhnrzhZIrJd47y498Cd7c&tag=gif+light&before=%s' % timestamp

    # r = requests.get(tumblr_url)

    # for i in range(len(r.json()['response'])):
    #     if not 'photos' in r.json()['response'][i]: continue
    #     photos = r.json()['response'][i]['photos']

    #     for p in photos:
    #         if not 'original_size' in p: continue

    #     images.append(p['original_size']['url'])

    # return {'images': images}

@template('hifi.html')
def hifi(request):

    images = []
    r = requests.get('http://api.tumblr.com/v2/tagged?tag=gif&api_key=dGwcFI3DVY8C5EzQI9zmpiVDgLhrCMbGygHic7WtDRUWV6RAa0')

    for i in range(len(r.json()['response'])):
        if not 'photos' in r.json()['response'][i]: continue
        photos = r.json()['response'][i]['photos']

        for p in photos:
            if not 'original_size' in p: continue

        images.append(p['original_size']['url'])

    return {'images': images}

@template('sound.html')
def sound(request):

    embeds = []

    client = soundcloud.Client(client_id='51e5315d2d8046ad3b14ba65871265b2')
    tracks = client.get('/tracks', genres='techno', limit=5, offset=random.randint(0,8000))  # randomize choices

    for t in tracks:
        sound = client.get('/oembed', url=t.permalink_url, color='000000')
        embeds.append(sound.html)

    return {'embeds': embeds}

