About
==================================

HiFi is an image visualizer that mashes up sounds from SoundCloud, and images from Tumblr. It allows the user to play sounds from a series of popular genres, as well as from their own sound library, or their favorite sounds. I called it HiFi as a nod to the book/movie High Fidelity, and the desire to evoke feeling through the combination of sound and corresponding visuals.

The original idea was to create an image playlist relating to the genre of music selected from SoundCloud. My thought was that certain genres could relate to various tags, which I would correlate based on my own experience, and then these tags would be used to request images from the Tumblr API.

I quickly learned that the Tumblr API was not as versatile as I had hoped, and searching by tag was something that was barely supported. Only 20 images would be returned from each request, and offset was not a optional parameter. I was able to find a hack around this by navigating back by timestamp to retrieve more images.

As I experimented, I found that gifs produced the most interesting results. So rather than using a bunch of different tags, I set the program up to make a series of requests to gather and randomize a collection of gifs. This could be further developed to gather gifs that also have other distinguishing tags, but for this prototype I decided to keep it simple.

The design is minimal, with the main interface consisting of a series of buttons for sound selection, and then a viewfinder that becomes present once the images and sound are loaded. To begin, the user must connect to SoundCloud so that sounds from the user’s library can be used. As a prototype, I kept it to a basic one page app, and leveraged jQuery for hiding and showing elements during the connection flow. Originally, I originally wrote much of the logic on the backend using Python and Django, but migrated the logic to the frontend, when I decided it would provide a more dynamic experience.

There are a couple backend views that are still present in the app that were the result of my experiments with the APIs. These are located at http://hifi.herokuapp.com/hifi and http://hifi.herokuapp.com/sound. An additonal idea I played with was a mixtape generator based on image selection, and these were my drafts for that idea.

I have tested the app on Chrome, Firefox, and Safari with success. There are a number of ways the project could be further developed, but I believe this prototype creates an interesting experience, and demonstrates the potential for further interesting combinations of the SoundCloud and Tumblr APIs, or even just the combination of sound from SoundCloud, and visual media.