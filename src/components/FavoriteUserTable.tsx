import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface FavoriteUser {
  id: string;
  name: string;
  publicKey: string;
  totalSent: number;
  totalReceived: number;
}

interface FavoriteUsersTableProps {
  favoriteUsers: FavoriteUser[];
  onDeleteUser: (id: string) => void;
}

export function FavoriteUsersTable({
  onDeleteUser,
  favoriteUsers,
}: FavoriteUsersTableProps) {
  if (!favoriteUsers || favoriteUsers.length === 0) {
    return <p>No favorite users found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Public Key</TableHead>
          <TableHead>Total Sent</TableHead>
          <TableHead>Total Received</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {favoriteUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.publicKey}</TableCell>
            <TableCell>${user.totalSent}</TableCell>
            <TableCell>${user.totalReceived}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDeleteUser(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
