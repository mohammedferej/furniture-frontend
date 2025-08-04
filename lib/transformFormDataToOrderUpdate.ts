export function transformFormDataToOrderUpdate(formData: any) {
  // Build segments array from your { side_name: [values] } object
  const segmentsArray = Object.entries(formData.segments || {}).map(
    ([side_name, values]) => ({
      side_name,
      values,
    })
  )

  return {
    order_code: formData.order_code,
    receive_order_at: formData.receive_order_at,
    completed_order_at: formData.completed_order_at || null,
    total_price: formData.total_price,
    app_front: formData.app_front,
    remaining_payment: formData.remaining_payment,

    customer: {
      name: formData.customerName,
      phone: formData.phone,
      address: formData.address,
    },

    mejlis_materials: [
      {
        material_type: formData.material_type,
        material_made_from: formData.material_made_from,
        design_type: formData.design_type,
        no_of_mekeda: formData.no_of_mekeda,
        no_of_pillow: formData.no_of_pillow,
        uplift_or_height: formData.uplift_or_height,
        room_size: formData.room_size,
        room_shape: formData.room_shape,
        price_per_meter: formData.price_per_meter,
        has_table: formData.table,
        segments: segmentsArray,
      },
    ],
  }
}
