#------- This module contains a set of general purpose utilities used by Huby backend ------
# --- Let's add classes for different purposes
import os, logging
import json
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import From, To
from sendgrid.helpers.mail import Mail
from oauth2 import OAuth2
from cache import Cache
from configparser import ConfigParser
import requests

class EmailUtil:
    def __init__(self, from_email="", from_name = "", logger = ""):
        #--- We should get the following member values from a config file ---#
        config      = ConfigParser()
        if "WorkingDirectory" not in os.environ:
            raise EnvironmentError("Missing value for environment variable WorkingDirectory in EmailUtil().")
            return
        configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
        config.read(configFile)
        if from_email   == "":
            self.from_email = config.get('Default', 'from_email')
        else:
            self.from_email = from_email
        if from_name   == "":
            self.from_name = config.get('Default', 'from_name')
        else:
            self.from_name = from_name
        logLevel        = config.get('Default', 'log_level')
        if logger == "":
            logger = logging.getLogger()
            file_with_path = "/var/log/huby/email_util.log"
            handler = logging.FileHandler(file_with_path)
            handler.setFormatter(logging.Formatter('%(asctime)s.%(msecs)03d  %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S'))
            logger.addHandler(handler)
            if logLevel != "":
                logger.logLevel = logLevel
            else:
                logger.logLevel = logging.INFO
        self.logger = logger
        return
    
    def send_email(self, to_emails, subject, body ):
        # we need to use sendgrid or mailgun services to send emails.
        # validate the input values
        if len(to_emails) < 1:
            return {"success": 0,  "error": "email not sent; No email to address."}
        if subject == "" and body == "":
            return {"success": 0,  "error": "email cannot be sent without a subject and body."}
        #print("EmailUtil.send_email: frome email: {} and to_emails: {}".format(self.from_email, to_emails))
        from_email = From(self.from_email, self.from_name)
        message = Mail(
                    from_email = from_email,
                    to_emails=to_emails,
                    subject= subject,
                    html_content = body)
        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            self.logger.info("Sending email using sendgrid. ")
            response = sg.send(message)
            #print(response.status_code)
            #print(response.body)
            #print(response.headers)
            self.logger.info("Successfully sent the email using sendgrid. ")
            return {"success": 1, "message": "email sent successfully"}
        except Exception as e:
            self.logger.error("Exception in EmailUtil.send_email: {}".format(e))
            return {"success": 0,  "error": "email could not be sent because of the error: {}".format(e)}

    def send_email_mailgun(self, from_email, to_emails, subject, body):
  	    return requests.post(
  		"https://api.mailgun.net/v3/sandbox34ea74c60b7e4c48af1c51c96f181ea9.mailgun.org/messages",
  		auth=("api", "2d35abaaf65126359410f36fbb27d78a-911539ec-b78ed655"),
  		data={"from": from_email,
  			"to": to_emails,
  			"subject": subject,
  			"text": body})    
