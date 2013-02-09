from google.appengine.api import mail
from google.appengine.ext import db
from google.appengine.ext import ndb
import webapp2
import cgi
import logging
import re
import urllib

class Event(ndb.Model):
  address = ndb.StringProperty()
  count = ndb.StringProperty()

class LocationUpdater(webapp2.RequestHandler):
  def post(self):
    self.response.headers['Content-Type'] = 'text/plain'
    address = cgi.escape(self.request.get('address'))
    count = cgi.escape(self.request.get('count'))

    key = ndb.Key(Event, 314) # 314 = random unique key in the db
    event = key.get()
    if not event:
      event = Event(key=key)

    event.address = address
    event.count = count
    event.put()

    self.response.out.write("success")
  def get(self):
    self.response.headers['Content-Type'] = 'text/plain'
    key = ndb.Key(Event, 314)
    event = key.get()
    if not event:
      self.response.out.write("None")
    else:
      self.response.out.write(event.address + "|" + event.count)

app = webapp2.WSGIApplication([
                               ('/py/location', LocationUpdater)
                               ],
                              debug=True)

def main():
    # Set the logging level in the main function
    # See the section on Requests and App Caching for information on how
    # App Engine reuses your request handlers when you specify a main function
    logging.getLogger().setLevel(logging.DEBUG)
    webapp.util.run_wsgi_app(application)

if __name__ == '__main__':
    main()
