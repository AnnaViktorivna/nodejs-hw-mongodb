import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';
import { ENV_VARS } from '../constants/index.js';

// const transporter = nodemailer.createTransport({
//   host: env(ENV_VARS.SMTP_HOST),
//   port: Number(env(ENV_VARS.SMTP_PORT)),
//   auth: {
//     // user: env(ENV_VARS.SMTP_USER),
//     user: "76fa68001@smtp-brevo.com",
//     pass: env(ENV_VARS.SMTP_PASSWORD),
//   },
// });

const transporter = nodemailer.createTransport({
  host: env(ENV_VARS.SMTP_HOST),
  port: Number(env(ENV_VARS.SMTP_PORT)),
  auth: {
    user: '76fa68001@smtp-brevo.com',
    pass: env(ENV_VARS.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
