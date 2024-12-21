import FavoriteUsersCard from "@/components/FavoriteUsersCard";
import { getFavoriteUsersWithTotals } from "@/db/favoriteUser";
import { auth } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const favoriteUsers = await getFavoriteUsersWithTotals(userId);
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-8">Profile</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* <UserInfoCard
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          handleUpdateUserInfo={handleUpdateUserInfo}
        /> */}
      </div>

      <FavoriteUsersCard initialFavoriteUsers={favoriteUsers} userId={userId} />
    </div>
  );
}
