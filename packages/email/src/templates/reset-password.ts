export function resetPasswordEmail(data: { name: string; resetUrl: string }): {
  html: string;
  text: string;
} {
  const text = `Hi ${data.name},\n\nYou requested a password reset. Click the link below to set a new password:\n${data.resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset your password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
        <table align="center" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 32px;">
          <tr>
            <td>
              <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
              <p style="font-size: 15px; line-height: 24px; color: #475569;">
                Hello ${data.name}, we received a request to reset your password. Click the button below to choose a new password:
              </p>
              <div style="margin: 28px 0;">
                <a href="${data.resetUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 13px; color: #64748b;">
                This link will expire in 1 hour. If you did not make this request, your account is secure and you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return { html, text };
}
