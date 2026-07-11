export function createNewsletterTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>

  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#333;">

    <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">

            <tr>
              <td align="center" style="background:#111827;padding:40px 30px;">
                <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;">
                  Hi ${name}
                </h1>

                <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;">
                  Welcome to BenShop
                </h1>

                <p style="margin-top:12px;color:#d1d5db;font-size:16px;">
                  Thanks for joining our newsletter.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:40px;">

                <p style="font-size:16px;margin-top:0;">
                  Thank you for subscribing to <strong>BenShop</strong>.
                </p>

                <p style="color:#555;line-height:1.8;">
                  You'll be among the first to hear about our newest collections,
                  exclusive promotions, seasonal sales, and limited-time offers.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
                  <tr>
                    <td style="padding:24px;">

                      <h3 style="margin-top:0;margin-bottom:18px;color:#111827;">
                        Here's what you'll receive
                      </h3>

                      <p style="margin:10px 0;">✓ Exclusive promotional campaigns</p>

                      <p style="margin:10px 0;">✓ Early access to new arrivals</p>

                      <p style="margin:10px 0;">✓ Seasonal discounts and flash sales</p>

                      <p style="margin:10px 0;">✓ Member-only offers</p>

                    </td>
                  </tr>
                </table>

                <div style="text-align:center;margin:40px 0;">

                  <a
                    href="${clientURL}"
                    style="
                      display:inline-block;
                      padding:14px 34px;
                      background:#111827;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:6px;
                      font-weight:bold;
                    "
                  >
                    Visit BenShop
                  </a>

                </div>

                <p style="color:#555;line-height:1.8;">
                  We respect your inbox and only send emails when there's something
                  worth sharing. You can unsubscribe at any time.
                </p>

                <p style="margin-top:35px;">
                  Thank you for being part of our community.
                </p>

                <p style="margin-bottom:0;">
                  Best regards,<br />
                  <strong>BenShop Team</strong>
                </p>

              </td>
            </tr>

            <tr>
              <td align="center" style="background:#f9fafb;padding:24px;font-size:13px;color:#6b7280;">

                © 2026 BenShop. All rights reserved.

                <br /><br />

                You're receiving this email because you subscribed to the BenShop newsletter.

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}

export function createWelcomeAccountTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to BenShop</title>
  </head>

  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#333;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">

            <tr>
              <td align="center" style="background:#111827;padding:40px;">
                <h1 style="margin:0;color:#ffffff;font-size:30px;">
                  Welcome to BenShop
                </h1>

                <p style="margin-top:12px;color:#d1d5db;font-size:16px;">
                  Your account has been created successfully.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:40px;">

                <h2 style="margin-top:0;color:#111827;">
                  Hi ${name},
                </h2>

                <p style="line-height:1.8;color:#555;">
                  Thank you for creating your BenShop account.
                  We're excited to have you join our community.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0"
                  style="margin:30px 0;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
                  <tr>
                    <td style="padding:24px;">

                      <h3 style="margin-top:0;color:#111827;">
                        🎁 Welcome Gift
                      </h3>

                      <p style="margin:10px 0;">
                        A welcome coupon has been added to your account.
                      </p>

                      <p style="margin:10px 0;">
                        Simply visit your cart or checkout page to apply it on your next purchase.
                      </p>

                    </td>
                  </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0"
                  style="margin:30px 0;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
                  <tr>
                    <td style="padding:24px;">

                      <h3 style="margin-top:0;color:#111827;">
                        What you can do next
                      </h3>

                      <p style="margin:8px 0;">✓ Explore our latest collections</p>

                      <p style="margin:8px 0;">✓ Add products to your wishlist</p>

                      <p style="margin:8px 0;">✓ Shop securely with Stripe Checkout</p>

                      <p style="margin:8px 0;">✓ Leave reviews after your purchases</p>

                    </td>
                  </tr>
                </table>

                <div style="text-align:center;margin:40px 0;">

                  <a
                    href="${clientURL}"
                    style="
                      display:inline-block;
                      background:#111827;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 36px;
                      border-radius:6px;
                      font-weight:bold;
                    "
                  >
                    Start Shopping
                  </a>

                </div>

                <p style="line-height:1.8;color:#555;">
                  If you ever need assistance, our team is always here to help.
                </p>

                <p style="margin-top:30px;">
                  Happy Shopping!
                </p>

                <p>
                  Best regards,<br>
                  <strong>BenShop Team</strong>
                </p>

              </td>
            </tr>

            <tr>
              <td align="center"
                style="background:#f9fafb;padding:24px;color:#6b7280;font-size:13px;">

                © 2026 BenShop. All rights reserved.

                <br><br>

                This email confirms your BenShop account registration.

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}
