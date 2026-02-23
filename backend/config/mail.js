import sgMail from '@sendgrid/mail';

const mail = {
  
  sendMail: async (details) => {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not set');
    }
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: details.to,
      from: details.from || process.env.SENDGRID_FROM,
      subject: details.subject,
      text: details.text || undefined,
      html: details.html || undefined,
    };
    return sgMail.send(msg);
  }
};

export default mail;