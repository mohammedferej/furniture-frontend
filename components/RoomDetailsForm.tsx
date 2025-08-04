"use client";

import { useEffect, useMemo } from "react";
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
import type { UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

interface RoomDetailsProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  segments: Record<string, number[]>;
  updateSegments: (segments: Record<string, number[]>) => void;
  sides: number[];
  updateSides: (sides: number[]) => void;
    errors: FieldErrors<any>;
}

export function RoomDetailsForm({
  watch,
  setValue,
  segments,
  updateSegments,
  sides,
  updateSides,
}: RoomDetailsProps) {
  /* ───────────────────────────
     form‑controlled values
  ─────────────────────────── */
  const room_shape = watch("room_shape");
  const room_size = watch("room_size");

  /* ───────────────────────────
     helpers
  ─────────────────────────── */
  const cornerDeduction = useMemo(() => {
    if (room_shape === "L") return 2;
    if (room_shape === "U") return 4;
    return 0;
  }, [room_shape]);

  const numberOfSides = useMemo(() => {
    if (room_shape === "L") return 2;
    if (room_shape === "U") return 3;
    return 1;
  }, [room_shape]);

  const room_size_without_corner = room_size - cornerDeduction;

  /* ───────────────────────────
     initialise / reset sides
  ─────────────────────────── */
  useEffect(() => {
    if (sides.length === numberOfSides) return; // already initialised

    // Evenly distribute length across sides
    const base = Math.floor(room_size_without_corner / numberOfSides);
    const init = Array(numberOfSides).fill(base) as number[];
    let remainder = room_size_without_corner - base * numberOfSides;
    for (let i = 0; i < remainder; i++) init[i] += 1;
    updateSides(init);

    // make simple 2‑segment defaults
    const newSeg: Record<string, number[]> = {};
    init.forEach((s, i) => {
      newSeg[`side${i + 1}`] = [Math.floor(s / 2), s - Math.floor(s / 2)];
    });
    updateSegments(newSeg);
  }, [
    numberOfSides,
    room_size_without_corner,
    updateSides,
    updateSegments,
    sides.length,
  ]);

  /* ───────────────────────────
     editable side length
  ─────────────────────────── */
  const changeSideLength = (idx: number, raw: string) => {
    const val = Number(raw);
    if (Number.isNaN(val)) return;

    const next = [...sides];
    next[idx] = val;
    updateSides(next);

    // Ensure segments still fit inside this side
    const key = `side${idx + 1}`;
    const segs = segments[key] ?? [];
    const segTotal = segs.reduce((a, b) => a + b, 0);

    if (segTotal > val) {
      // shrink to one segment = new side length
      updateSegments({ ...segments, [key]: [val] });
    }
  };

  /* ───────────────────────────
     segment helpers
  ─────────────────────────── */
  const changeSegment = (
    sideKey: string,
    segIdx: number,
    raw: string,
    sideLen: number,
  ) => {
    const val = Number(raw);
    if (Number.isNaN(val) || val < 1 || val > 3) return;

    const arr = [...(segments[sideKey] || [])];
    arr[segIdx] = val;
    if (arr.reduce((a, b) => a + b, 0) <= sideLen) {
      updateSegments({ ...segments, [sideKey]: arr });
    }
  };

  const addSegment = (sideKey: string, sideLen: number) => {
    const arr = segments[sideKey] ?? [];
    const sum = arr.reduce((a, b) => a + b, 0);
    if (sum < sideLen) {
      const newSeg = Math.min(3, sideLen - sum);
      updateSegments({ ...segments, [sideKey]: [...arr, newSeg] });
    }
  };

  const removeSegment = (sideKey: string, segIdx: number) => {
    const arr = (segments[sideKey] || []).filter((_, i) => i !== segIdx);
    updateSegments({ ...segments, [sideKey]: arr });
  };

  /* ───────────────────────────
     derived validations
  ─────────────────────────── */
  const totalSides = sides.reduce((a, b) => a + b, 0);
  const sidesValid = totalSides === room_size_without_corner;

  /* ───────────────────────────
     render
  ─────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Room shape & size */}
      <Card>
        <CardHeader>
          <CardTitle>Room Configuration</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="room_shape">Room Shape</Label>
            <Select
              defaultValue={room_shape}
              onValueChange={(v) => setValue("room_shape", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select shape" />
              </SelectTrigger>
              <SelectContent>
                {[
                  ["L", "L‑shape"],
                  ["U", "U‑shape"],
                  ["Straight", "Straight"],
                ].map(([v, l]) => (
                  <SelectItem key={v} value={v}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room_size">Room Size (meters)</Label>
            <Input
              id="room_size"
              type="number"
              min={1}
              value={room_size}
              onChange={(e) => setValue("room_size", Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Editable sides */}
      {sides.map((len, idx) => {
        const key = `side${idx + 1}`;
        const segs = segments[key] ?? [];
        const segSum = segs.reduce((a, b) => a + b, 0);
        const segValid = segSum === len;

        return (
          <Card key={key} className="border rounded-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Side {idx + 1}</CardTitle>
                <div className="flex items-center gap-3">
                  <Label>Length (m):</Label>
                  <Input
                    className="w-20"
                    type="number"
                    min={1}
                    value={len === 0 ? "" : len}
                    onChange={(e) => changeSideLength(idx, e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* segments */}
              <div className="space-y-3">
                {segs.map((v, i) => (
                  <div className="flex items-center gap-3" key={i}>
                    <div className="flex-1 space-y-1">
                      <Label>Segment {i + 1}</Label>
                      <Input
                        type="number"
                        min={1}
                        max={3}
                        value={String(v)}
                        onChange={(e) =>
                          changeSegment(key, i, e.target.value, len)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => removeSegment(key, i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => addSegment(key, len)}
                disabled={segSum >= len}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Segment
              </Button>

              {!segValid && (
                <p className="text-sm text-red-500 mt-2">
                  ⚠️ Segments sum ({segSum}m) must equal side length ({len}m)
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* totals check */}
      {!sidesValid && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-red-600">
            ⚠️ Total of all sides ({totalSides}m) must equal {room_size_without_corner}m
            (room size {room_size}m minus {cornerDeduction}m corner deduction)
          </CardContent>
        </Card>
      )}
    </div>
  );
}