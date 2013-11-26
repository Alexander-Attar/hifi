import logging

import soundcloud

from decorators import template
from django.shortcuts import render


logger = logging.getLogger(__name__)

@template('hifi.html')
def hifi(request):
    pass