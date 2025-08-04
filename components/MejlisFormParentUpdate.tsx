'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import {formSchema}  from '@/lib/formSchema' // extract your schema into its own file
import { updateRoomData } from '@/lib/mejlis.service'
import { MultiStepFormWrapper } from './MultiStepFormWrapper'
import { CustomerDetailsForm } from './CustomerDetailsForm'
import { MaterialDetailsForm } from './MaterialDetailsForm'
import { RoomDetailsForm } from './RoomDetailsForm'
import RoomVisualizer from './RoomVisualizer'
import styles from '../style/mejlis-form.module.css'
import { useRouter } from 'next/navigation'

type FormValues = any

export default function MejlisFormParentUpdate({
  initialData,
  orderId,
}: {
  initialData: FormValues
  orderId: string
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sides, setSides] = useState<number[]>([])
  const [segments, setSegments] = useState<Record<string, number[]>>({})
  const svgExportRef = useRef<SVGSVGElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: initialData,
    mode: 'onChange',
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
      if (initialData.segments) setSegments(initialData.segments)
      if (initialData.sides) setSides(initialData.sides)
    }
  }, [initialData, form])

  const updateSides = useCallback((s: number[]) => setSides(s), [])
  const updateSegments = useCallback(
    (seg: Record<string, number[]>) => setSegments(seg),
    []
  )

  const segmentsAreValid = () =>
    Object.entries(segments).every(([_, segs], i) =>
      segs.reduce((a, b) => a + b, 0) === sides[i]
    )

  const canSubmitForm = () =>
    form.formState.isValid && segmentsAreValid()

  const onSubmit = async (data: FormValues) => {
    console.log("data to send :",data)
    setIsSubmitting(true)
    try {
      await updateRoomData(orderId, {
        ...data,
        segments,
      })
      toast.success('Order updated successfully')
      router.push('/orders')
    } catch (err) {
      toast.error('Failed to update order', {
        description: err instanceof Error ? err.message : 'Unknown error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    {
      label: 'Customer Detailsupdate',
      content: <CustomerDetailsForm register={form.register} errors={form.formState.errors} />,
    },
    {
      label: 'Material ',
      content: (
        <MaterialDetailsForm
          register={form.register}
          setValue={form.setValue}
          watch={form.watch}
          errors={form.formState.errors}
        />
      ),
    },
    {
      label: 'Room Details',
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
    },
    {
      label: 'Review',
      content: (
        <div>
          <RoomVisualizer
            room_shape={form.watch('room_shape')}
            segments={segments}
          />
        </div>
      ),
    },
  ]

  return (
   
  <div className={styles.mejlisFormContainer}>
    <MultiStepFormWrapper
      steps={steps}
      canSubmit={canSubmitForm}
      isSubmitting={isSubmitting}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  </div>


  )
}
