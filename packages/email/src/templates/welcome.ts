export function welcomeEmail(data: { name: string; loginUrl: string }): {
  html: string;
  text: string;
} {
  const text = `Hi ${data.name},\n\nWelcome to our platform! We're thrilled to have you on board.\n\nYou can access your account here: ${data.loginUrl}\n\nBest regards,\nThe Team`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to our platform</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
        <table align="center" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 32px;">
          <tr>
            <td>
              <h2 style="color: #0f172a; margin-top: 0;">Welcome, ${data.name}! 🎉</h2>
              <p style="font-size: 15px; line-height: 24px; color: #475569;">
                We're excited to welcome you. Your account has been successfully created.
              </p>
              <div style="margin: 28px 0;">
                <a href="${data.loginUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              <p style="font-size: 13px; color: #94a3b8; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                If you did not sign up for this account, you can ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return { html, text };
}
