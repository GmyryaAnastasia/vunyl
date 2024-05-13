import { Injectable } from '@nestjs/common';

import { Transporter, SentMessageInfo, SendMailOptions } from 'nodemailer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {
  async sendEmail(email: string): Promise<SentMessageInfo> {
    const transporter: Transporter = nodemailer.createTransport({
      service: 'yandex',
      secure: false,
      auth: {
        user: process.env.SECRET_LOGIN,
        pass: process.env.SECRET_PSS,
      },
    });

    const mailOptions: SendMailOptions = {
      from: process.env.SECRET_FULL_LOGIN,
      to: email,
      subject: 'Payment Confirmation',
      text: 'Thank you for your payment.',
    };

    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
  }
}
