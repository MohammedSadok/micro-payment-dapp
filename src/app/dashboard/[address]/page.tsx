import AccountDetailFeature from "@/app/dashboard/account-detail-feature";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  return <AccountDetailFeature userId={userId} />;
}
