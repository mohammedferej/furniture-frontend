
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from '../style/mejlis-form.module.css';
import router, { useRouter } from 'next/navigation'
import { CustomerDetailsForm } from "./CustomerDetailsForm";
import { MaterialDetailsForm } from "./MaterialDetailsForm";
import { RoomDetailsForm } from "./RoomDetailsForm";
import { MultiStepFormWrapper } from "./MultiStepFormWrapper";
import RoomVisualizer from "./RoomVisualizer";
import { getRoomOrderById, submitRoomData, updateRoomData } from "@/lib/mejlis.service";
import { toast } from "sonner";

import {formSchema} from '@/lib/formSchema'

type FormValues = z.infer<typeof formSchema>;

type FormStep = {
  label: string;
  content: React.ReactNode;
  canProceed?: () => boolean | string;
};
// components/MejlisFormParent.tsx
interface MejlisFormParentProps {
  initialData?: FormValues
  orderId?: string
}

export default function MejlisFormParent({ initialData, orderId }: MejlisFormParentProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sides, setSides] = useState<number[]>([]);
  const [segments, setSegments] = useState<Record<string, number[]>>({});
  const svgExportRef = useRef<SVGSVGElement>(null);
const router=useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      order_code: "",
      receive_order_at: "",
      completed_order_at: "",
      material_type: "Mejlis",
      design_type: "",
      no_of_mekeda: 0,
      no_of_pillow: 0,
      uplift_or_height: 0,
      room_size: 12,
      room_shape: "L",
      price_per_meter: 0,
      total_price: 0,
      app_front: 0,
      has_table: false,
      remaining_payment: 0,
      material_made_from:"",
      
    },
  });

  const updateSides = useCallback((s: number[]) => setSides(s), []);
  const updateSegments = useCallback(
    (seg: Record<string, number[]>) => setSegments(seg),
    [],
  );



  const canSubmitForm = () => {
  const isFormValid = form.formState.isValid;
  const areSegmentsValid = segmentsAreValid();
  
  console.log('Validation Details:', {
    isFormValid,
    areSegmentsValid,
    invalidFields: Object.entries(form.formState.errors)
      .filter(([_, error]) => error)
      .map(([name]) => name),
    formValues: form.getValues()
  });

  return isFormValid && areSegmentsValid;
};

  // Enhanced submit handler
const onSubmit = async (data: FormValues) => {
  // Convert string numbers to actual numbers
  const processedData = {
    ...data,
    uplift_or_height: Number(data.uplift_or_height),
    price_per_meter: Number(data.price_per_meter),
    total_price: Number(data.price_per_meter * data.room_size),
    app_front: Number(data.app_front),
    remaining_payment: Number((data.price_per_meter * data.room_size )- data.app_front),
   // advance_payment: Number(data.advance_payment || 0)
  };

  if (!segmentsAreValid()) {
    toast.warning("Invalid Room Configuration", {
      description: "Please check your room segments configuration",
    });
    return;
  }

  setIsSubmitting(true);
   try {
      if (orderId) {
  try {
    await updateRoomData(orderId, {
      ...processedData,
      segments,
    });

    toast.success("Order Updated Successfully!", {
      description: `Order ${processedData.order_code} has been updated`,
    });

    router.push("/order-mejlis");
  } catch (err: any) {
    toast.error("Failed to update order", {
      description: err.message || "Please try again later",
    });
  }
}
 else {

    const result = await submitRoomData({
      ...processedData,
      segments,
    });
    
    toast.success("Order Submitted Successfully!", {
      description: `Order ${processedData.order_code} has been created`,
     
    });
      window.location.href = '/orders';
  }
    // Optional: reset form after successful submission
    // form.reset();
    
  } catch (error: any) {
    let errorMessage = "Failed to submit order";
    let description = "Please try again later";
    
    if (error.message.includes("UNIQUE constraint failed: order_order.order_code")) {
      errorMessage = "Duplicate Order Code";
      description = "This order code already exists. Please use a unique code.";
    } 
    else if (error.message.includes("MejlisMaterial() got unexpected keyword arguments: 'table'")) {
      errorMessage = "Server Configuration Error";
      description = "The table field is not properly configured on the server";
    }
    else if (error.message.includes("Unexpected token '<'")) {
      errorMessage = "Server Error";
      description = "The server returned an unexpected response";
    }
    else if (error.message) {
      description = error.message;
    }

    toast.error(errorMessage, {
      description,
      action: {
        label: "Retry",
        onClick: () => onSubmit(data),
      },
    });
  } finally {
    setIsSubmitting(false);
  }
};
  const segmentsAreValid = () =>
    Object.entries(segments).every(([_, segs], i) =>
      segs.reduce((a, b) => a + b, 0) === sides[i],
    );



  const steps: FormStep[] = [
    {
      label: "Customer Details",
      content: <CustomerDetailsForm register={form.register} errors={form.formState.errors} />,
      canProceed: () => {
        const { customerName, phone, address } = form.formState.errors;
        return !customerName && !phone && !address || "Please fill in all required fields";
      },
    },
    {
      label: "Material Details",
      content: (
        <MaterialDetailsForm
          register={form.register}
          setValue={form.setValue}
          watch={form.watch}
          errors={form.formState.errors}
        />
      ),
      canProceed: () => {
        const { material_made_from, design_type } = form.formState.errors;
        return !material_made_from&& !design_type || "Please select material details";
      },
    },
    {
      label: "Room Details",
      content: (
        <RoomDetailsForm
          watch={form.watch}
          setValue={form.setValue}
          segments={segments}
          updateSegments={updateSegments}
          sides={sides}
          updateSides={updateSides}
          errors={form.formState.errors}
        />
      ),
      canProceed: () => segmentsAreValid() || "Invalid room segments configuration",
    },
    {
      label: "Review",
      content: (
        <div className={styles.mejlisReviewSection}>
          <div className={styles.mejlisReviewGrid}>
            <div>
              <h3 className={styles.mejlisReviewTitle}>Room Segments</h3>
              <div className={styles.mejlisReviewData}>
                <pre className={styles.mejlisReviewPre}>
                  {JSON.stringify(segments, null, 2)}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className={styles.mejlisReviewTitle}>Sides Configuration</h3>
              <div className={styles.mejlisReviewData}>
                <pre className={styles.mejlisReviewPre}>
                  {JSON.stringify(sides, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className={styles.mejlisReviewTitle}>Room Visualization</h3>
            <div className={styles.mejlisVisualizerContainer}>
              <RoomVisualizer
                room_shape={form.watch("room_shape")}
                segments={segments}
              />
            </div>
          </div>

          <div>
            <h3 className={styles.mejlisReviewTitle}>Order Summary</h3>
            <div className={styles.mejlisReviewData}>
              <pre className={styles.mejlisReviewPre}>
                {JSON.stringify({
                  customer: {
                    name: form.watch("customerName"),
                    phone: form.watch("phone"),
                    address: form.watch("address")
                  },
                  order: {
                    code: form.watch("order_code"),
                    type: form.watch("material_made_from"),
                    design: form.watch("design_type"),
                    received: form.watch("receive_order_at"),
                    completed: form.watch("completed_order_at")
                  },
                  dimensions: {
                    size: form.watch("room_size"),
                    shape: form.watch("room_shape")
                  },
                  payment: {
                    total: form.watch("total_price"),
                    //advance: form.watch("advance_payment"),
                    remaining: form.watch("remaining_payment")
                  }
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      ),
    }
  ];
  // Temporary debug component - remove after fixing
const DebugInfo = () => (
  <div style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    background: 'white',
    padding: '10px',
    zIndex: 9999,
    maxHeight: '200px',
    overflow: 'auto'
  }}>
    <h4>Form Debug:</h4>
    <pre>{JSON.stringify({
      values: form.watch(),
      errors: form.formState.errors,
      isValid: form.formState.isValid,
      segmentsValid: segmentsAreValid(),
      canSubmit: canSubmitForm()
    }, null, 2)}</pre>
  </div>
);
 return (
    <div className={styles.mejlisFormContainer}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <MultiStepFormWrapper
          steps={steps}
          canSubmit={canSubmitForm}
          onSubmit={form.handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
        />
      </form>
      <DebugInfo />
    </div>
  );
}