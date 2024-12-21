"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { AddFavoriteUserForm } from "./form/FavoriteUserForm";
import { FavoriteUsersTable } from "./FavoriteUserTable";

interface FavoriteUser {
  id: string;
  name: string;
  publicKey: string;
  totalSent: number;
  totalReceived: number;
}

interface FavoriteUsersCardProps {
  initialFavoriteUsers: FavoriteUser[];
}

export default function FavoriteUsersCard({
  initialFavoriteUsers,
}: FavoriteUsersCardProps) {
  const [favoriteUsers, setFavoriteUsers] =
    useState<FavoriteUser[]>(initialFavoriteUsers);

  const handleAddFavoriteUser = (newUser: {
    name: string;
    publicKey: string;
  }) => {
    const user: FavoriteUser = {
      id: Date.now().toString(), // This is a simple way to generate a unique ID. In a real app, you'd use a more robust method.
      name: newUser.name,
      publicKey: newUser.publicKey,
      totalSent: 0,
      totalReceived: 0,
    };
    setFavoriteUsers([...favoriteUsers, user]);
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Favorite Users</CardTitle>
        <AddFavoriteUserForm onAddUser={handleAddFavoriteUser} />
      </CardHeader>
      <CardContent>
        <FavoriteUsersTable favoriteUsers={favoriteUsers} />
      </CardContent>
    </Card>
  );
}
