"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFavoriteUser, deleteFavoriteUser } from "@/db/favoriteUser";
import { useState } from "react";
import { FavoriteUsersTable } from "./FavoriteUserTable";
import { AddFavoriteUserForm } from "./form/FavoriteUserForm";

interface FavoriteUser {
  id: string;
  name: string;
  publicKey: string;
  totalSent: number;
  totalReceived: number;
}

interface FavoriteUsersCardProps {
  initialFavoriteUsers: FavoriteUser[];
  userId: string;
}

export default function FavoriteUsersCard({
  initialFavoriteUsers = [],
  userId,
}: FavoriteUsersCardProps) {
  const [favoriteUsers, setFavoriteUsers] =
    useState<FavoriteUser[]>(initialFavoriteUsers);

  const handleAddFavoriteUser = async (newUser: {
    name: string;
    publicKey: string;
  }) => {
    const user = await createFavoriteUser({
      ...newUser,
      userId,
    });

    const createdUser: FavoriteUser = {
      ...user,
      totalSent: 0,
      totalReceived: 0,
    };
    setFavoriteUsers([...favoriteUsers, createdUser]);
  };

  const handleDeleteUser = (id: string) => {
    deleteFavoriteUser(id);
    setFavoriteUsers(favoriteUsers.filter((user) => user.id !== id));
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Favorite Users</CardTitle>
        <AddFavoriteUserForm onAddUser={handleAddFavoriteUser} />
      </CardHeader>
      <CardContent>
        <FavoriteUsersTable
          favoriteUsers={favoriteUsers}
          onDeleteUser={handleDeleteUser}
        />
      </CardContent>
    </Card>
  );
}
