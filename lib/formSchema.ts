import { z } from "zod";

export const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  order_code: z.string().min(1, "Order code is required"),
  receive_order_at: z.string().min(1, "Receive date is required"),
  completed_order_at: z.string().optional(),
  material_type: z.string().optional(),
  design_type: z.string().min(1, "Design type is required"),
  no_of_mekeda: z.number().min(1, "At least 1 mekeda required"),
  no_of_pillow: z.number().min(0, "Cannot be negative"),
  room_size: z.number().min(1, "Room size must be positive"),
  room_shape: z.enum(["L", "U", "Straight"]),
  has_table: z.boolean(),
  material_made_from: z.string().min(1, "Mejlis material type is required"),
  app_front: z.coerce.number().min(0, "Cannot be negative"),
  uplift_or_height: z.coerce.number().min(0.1, "Height must be positive"),
  price_per_meter: z.coerce.number().min(0.1, "Price must be positive"),
  total_price: z.coerce.number().min(0.1, "Total price must be positive"),
  remaining_payment: z.coerce.number().min(0, "Cannot be negative"),
});
