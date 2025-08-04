"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Textarea } from "./ui/textarea";

interface CustomerDetailsProps {
  register: UseFormRegister<any>;
    errors: FieldErrors<any>;
}

export function CustomerDetailsForm({ register }: CustomerDetailsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name</Label>
        <Input 
          id="customerName" 
          {...register("customerName")} 
          placeholder="Enter full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          {...register("phone")} 
          placeholder="+965 123 4567"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Textarea 
          id="address" 
          {...register("address")} 
          placeholder="Enter complete address"
        />
      </div>
    </div>
  );
}