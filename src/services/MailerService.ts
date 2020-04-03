import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars' // tslint:disable-line
import path from 'path'

const account = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ctrfinances@gmail.com',
    pass: 'Control@2020'
  }
}).use('compile', hbs({
  viewEngine: {
    extname: '.hbs',
    layoutsDir: path.resolve('./src/resources/mail/views/email/'),
    defaultLayout: 'template',
    partialsDir: path.resolve('./src/resources/mail/views/partials/')
  },
  viewPath: path.resolve('./src/resources/mail/views/email/'),
  extName: '.hbs'
}))

class MailerService {
  public async sendEmailForgot (nickname: string, email: string, token: string): Promise<void> {
    try {
      account.sendMail({
        from: 'Control Finance <raphalclima@gmail.com>',
        to: nickname + ' ' + '<' + email + '>',
        subject: 'Forgot password',
        template: 'forgotPassword',
        context: { token }
      })
    } catch (err) {
      console.log('Error: ' + err)
    }
  }
}

export default new MailerService()
