import os
import smtplib
from email.message import EmailMessage

login = os.getenv("MAIL_LOGIN")
fromaddr = os.getenv("MAIL_FROMADDR")
SMTPServer = os.getenv("MAIL_SERVER")
port = os.getenv("MAIL_PORT")
password = os.getenv("MAIL_PASSWORD")

def send_email(recipient, subject, message):

   msg = EmailMessage()
   msg.set_content(message)
   msg['Subject'] = subject
   msg['From'] = fromaddr
   msg['To'] = recipient

   server = smtplib.SMTP_SSL(SMTPServer, port)
   server.login(login, password)
   server.send_message(msg)
   server.quit() 