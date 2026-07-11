import { resendClient, sender } from "../lib/resend.js";
import { createNewsletterTemplate } from "./emailTemplates.js";
import { createWelcomeAccountTemplate } from "./emailTemplates.js";

export const sendSubscribeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to BenShop",
    html: createNewsletterTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome Email sent successfully", data);
};

export const sendWelcomeAccountEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to BenShop 🎉",
    html: createWelcomeAccountTemplate(name, clientURL),
  });

  console.log(data);
  console.log(error);

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome email sent successfully", data);
};
