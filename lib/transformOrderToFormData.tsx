export function transformOrderToFormData(orderData: any) {
  const material = orderData.mejlis_materials?.[0] || {}
  
  // Build segments object for your RoomDetails step
  const segmentsObj: Record<string, number[]> = {}
  if (material.segments && Array.isArray(material.segments)) {
    material.segments.forEach((seg: any) => {
      segmentsObj[seg.side_name] = seg.values
    })
  }

  // Calculate sides array from segments
  const sidesArray = Object.values(segmentsObj).map((vals) =>
    vals.reduce((sum, v) => sum + v, 0)
  )

  return {
    // Customer fields
    customerName: orderData.customer?.name || "",
    phone: orderData.customer?.phone || "",
    address: orderData.customer?.address || "",

    // Order details
    order_code: orderData.order_code || "",
    receive_order_at: orderData.receive_order_at || "",
    completed_order_at: orderData.completed_order_at || "",

    // Material details
    material_type: material.material_type || "Mejlis",
    material_made_from: material.material_made_from || "",
    design_type: material.design_type || "",
    no_of_mekeda: Number(material.no_of_mekeda) || 0,
    no_of_pillow: Number(material.no_of_pillow) || 0,
    uplift_or_height: Number(material.uplift_or_height) || 0,
    room_size: Number(material.room_size) || 0,
    room_shape: material.room_shape || "L",
    price_per_meter: Number(material.price_per_meter) || 0,
    has_table: Boolean(material.has_table),

    // Payment details
    total_price: Number(orderData.total_price) || 0,
    app_front: Number(orderData.app_front) || 0,
    remaining_payment: Number(orderData.remaining_payment) || 0,

    // Extra for editing form
    segments: segmentsObj,
    sides: sidesArray,
  }
}
