import { redirect } from "next/navigation";

export default async function AdminIndex() {
  redirect("/admin/moderation/f0");
}
