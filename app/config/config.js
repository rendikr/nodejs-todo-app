require('dotenv').config();

module.exports = {
    appName: process.env.APP_NAME,
    appEnv: process.env.APP_ENV,
    appDebug: process.env.APP_DEBUG == 'true',
    apiVersion: process.env.API_VERSION,
    appPort: process.env.APP_PORT,
    baseURL: process.env.BASE_URL,
    smtpHOST: process.env.SMTP_HOST,
    smtpPORT: process.env.SMTP_PORT,
    smtpUsername: process.env.SMTP_USERNAME,
    smtpPASS: process.env.SMTP_PASS,
    smtpFromName: process.env.SMTP_FROM_NAME,
    smtpFromMail: process.env.SMTP_FROM_MAIL,
};
