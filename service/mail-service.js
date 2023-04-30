const nodemailer = require("nodemailer");
class MailService {

     constructor(){
          this.transporter = nodemailer.createTransport({
               host:process.env.SMTP_HOST,
               port:process.env.SMTP_PORT,
               secure:false,
               auth:{
                    user:process.env.SMTP_USER,
                    pass:process.env.SMTP_PASSWORD,
               }

          })
     }

     async sendActivationMail(to,link){
          await this.transporter.sendMail({
               from:process.env.SMTP_USER,
               to,
               subject:"Activattion account",
               html:`
                    <div>
                         <p> Activate <a href="${link}">${link}</a> </p>
                    </div>
               `
          })
     }
}

module.exports = new MailService();