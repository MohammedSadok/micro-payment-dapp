"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { FavoriteUser, Transaction } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1).max(100),
  recipientType: z.enum(["favorite", "new"]),
  recipient: z.string().min(1),
});

interface NewTransactionFormProps {
  userId: string;
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
}

export function NewTransactionForm({
  userId,
  onSubmit,
  onCancel,
}: NewTransactionFormProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [favoriteUsers, setFavoriteUsers] = useState<FavoriteUser[]>([]);
  const { publicKey } = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: "",
      recipientType: "favorite",
      recipient: "",
    },
  });

  useEffect(() => {
    async function fetchFavoriteUsers() {
      const users = await getFavoriteUsersByUserId(userId);
      setFavoriteUsers(users);
    }
    fetchFavoriteUsers();
  }, [userId]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (publicKey == null) throw new Error("public key not found");
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: values.amount + "",
      createdAt: new Date(),
      description: values.description,
      fromPublicKey: publicKey.toString(),
      toPublicKey: values.recipient,
    };
    onSubmit(newTransaction);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction to send funds.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>Enter the amount to send.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a description for this transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipientType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="favorite" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Favorite Account
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="new" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          New Account
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient</FormLabel>
                  <FormControl>
                    {form.watch("recipientType") === "favorite" ? (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a favorite user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {favoriteUsers.map((user) => (
                            <SelectItem
                              key={user.userId}
                              value={user.publicKey}
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        {...field}
                        placeholder="Enter recipient's public key"
                      />
                    )}
                  </FormControl>
                  <FormDescription>
                    {form.watch("recipientType") === "favorite"
                      ? "Select a favorite user to send to."
                      : "Enter the public key of the recipient."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
