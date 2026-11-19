import emailjs from "@emailjs/browser";

const MAIL_SERVICE = "service_t52cepr";
const MAIL_TEMPLATE = "template_tt7sqi7";
const MAIL_PUBLIC_KEY = "oDYDzwYQrLY_-YViZ";

export function sendStudioMail({ name, email, message }) {
  return emailjs.send(
    MAIL_SERVICE,
    MAIL_TEMPLATE,
    {
      name,
      email,
      message,
      reply_to: email,
    },
    { publicKey: MAIL_PUBLIC_KEY }
  );
}
