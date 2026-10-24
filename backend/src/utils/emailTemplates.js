// Pure email rendering — no I/O. Message text can contain user-written
// content (task titles, names), so everything interpolated into HTML is
// escaped.
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const SUBJECTS = {
  task_assigned: "You were assigned a task",
  comment_added: "New comment on your task",
  due_soon: "A task is due soon",
  overdue: "A task is overdue",
  sprint_closed: "A sprint was closed",
  submission_created: "A task was submitted for review",
  submission_approved: "Your submission was approved",
  submission_changes_requested: "Changes requested on your submission",
};

const ACCENT = "#38bdf8";

const layout = ({ heading, body, link, linkLabel = "Open in TaskFlow" }) => `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;">
      <tr><td style="padding:28px 28px 8px;">
        <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;font-weight:600;">TaskFlow</div>
        <h1 style="margin:10px 0 0;font-size:18px;line-height:1.35;color:#0f172a;">${escapeHtml(heading)}</h1>
      </td></tr>
      <tr><td style="padding:12px 28px 4px;font-size:15px;line-height:1.55;color:#334155;">${body}</td></tr>
      ${
        link
          ? `<tr><td style="padding:20px 28px 28px;"><a href="${escapeHtml(link)}" style="display:inline-block;background:${ACCENT};color:#04121c;text-decoration:none;font-weight:600;font-size:14px;padding:10px 18px;border-radius:8px;">${escapeHtml(linkLabel)}</a></td></tr>`
          : `<tr><td style="padding:12px 28px 28px;"></td></tr>`
      }
    </table>
    <p style="max-width:520px;margin:14px auto 0;font-size:12px;color:#94a3b8;text-align:center;">
      You can change which emails you get in Account → Notification preferences.
    </p>
  </body>
</html>`;

const buildNotificationEmail = ({ type, message, link, recipientName }) => {
  const subject = SUBJECTS[type] || "New notification";
  const greeting = recipientName ? `Hi ${recipientName},` : "Hi,";
  const text = [greeting, "", message, "", link ? `Open in TaskFlow: ${link}` : "", "", "Change email preferences in Account → Notification preferences."]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");
  const body = `<p style="margin:0 0 4px;">${escapeHtml(greeting)}</p><p style="margin:10px 0 0;">${escapeHtml(message)}</p>`;
  return { subject, text, html: layout({ heading: subject, body, link }) };
};

const buildTestEmail = ({ recipientName }) => {
  const subject = "TaskFlow test email";
  const message = "Email delivery is working. You'll receive notifications here based on your preferences.";
  return {
    subject,
    text: `Hi ${recipientName || ""},\n\n${message}`.replace("Hi ,", "Hi,"),
    html: layout({
      heading: subject,
      body: `<p style="margin:0;">${escapeHtml(message)}</p>`,
    }),
  };
};

module.exports = { buildNotificationEmail, buildTestEmail, escapeHtml, SUBJECTS };