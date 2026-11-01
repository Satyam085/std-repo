export function notificationEmail(data: {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}): { html: string; text: string } {
  const text = `${data.title}\n\n${data.message}${data.actionUrl ? `\n\nLink: ${data.actionUrl}` : ""}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${data.title}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
        <table align="center" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 32px;">
          <tr>
            <td>
              <h2 style="color: #0f172a; margin-top: 0;">${data.title}</h2>
              <p style="font-size: 15px; line-height: 24px; color: #475569;">
                ${data.message}
              </p>
              ${
                data.actionUrl
                  ? `
                <div style="margin: 28px 0;">
                  <a href="${data.actionUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
                    ${data.actionText || "View Details"}
                  </a>
                </div>
              `
                  : ""
              }
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return { html, text };
}
