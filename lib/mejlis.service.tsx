
"use server"

import { table } from "console";
import { CgLaptop } from "react-icons/cg";
import { transformFormDataToOrderUpdate } from "./transformFormDataToOrderUpdate";

export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
const baseUrl="http://localhost:8000/";
export interface RoomPayload {
  customerName: string;
  phone: string;
  address: string;
  order_code: string;
  receive_order_at: string;
  completed_order_at?: string;
  material_type?: string;
  material_made_from:string;
  design_type: string;
  no_of_mekeda: number;
  no_of_pillow: number;
  price_per_meter: number;
  app_front:number,
  remaining_payment: number;
  room_shape: string;
  room_size: number;
  has_table:boolean;
   segments: Record<string, number[]>;
  total_price: number;
  uplift_or_height: number;
}


export async function submitRoomData(payload: RoomPayload) {
  console.log("payload :"+ payload.remaining_payment)
  const customerDetails = {
    name: payload.customerName,
    phone: payload.phone,
    address: payload.address,
  };

  const orderData = {
    order_code: payload.order_code,
    receive_order_at: payload.receive_order_at, // Already in ISO format
    completed_order_at: payload.completed_order_at || null, // Handle optional
    total_price: payload.total_price,
    remaining_payment: payload.remaining_payment,
     app_front: payload.app_front ?? "",
    material_type: "mejlis",
    material_details: {
      material_made_from: payload.material_made_from,
      design_type: payload.design_type,
      no_of_mekeda: payload.no_of_mekeda,
      no_of_pillow: payload.no_of_pillow,
      uplift_or_height: payload.uplift_or_height,
      room_size: payload.room_size,
      room_shape: payload.room_shape,
      price_per_meter: payload.price_per_meter,
     
      has_table:payload.has_table,
      segments: payload.segments,
    },
  };

  try {
    const res = await fetch(`${baseUrl}api/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: customerDetails,
        order: orderData,
      }),
    });

    // Check for HTML response (error)
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("text/html") !== -1) {
      const text = await res.text();
      throw new Error(`Server returned HTML error: ${text.substring(0, 100)}...`);
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "Failed to submit room data");
    }

    return data;
  } catch (err) {
    console.error("❌ submitRoomData error:", err);
    throw err;
  }
}


// export async function updateRoomData(id: string, data: any) {
//   const response = await fetch(`http://localhost:8000/api/orders/${id}/`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       customer: {
//         name: data.customerName,
//         phone: data.phone,
//         address: data.address
//       },
//       order_code: data.order_code,
//       receive_order_at: data.receive_order_at,
//       completed_order_at: data.completed_order_at,
//       total_price: data.total_price,
//       remaining_payment: data.remaining_payment,
//       app_front: data.app_front,
//       material_details: {
//         material_type: data.material_type,
//         material_made_from: data.material_made_from,
//         design_type: data.design_type,
//         no_of_mekeda: data.no_of_mekeda,
//         no_of_pillow: data.no_of_pillow,
//         uplift_or_height: data.uplift_or_height,
//         room_size: data.room_size,
//         room_shape: data.room_shape,
//         price_per_meter: data.price_per_meter,
//         table: data.table,
//         segments: data.segments
//       }
//     }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Failed to update order');
//   }

//   return response.json();
// }

// lib/mejlis.service.ts
export async function fetchOrders() {
  const response = await fetch('http://localhost:8000/api/orders/')
  if (!response.ok) {
    throw new Error('Failed to fetch orders')
  }
  return response.json()
}

export async function fetchOrderDetails(id: string) {
  const response = await fetch(`http://localhost:8000/api/orders/${id}/`)
  if (!response.ok) {
    throw new Error('Failed to fetch order details')
  }
  return response.json()
}

export async function getRoomOrderById(id: string) {
  const res = await fetch(`/api/mejlis/${id}`);
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

export async function updateRoomData(id: string, formData: any) {
  // 🔹 Transform flat form data → Django nested format
  const payload = transformFormDataToOrderUpdate(formData)
console.log("Updating Order ID:", id);
console.log("formData :",formData)
console.log("Payload:", payload);

  const response = await fetch(`${baseUrl}api/orders/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let errorMessage = 'Failed to update order'
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    } catch {}
    throw new Error(errorMessage)
  }

  return response.json()
}
