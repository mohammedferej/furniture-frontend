"use client";

import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseFormWatch, UseFormSetValue } from "react-hook-form";

interface RoomDetailsProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  segments: Record<string, number[]>;
  updateSegments: (segments: Record<string, number[]>) => void;
  sides: number[];
  updateSides: (sides: number[]) => void;
}

export function RoomDetailsForm({
  watch,
  setValue,
  segments,
  updateSegments,
  sides,
  updateSides,
}: RoomDetailsProps) {
  const room_shape = watch("room_shape");
  const room_size = watch("room_size");
console.log("room_shape:", room_shape, "room_size:", room_size);

  useEffect(() => {
   
    let cornerDeduction = 0;
    let numberOfSides = 1;

    switch (room_shape) {
      case "L":
        cornerDeduction = 2; // 1 corner * 2m
        numberOfSides = 2;
        break;
      case "U":
        cornerDeduction = 4; // 2 corners * 2m
        numberOfSides = 3;
        break;
      case "Straight":
        cornerDeduction = 0;
        numberOfSides = 1;
        break;
    }

    const room_size_without_corner = room_size - cornerDeduction;

    const segmentLengths: number[] = [];
    for (let i = 0; i < numberOfSides; i++) {
      const base = Math.floor(room_size_without_corner / numberOfSides);
      segmentLengths.push(base);
    }
    const remainder = room_size_without_corner % numberOfSides;
    for (let i = 0; i < remainder; i++) {
      segmentLengths[i] += 1;
    }
    updateSides(segmentLengths);

    const newSegments: Record<string, number[]> = {};
    segmentLengths.forEach((side, i) => {
      newSegments[`side${i + 1}`] = [Math.floor(side / 2), side - Math.floor(side / 2)];
    });
    updateSegments(newSegments);
  }, [room_shape, room_size, updateSegments, updateSides]);

  const updateSegment = (sideKey: string, segIndex: number, newValue: number) => {
    const updated = [...(segments[sideKey] || [])];
    updated[segIndex] = newValue;
    updateSegments({
      ...segments,
      [sideKey]: updated,
    });
  };

  const addSegment = (sideKey: string, sideLength: number) => {
    const current = segments[sideKey] || [];
    const sum = current.reduce((a, b) => a + b, 0);
    if (sum < sideLength) {
      const newSeg = Math.min(3, sideLength - sum);
      updateSegments({
        ...segments,
        [sideKey]: [...current, newSeg],
      });
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="room_shape">Room Shape</Label>
        <Select onValueChange={(value) => setValue("room_shape", value)} defaultValue={room_shape}>
          <SelectTrigger>
            <SelectValue placeholder="Select shape" />
          </SelectTrigger>
          <SelectContent>
            {[
              ["L", "L-shape"],
              ["U", "U-shape"],
              ["Straight", "Straight"],
            ].map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="room_size">Room Size</Label>
        <Input
          id="room_size"
          type="number"
          value={room_size}
          onChange={(e) => setValue("room_size", Number(e.target.value))}
          min={1}
        />
      </div>

      {sides.map((side, index) => {
        const sideKey = `side${index + 1}`;
        const segmentSum = segments[sideKey]?.reduce((a, b) => a + b, 0) ?? 0;
        const isValid = segmentSum === side;
        return (
          <div key={`side-${index}`} className="border p-4 rounded-md my-4">
            <h4 className="text-lg font-semibold mb-2">
              Side {index + 1} - Length: {side}m
            </h4>
            <div className="space-y-2">
             {segments[sideKey]?.map((value, segIndex) => (
  <div key={segIndex} className="flex items-center gap-2">
    <div className="flex-1">
      <Label>Segment {segIndex + 1}</Label>
      <Input
        type="number"
        min={1}
        max={3}
        value={value}
        onChange={(e) =>
          updateSegment(sideKey, segIndex, parseFloat(e.target.value) || 0)
        }
      />
    </div>
    <Button
      type="button"
      variant="destructive"
      size="icon"
      onClick={() => {
        const updated = segments[sideKey].filter((_, i) => i !== segIndex);
        updateSegments({ ...segments, [sideKey]: updated });
      }}
    >
      🗑️
    </Button>
  </div>
))}

              <Button
                type="button"
                onClick={() => addSegment(sideKey, side)}
                disabled={segmentSum >= side}
              >
                + Add Segment
              </Button>
              {!isValid && (
                <div className="text-sm text-red-500 mt-1">
                  ⚠️ Segment total must equal {side}m (currently {segmentSum}m)
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
