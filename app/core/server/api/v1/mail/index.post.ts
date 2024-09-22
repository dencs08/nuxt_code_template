import nodemailer from "nodemailer";
import mjml2html from "mjml";
import { defineApiHandler } from "~~/server/utils/api-handler";

export default defineApiHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  if (
    !body.to ||
    !body.subject ||
    (!body.text && !body.html && !body.mjmlContent)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  let html = body.html;

  if (body.mjmlContent) {
    const { html: mjmlHtml, errors } = mjml2html(body.mjmlContent);
    if (errors.length) {
      console.error("MJML Errors:", errors);
    }
    html = mjmlHtml;
  }

  const transporter = nodemailer.createTransport({
    host: config.public.SMTP_HOST, //no idea why is giving no overload error, when entered manually in the code it works fine.
    port: config.public.SMTP_PORT,
    secure: config.public.SMTP_SECURE === "true",
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: body.signature
        ? `${body.signature} <${config.public.SMTP_FROM}>`
        : config.public.SMTP_FROM,
      bcc: body?.bcc,
      to: body.to,
      subject: body.subject,
      text: body.text,
      html: html,
    });

    return "Email sent successfully";
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw createError({
      statusCode: error.code || 500,
      statusMessage: error.message || "Failed to send email",
    });
  }
});
