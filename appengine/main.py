from google.appengine.api import mail
from google.appengine.ext import db
import webapp2
import cgi
import logging
import stripe
import re
import urllib
from hbsdinners import Dinners

class Donate(webapp2.RequestHandler):
  def post(self):
      self.response.headers['Content-Type'] = 'text/plain'
      logging.info("Received post request for donate form")

      firstname = cgi.escape(self.request.get('firstname'))
      if firstname == "":
        self.response.out.write("Error: firstname")
        return
      
      lastname = cgi.escape(self.request.get('lastname'))
      if lastname == "":
        self.response.out.write("Error: lastname")
        return

      streetaddress = cgi.escape(self.request.get('streetaddress'))
      if streetaddress == "":
        self.response.out.write("Error: streetaddress")
        return

      city = cgi.escape(self.request.get('city'))
      if city == "":
        self.response.out.write("Error: city")
        return

      state = cgi.escape(self.request.get('state'))
      if state == "":
        self.response.out.write("Error: state")
        return

      zipcode = cgi.escape(self.request.get('zipcode'))
      if zipcode == "":
        self.response.out.write("Error: zipcode")
        return

      email = cgi.escape(self.request.get('email'))
      if email == "":
        self.response.out.write("Error: email")
        return
      if validateEmail(email) == 0:
        self.response.out.write("Error: invalid email")
        return

      eligible = cgi.escape(self.request.get('eligible'))
      if eligible == "":
        self.response.out.write("Error: eligible")
        return

      # These fields are optional unless amount > 100
      anonymous = cgi.escape(self.request.get('anonymous'))
      occupation = cgi.escape(self.request.get('occupation'))
      employer = cgi.escape(self.request.get('employer'))

      # set your secret key
      # TODO: change this to your live secret key in production
      # see your keys here https://manage.stripe.com/account
      stripe.api_key = "ohJObvCGfW5KG0VoinKrVv8GmJJLwPEz"

      # test private key
      #stripe.api_key = "uxfpeJWufqILv5lR97Ozx1arjKpIMUnk"
 
      # get the credit card details submitted by the form
      stripeToken = cgi.escape(self.request.get('stripeToken'))
      if stripeToken == "":
        self.response.out.write("Error: stripeToken missing. Did you disable Javascript?")
        return

      stramount = cgi.escape(self.request.get('amount'))
      if stramount == "":
        self.response.out.write("Error: amount")
        return

      amount = int(stramount) * 100 # in cents
 
      # create the charge on Stripe's servers - this will charge the user's card
      charge = stripe.Charge.create(
        amount=amount, # amount in cents, again
        currency="usd",
        card=stripeToken,
        description=email + "," +
                    firstname + "," +
                    lastname + "," +
                    streetaddress + "," +
                    city + "," +
                    state + "," +
                    zipcode + "," +
                    occupation + "," +
                    employer + "," +
                    anonymous + "," +
                    eligible
      )

      mail.send_mail(sender="Victoria Lo <victoria@victorialo2012.com>",
                    to=email,
                    subject="Thank you",
                    body="""
Dear """+firstname+""":

A heartfelt thanks for your contribution of $"""+str(amount / 100)+""".00 amount to my campaign. Nothing is more important than providing today's youth with equal opportunity, and your commitment to this cause is sincerely appreciated.

Victoria
""")

      self.response.out.write("success")

class Support(webapp2.RequestHandler):
  def post(self):
      self.response.headers['Content-Type'] = 'text/plain'

      email = cgi.escape(self.request.get('email'))
      if email == "":
        self.response.out.write("ERROR: email was empty")
        return
      if validateEmail(email) == 0:
        self.response.out.write("invalid email")
        return

      name = cgi.escape(self.request.get('name'))
      if name == "":
        self.response.out.write("ERROR: name was empty")
        return

      supporter = Supporter(parent=supporterbook_key())
      supporter.supportername = name
      supporter.supporteremail = email
      supporter.put()

      self.response.out.write("success")

class Supporter(db.Model):
    supportername = db.StringProperty()
    supporteremail = db.StringProperty()

def supporterbook_key():
  """Constructs a Datastore key for a Supporterbook entity with default_supporterbook."""
  return db.Key.from_path('Supporterbook', 'default_supporterbook')

def validateEmail(email):
  # http://code.activestate.com/recipes/65215-e-mail-address-validation/
  if len(email) > 7:
    if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email) != None:
      return 1
  return 0

class Admin(webapp2.RequestHandler):
  def get(self):
    self.response.headers['Content-Type'] = 'text/plain'

    supporters = db.GqlQuery("SELECT * "
                             "FROM Supporter ")
    
    for eachsupporter in supporters:
      self.response.out.write('%s,%s\n' % (eachsupporter.supportername,eachsupporter.supporteremail))

app = webapp2.WSGIApplication([('/py/donate', Donate),
                               ('/py/support', Support),
                               ('/py/dinners', Dinners),
                               ('/admin', Admin)],
                              debug=True)

def main():
    # Set the logging level in the main function
    # See the section on Requests and App Caching for information on how
    # App Engine reuses your request handlers when you specify a main function
    logging.getLogger().setLevel(logging.DEBUG)
    webapp.util.run_wsgi_app(application)

if __name__ == '__main__':
    main()
