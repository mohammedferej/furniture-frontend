// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";

// const formSchema = z.object({
//   customerName: z.string().min(1),
//   phone: z.string(),
//   address: z.string(),
//   material_type: z.string(),
//   design_type: z.string(),
//   no_of_mekeda: z.number(),
//   no_of_pillow: z.number(),
//   only_mejlis: z.boolean().optional(),
//   complate_mejlis: z.boolean().optional(),
//   table: z.boolean().optional(),
//   uplift_or_height: z.string(),
//   room_size: z.number(),
//   room_shape: z.enum(["L", "U", "Straight"]),
// });

// export default function MejlisForm() {
//   const [sides, setSides] = useState<number[]>([]);
//   const [segments, setSegments] = useState<Record<string, number[]>>({});

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       customerName: "",
//       phone: "",
//       address: "",
//       material_type: "",
//       design_type: "",
//       no_of_mekeda: 0,
//       no_of_pillow: 0,
//       uplift_or_height: "",
//       room_size: 12,
//       room_shape: "L",
//     },
//   });

//   const room_shape = form.watch("room_shape");
//   const room_size = form.watch("room_size");

//   useEffect(() => {
//     let cornerDeduction = 0;
//     let numberOfSides = 1;

//     switch (room_shape) {
//       case "L":
//         cornerDeduction = 2; // 1 corner * 2m
//         numberOfSides = 2;
//         break;
//       case "U":
//         cornerDeduction = 4; // 2 corners * 2m
//         numberOfSides = 3;
//         break;
//       case "Straight":
//         cornerDeduction = 0;
//         numberOfSides = 1;
//         break;
//     }

//     const room_size_without_corner = room_size - cornerDeduction;

//     const segmentLengths: number[] = [];
//     for (let i = 0; i < numberOfSides; i++) {
//       const base = Math.floor(room_size_without_corner / numberOfSides);
//       segmentLengths.push(base);
//     }
//     const remainder = room_size_without_corner % numberOfSides;
//     for (let i = 0; i < remainder; i++) {
//       segmentLengths[i] += 1;
//     }
//     setSides(segmentLengths);

//     const newSegments: Record<string, number[]> = {};
//     segmentLengths.forEach((side, i) => {
//       newSegments[`side${i + 1}`] = [Math.floor(side / 2), side - Math.floor(side / 2)];
//     });
//     setSegments(newSegments);
//   }, [room_shape, room_size]);

//   const updateSegment = (sideKey: string, segIndex: number, newValue: number) => {
//     setSegments((prev) => {
//       const updated = [...(prev[sideKey] || [])];
//       updated[segIndex] = newValue;
//       return {
//         ...prev,
//         [sideKey]: updated,
//       };
//     });
//   };

//   const addSegment = (sideKey: string, sideLength: number) => {
//     setSegments((prev) => {
//       const current = prev[sideKey] || [];
//       const sum = current.reduce((a, b) => a + b, 0);
//       if (sum < sideLength) {
//         const newSeg = Math.min(3, sideLength - sum);
//         return {
//           ...prev,
//           [sideKey]: [...current, newSeg],
//         };
//       }
//       return prev;
//     });
//   };

//   function onSubmit(values: any) {
//     console.log("Form submitted", values, segments);
//   }

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <Card>
//           <CardContent className="space-y-4 p-6">
//             {[
//               ["customerName", "Customer Name"],
//               ["phone", "Phone"],
//               ["address", "Address"],
//               ["material_made_from", "Mejlis Type"],
//               ["design_type", "Design Type"],
//               ["uplift_or_height", "Uplift/Height"],
//             ].map(([field, label]) => (
//               <div key={field}>
//                 <Label htmlFor={field}>{label}</Label>
//                 <Input id={field} {...form.register(field)} />
//               </div>
//             ))}

//             {[
//               ["no_of_mekeda", "No of Mekeda"],
//               ["no_of_pillow", "No of Pillow"],
//               ["room_size", "Room Size"],
//             ].map(([field, label]) => (
//               <div key={field}>
//                 <Label htmlFor={field}>{label}</Label>
//                 <Input id={field} type="number" {...form.register(field, { valueAsNumber: true })} />
//               </div>
//             ))}

//             <div>
//               <Label htmlFor="room_shape">Room Shape</Label>
//               <Select onValueChange={(value) => form.setValue("room_shape", value)} defaultValue="L">
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select shape" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {[
//                     ["L", "L-shape"],
//                     ["U", "U-shape"],
//                     ["Straight", "Straight"],
//                   ].map(([value, label]) => (
//                     <SelectItem key={value} value={value}>{label}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {sides.map((side, index) => (
//               <div key={`side-${index}`} className="border p-4 rounded-md">
//                 <h4 className="text-lg font-semibold mb-2">Side {index + 1} - Length: {side}m</h4>
//                 <div className="space-y-2">
//                   {segments[`side${index + 1}`]?.map((value, segIndex) => (
//                     <div key={segIndex}>
//                       <Label>Segment {segIndex + 1}</Label>
//                       <Input
//                         type="number"
//                         min={1}
//                         max={3}
//                         value={value}
//                         onChange={(e) => updateSegment(`side${index + 1}`, segIndex, parseFloat(e.target.value) || 0)}
//                       />
//                     </div>
//                   ))}
//                   <Button
//                     type="button"
//                     onClick={() => addSegment(`side${index + 1}`, side)}
//                     disabled={(segments[`side${index + 1}`]?.reduce((a, b) => a + b, 0) ?? 0) >= side}
//                   >
//                     + Add Segment
//                   </Button>
//                 </div>
//               </div>
//             ))}

//             <Button type="submit">Submit</Button>
//           </CardContent>
//         </Card>
//       </form>
//     </div>
//   );
// }
