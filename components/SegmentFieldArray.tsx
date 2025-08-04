// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import type { FormValues } from "@/lib/schema";
// import {
//   Controller,
//   useFieldArray,
//   type Control,
//   type FieldArrayWithId,
// } from "react-hook-form";

// type SegmentFieldArrayProps = {
//   control: Control<FormValues>;
//   sideIndex: number;
//   sideLength: number; // Expected total length for this side
// };

// // This gives you proper typing for useFieldArray "fields"
// type Segment = FieldArrayWithId<FormValues, `sides.${number}.segments`, "id">;

// export default function SegmentFieldArray({
//   control,
//   sideIndex,
//   sideLength,
// }: SegmentFieldArrayProps) {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: `sides.${sideIndex}.segments` as const,
//   });

//   // Safely cast fields to include length
//   const typedFields = fields as Segment[];

//   // Calculate the total length of all segments
//   const sumOfSegments = typedFields.reduce((acc, segment) => {
//     return acc + (segment.length ?? 0);
//   }, 0);

//   // Disable "Add Segment" if sum >= sideLength
//   const canAddMore = sumOfSegments < sideLength;

//   return (
//     <div className="mt-3">
//       <Label>{`Segments (must sum to ${sideLength}m)`}</Label>
//       {typedFields.map((field, idx) => (
//         <div key={field.id} className="flex gap-2 items-center my-1">
//           <Controller
//             control={control}
//             name={`sides.${sideIndex}.segments.${idx}.length` as const}
//             rules={{
//               required: "Segment length required",
//               min: { value: 1, message: "Min segment length is 1m" },
//               max: { value: 3, message: "Max segment length is 3m" },
//             }}
//             render={({ field, fieldState }) => (
//               <>
//                 <Input
//                   type="number"
//                   step={0.1}
//                   min={1}
//                   max={3}
//                   {...field}
//                   className="w-32"
//                   placeholder={`Segment ${idx + 1}`}
//                 />
//                 {fieldState.error && (
//                   <p className="text-red-600 text-xs ml-2">
//                     {fieldState.error.message}
//                   </p>
//                 )}
//               </>
//             )}
//           />
//           <Button
//             type="button"
//             variant="destructive"
//             onClick={() => remove(idx)}
//           >
//             Remove
//           </Button>
//         </div>
//       ))}
//       <Button
//         type="button"
//         onClick={() => append({ length: 1 })}
//         className="mt-2"
//         disabled={!canAddMore}
//       >
//         + Add Segment
//       </Button>
//       <p className="mt-1 text-sm text-gray-600">
//         Total: {sumOfSegments}m / {sideLength}m
//       </p>
//     </div>
//   );
// }
