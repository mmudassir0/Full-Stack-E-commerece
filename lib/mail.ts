import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "mudassirabbas.ma@gmail.com",
    subject,
    html,
  });
};
