import { ServerClient } from "postmark";

export function getPostmarkClient() {
  const token = process.env.POSTMARK_API_TOKEN;
  if (!token) {
    throw new Error("POSTMARK_API_TOKEN is missing in .env");
  }
  return new ServerClient(token);
}
