"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFavoriteUsersByUserId } from "@/db/favoriteUser";
import { FavoriteUser } from "@/lib/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useTransferSol } from "./account-data-access";
import { createTransaction } from "@/db/transaction";

export function ModalSend({
  hide,
  show,
  address,
  userId,
}: {
  hide: () => void;
  show: boolean;
  address: PublicKey;
  userId: string;
}) {
  const wallet = useWallet();
  const mutation = useTransferSol({ address });
  const [amount, setAmount] = useState("1");
  const [recipientType, setRecipientType] = useState<"favorite" | "new">(
    "favorite"
  );
  const [favoriteUsers, setFavoriteUsers] = useState<FavoriteUser[]>([]);
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    async function fetchFavoriteUsers() {
      const users = await getFavoriteUsersByUserId(userId);
      setFavoriteUsers(users);
    }
    fetchFavoriteUsers();
  }, [userId]);

  const handleSubmit = () => {
    if (!amount || !recipient) return;

    const transactionDetails = {
      amount: parseFloat(amount),
      recipientPublicKey:
        recipientType === "favorite"
          ? favoriteUsers.find((user) => user.publicKey === recipient)
              ?.publicKey
          : recipient,
      senderPublicKey: address.toString(),
    };
    mutation
      .mutateAsync({
        destination: new PublicKey(
          transactionDetails.recipientPublicKey ?? recipient
        ),
        amount: parseFloat(amount),
      })
      .then(() => hide());
  };

  return (
    <Dialog open={show} onOpenChange={hide}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Money</DialogTitle>
          <DialogDescription>
            Enter the details to send funds.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <Input
              type="number"
              step="any"
              min="1"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!wallet.sendTransaction}
            />
          </div>

          {/* Recipient Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Recipient Type
            </label>
            <RadioGroup
              value={recipientType}
              onValueChange={(value) =>
                setRecipientType(value as "favorite" | "new")
              }
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="favorite" />
                <span>Favorite User</span>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" />
                <span>New User (Public Key)</span>
              </div>
            </RadioGroup>
          </div>

          {/* Recipient Input */}
          <div>
            {recipientType === "favorite" ? (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Favorite User
                </label>
                <Select onValueChange={setRecipient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {favoriteUsers.map((user) => (
                      <SelectItem key={user.publicKey} value={user.publicKey}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Public Key
                </label>
                <Input
                  type="text"
                  placeholder="Enter recipient's public key"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={hide}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!amount || !recipient}
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
