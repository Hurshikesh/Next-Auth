import nodemailer from 'nodemailer'
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs'
export const sendEmail = async({email,emailType,userId}:any) =>{

    try{
       const hashedToken = await bcryptjs.hash(userId.toString(),10)
        
        if (emailType=== "VERIFY"){
          await User.findByIdAndUpdate(userId,
          {$set: {verifyToken: hashedToken, verifyTokenExpiry: Date.now()+3600000}}
          )
        }else if(emailType=== "RESET"){
          await User.findByIdAndUpdate(userId,
          {$set: {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now()+3600000}}
            )
        }
        const transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "73327c6e8e652e",// dont directly use here
            pass: "236d5b837072ad"// dont directly use here
          }
        });
          
          const mailOptions = {
            from: 'sonuhurshikesh@gmail.com',
            to: email, 
            subject: emailType === 'VERIFY'? "Verify your email" : "Reset your password",
            html: `<p>click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType==="VERIFY"?"verify your password": "reset your password"} or copy and paste the link below in your browser.
            <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
          } 
          console.log('Sending email to:', email);
        console.log('Mail options:', mailOptions);

        const mailResponse = transport.sendMail(mailOptions,(error, info)=>{
          if (error) {
              console.log(error);
          } else {
              console.log('Email sent: ' + info.response);
          }
      });
          console.log('Email sent:', mailResponse);
          return mailResponse
    }catch(error:any){
        throw new Error(error.message)
    }
}