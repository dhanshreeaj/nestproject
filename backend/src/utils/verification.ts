import { getPostmarkClient } from './postmark';

export async function sendVerificationEmail(email: string, code: string) {
  const client = getPostmarkClient();
  await client.sendEmail({
    From: 'support@stalliongrooming.com',
    To: email,
    Subject: 'Verify your email',
    TextBody: `Your verification code is: ${code}`,
  });
}
