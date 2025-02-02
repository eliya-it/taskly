import nodemailer from "nodemailer";

if (!process.env.USER_EMAIL || !process.env.USER_EMAIL_PASSWORD) {
  const missingVars = [];
  if (!process.env.USER_EMAIL) missingVars.push("USER_EMAIL");
  if (!process.env.USER_EMAIL_PASSWORD) missingVars.push("USER_EMAIL_PASSWORD");

  throw new Error(
    `Missing required environment variables: ${missingVars.join(
      ", "
    )}. Please set these variables before running the application.`
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASSWORD,
  },
});

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<void> => {
  const mailOptions: MailOptions = {
    from: process.env.USER_EMAIL!,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email:", (error as Error).message);
  }
};
