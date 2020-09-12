import nodemailer from 'nodemailer';

class RegistrationMail {
  constructor() {
    nodemailer.createTransport();
  }
}

export default new RegistrationMail();
