import { Resend } from "resend";
import { logger } from "./logger";

let resend: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  if (!resend) resend = new Resend(key);
  return resend;
}

export type EnquiryEmailData = {
  name: string;
  email: string;
  phone: string;
  country: string;
  destination: string;
  course: string;
  submittedAt: Date;
};

export async function sendNewEnquiryNotification(data: EnquiryEmailData): Promise<void> {
  const client = getResend();
  if (!client) {
    logger.warn("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  const adminEmail = "admin@thamesuniconnect.com";
  const submittedTime = data.submittedAt.toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/London",
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Enquiry</title>
</head>
<body style="margin:0;padding:0;background:#F0F4FA;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F4FA;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0F2D5E;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
              <div style="display:inline-block;background:#D4963A;border-radius:10px;padding:10px 14px;margin-bottom:14px;">
                <span style="font-size:22px;">🎓</span>
              </div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                New Enquiry Received
              </h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">
                Thames Uni Connect · ${submittedTime}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;">

              <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
                A student has submitted a new consultation enquiry through the app. Here are their details:
              </p>

              <!-- Detail rows -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #E5E7EB;border-radius:12px;overflow:hidden;">
                ${[
                  ["👤 Full Name", data.name],
                  ["📧 Email", data.email || "Not provided"],
                  ["📱 WhatsApp / Phone", data.phone],
                  ["🌍 Country", data.country],
                  ["🏫 Study Destination", data.destination],
                  ["📚 Course Interest", data.course],
                ].map(([label, value], i) => `
                <tr style="background:${i % 2 === 0 ? "#F9FAFB" : "#ffffff"};">
                  <td style="padding:13px 18px;color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:40%;border-bottom:1px solid #F3F4F6;">
                    ${label}
                  </td>
                  <td style="padding:13px 18px;color:#111827;font-size:14px;font-weight:500;border-bottom:1px solid #F3F4F6;">
                    ${value}
                  </td>
                </tr>`).join("")}
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td align="center">
                    <a href="https://thamesuniconnect.com/admin/"
                       style="display:inline-block;background:#0F2D5E;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:10px;font-size:14px;font-weight:700;">
                      View in Admin Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;color:#9CA3AF;font-size:12px;text-align:center;line-height:1.6;">
                This is an automated notification from your Thames Uni Connect app.<br/>
                Reply to this email or WhatsApp the student directly to follow up.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F9FAFB;border-radius:0 0 16px 16px;padding:18px 32px;text-align:center;border-top:1px solid #E5E7EB;">
              <p style="margin:0;color:#9CA3AF;font-size:11px;">
                Thames Uni Connect · British Council Certified · London, UK<br/>
                <a href="mailto:admin@thamesuniconnect.com" style="color:#0F2D5E;text-decoration:none;">admin@thamesuniconnect.com</a>
                &nbsp;·&nbsp;
                <a href="https://wa.me/447359854658" style="color:#059669;text-decoration:none;">WhatsApp: +44 7359 854658</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const { error } = await client.emails.send({
      from: "Thames Uni Connect <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🎓 New Enquiry: ${data.name} — ${data.course} (${data.country})`,
      html,
    });

    if (error) {
      logger.error({ error }, "Resend returned error sending enquiry notification");
    } else {
      logger.info({ to: adminEmail, applicant: data.name }, "Enquiry notification email sent");
    }
  } catch (err) {
    logger.error({ err }, "Failed to send enquiry notification email");
  }
}
