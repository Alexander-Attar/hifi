import random
import urllib2
import calendar
import datetime

import requests
from PIL import ImageFile

from django.core.management.base import BaseCommand

from hifi.models import Image

class Command(BaseCommand):
    """
    Command class.
    """
    help = 'Usage: python manage.py getgifs'

    def handle(self,*args,**options):
        """
        Handler method.
        """
        stime = datetime.datetime.now()

        index = 0
        images = []
        timestamp = calendar.timegm(datetime.datetime.now().utctimetuple())

        while index < 100:

            # this is a hack on tumblr's API to retrieve more than 20 images by navigating back in time via timestamp

            tumblr_url = 'http://api.tumblr.com/v2/tagged?api_key=YP7Ou3HkhMg9eXEsHK3ZEXK041U8yhhnrzhZIrJd47y498Cd7c&tag=gif&before=%s' % timestamp

            print 'Making request: %s' % tumblr_url
            r = requests.get(tumblr_url)

            for i in range(len(r.json()['response'])):
                if not 'photos' in r.json()['response'][i]: continue
                photos = r.json()['response'][i]['photos']

                for p in photos:
                    if not 'original_size' in p: continue

                    try:  # to get image info
                        file_size, width, height = self.get_image_size(p['original_size']['url'])
                        print 'Image: %s, Width: %s, Height: %s' % (p['original_size']['url'], width, height)
                    except Exception as e:
                        print str(e)

                    # skip if the image size looks too small
                    if width < 50 or height < 50:
                        print 'Image is too small. Not saving'
                        continue

                    # check for duplicates
                    url_count = Image.objects.filter(url=p['original_size']['url']).count()

                    # save the image if it isn't in the database
                    if not url_count > 0:
                        print 'Saving image: %s' % p['original_size']['url'].split('/')[-1]
                        image = Image.objects.create(
                            url=p['original_size']['url'],
                            name=p['original_size']['url'].split('/')[-1]
                        )
                        images.append(p['original_size']['url'])  # keep a count
                        image.save()
                    else:
                        print 'Duplicate image. Not saving.'

            # navigate back
            timestamp -= 10500  # this is kind of arbitrary, just the result of experimenting
            index += 1

        print '%s have been saved to the database.' % len(images)
        etime = (datetime.datetime.now() - stime).seconds / 60.0
        print 'Finished getcounterpointbalance. %s minutes have elapsed.' % etime

    def get_image_size(self, url):
        """ get file size *and* image size (None if not known) """

        response = urllib2.urlopen(url)
        size = response.headers.get("content-length")

        if size:
            size = int(size)
        p = ImageFile.Parser()
        while 1:
            data = response.read(24)
            if not data:
                break
            p.feed(data)
            if p.image:
                return size, p.image.size[0], p.image.size[1]
                break
        response.close()
        return size, None, None

