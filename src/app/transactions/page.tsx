import { currentUser } from "@clerk/nextjs/server";

const page = async () => {
  const user = await currentUser();
  if (!user) throw new Error("User not found");
  console.log(user);
  return <div>page</div>;
};

export default page;
