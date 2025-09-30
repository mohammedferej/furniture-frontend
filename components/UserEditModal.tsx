"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/lib/AuthService";
import { User } from "@/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "./ui/label";

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUpdated?: () => void; // Callback after save
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  open,
  onClose,
  user,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await AuthService.updateUser(user.id, formData);
      toast.success("User updated successfully");
      onClose();
      if (onUpdated) onUpdated(); // Refresh users
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* First Name */}
          <div className="flex items-center gap-4">
            <Label className="w-28">First Name</Label>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
            />
          </div>

          {/* Last Name */}
          <div className="flex items-center gap-4">
            <Label className="w-28">Last Name</Label>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>

          {/* Username */}
          <div className="flex items-center gap-4">
            <Label className="w-28">Username</Label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="brand" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="brand">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
