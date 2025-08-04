"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MaterialDetailsProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
}

const material_typeS = ["Standard", "Premium", "Luxury", "Custom"];
const DESIGN_TYPES = ["Traditional", "Modern", "Contemporary", "Mixed"];

export function MaterialDetailsForm({ register, setValue, watch, errors }: MaterialDetailsProps) {
  const [completedDate, setCompletedDate] = React.useState<Date | undefined>(undefined);
  const [receivedDate, setReceivedDate] = React.useState<Date | undefined>(undefined);

  // Calculate total price automatically
  useEffect(() => {
    const price = watch("price_per_meter");
    const size = watch("room_size");
    if (price && size) {
      setValue("total_price", price * size);
    }
  }, [watch("price_per_meter"), watch("room_size"), setValue]);

  // Calculate remaining payment automatically
  useEffect(() => {
    const total = watch("total_price");
    const advance = watch("advance_payment");
    if (total !== undefined && advance !== undefined) {
      setValue("remaining_payment", Math.max(0, total - advance));
    }
  }, [watch("total_price"), watch("advance_payment"), setValue]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    const numValue = value === "" ? 0 : Number(value);
    setValue(field, isNaN(numValue) ? 0 : numValue);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Column 1 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="order_code">Order Code</Label>
          <Input 
            id="order_code" 
            {...register("order_code", { required: "Order code is required" })} 
            placeholder="ORD-1234" 
          />
          {errors.order_code && (
            <p className="text-sm text-red-500">{errors.order_code.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
  <Label htmlFor="material_made_from" className="text-sm font-medium text-gray-700">
    Mejlis Material Type
  </Label>
  <Select
    value={watch("material_made_from")}
    onValueChange={(value) => setValue("material_made_from", value)}
  >
    <SelectTrigger
      className={cn(
        "w-full h-10 px-3 py-2",
        "bg-white border rounded-md shadow-sm",
        "text-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50",
        errors.material_made_from
          ? "border-red-300 text-red-900 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      )}
    >
      <SelectValue placeholder="Select mejlis type" />
    </SelectTrigger>
    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg mt-1">
      {material_typeS.map((type) => (
        <SelectItem
          key={type}
          value={type}
          className="text-sm hover:bg-gray-50 focus:bg-gray-300"
        >
          {type}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {errors.material_type&& (
    <p className="text-sm text-red-600 mt-1">{errors.material_type.message as string}</p>
  )}
</div>
        <div className="space-y-2">
          <Label htmlFor="design_type" className="text-sm font-medium text-gray-700">Design Type</Label>
          <Select
            onValueChange={(value) => setValue("design_type", value)}
            value={watch("design_type")}
          >
            <SelectTrigger
             className={cn(
        "w-full h-10 px-3 py-2",
        "bg-white border rounded-md shadow-sm",
        "text-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50",
        errors.material_type
          ? "border-red-300 text-red-900 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      )}
            >
              <SelectValue placeholder="Select design type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg mt-1">
              {DESIGN_TYPES.map((type) => (
                <SelectItem key={type} value={type} 
                
          className="text-sm hover:bg-gray-50 focus:bg-gray-300"
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           {errors.material_type&& (
    <p className="text-sm text-red-600 mt-1">{errors.material_type.message as string}</p>
  )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="no_of_mekeda">Number of Mekeda</Label>
          <Input 
            id="no_of_mekeda" 
            type="number" 
            {...register("no_of_mekeda", { 
              valueAsNumber: true,
              min: { value: 0, message: "Must be positive" }
            })} 
            placeholder="0"
          />
          {errors.no_of_mekeda && (
            <p className="text-sm text-red-500">{errors.no_of_mekeda.message as string}</p>
          )}
        </div>

       
      </div>

      {/* Column 2 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="uplift_or_height">Uplift/Height</Label>
          <Input 
            id="uplift_or_height" 
            type="number"
            {...register("uplift_or_height", {
              valueAsNumber: true,
              min: { value: 0.1, message: "Must be positive" }
            })}
            onChange={(e) => handleNumberChange(e, "uplift_or_height")}
            placeholder="e.g., 10cm"
          />
          {errors.uplift_or_height && (
            <p className="text-sm text-red-500">{errors.uplift_or_height.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price_per_meter">Price per Meter</Label>
          <Input 
            type="number" 
            id="price_per_meter" 
            {...register("price_per_meter", {
              valueAsNumber: true,
              min: { value: 0.1, message: "Must be positive" }
            })}
            onChange={(e) => handleNumberChange(e, "price_per_meter")}
            placeholder="enter amount  birr"
          />
          {errors.price_per_meter && (
            <p className="text-sm text-red-500">{errors.price_per_meter.message as string}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="app_front">App front (qebd)</Label>
          <Input 
            type="number" 
            id="price_per_meter" 
            {...register("app_front", {
              valueAsNumber: true,
              min: { value: 0.1, message: "Must be positive" }
            })}
            onChange={(e) => handleNumberChange(e, "app_front")}
            placeholder="enter amount  birr"
          />
          {errors.app_front && (
            <p className="text-sm text-red-500">{errors.app_front.message as string}</p>
          )}
        </div>
         <div className="space-y-2">
          <Label htmlFor="no_of_pillow">Number of Pillows</Label>
          <Input 
            id="no_of_pillow" 
            type="number" 
            {...register("no_of_pillow", { 
              valueAsNumber: true,
              min: { value: 0, message: "Must be positive" }
            })} 
            placeholder="0"
          />
          {errors.no_of_pillow && (
            <p className="text-sm text-red-500">{errors.no_of_pillow.message as string}</p>
          )}
        </div>

      </div>

   {/* Full width date pickers */}
<div className="md:col-span-2 grid gap-6 md:grid-cols-2">
  {/* Order Received Date */}
  <div className="space-y-2">
    <Label>Order Received Date</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !watch("receive_order_at") && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {watch("receive_order_at") ? (
            new Date(watch("receive_order_at")).toLocaleDateString()
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={watch("receive_order_at") ? new Date(watch("receive_order_at")) : undefined}
          onSelect={(date) => {
            setValue("receive_order_at", date?.toISOString() ?? "", {
              shouldValidate: true
            });
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    {errors.receive_order_at && (
      <p className="text-sm text-red-500">{errors.receive_order_at.message as string}</p>
    )}
  </div>

  {/* Order Completed Date */}
  <div className="space-y-2">
    <Label>Order Completion Date</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !watch("completed_order_at") && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {watch("completed_order_at") ? (
            new Date(watch("completed_order_at")).toLocaleDateString()
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={watch("completed_order_at") ? new Date(watch("completed_order_at")) : undefined}
          onSelect={(date) => {
            setValue("completed_order_at", date?.toISOString() ?? "", {
              shouldValidate: true
            });
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    {errors.completed_order_at && (
      <p className="text-sm text-red-500">{errors.completed_order_at.message as string}</p>
    )}
  </div>
 <div className="space-y-2 pt-6">
          <Label>Includes Table?</Label>
          <RadioGroup
            value={watch("table") ? "true" : "false"}
            onValueChange={(val) => setValue("table", val === "true")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="has-table" />
              <Label htmlFor="has-table">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="has-no-table" />
              <Label htmlFor="has-no-table">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}