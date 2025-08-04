"use client";

import React, { useRef } from "react";
import jsPDF from "jspdf";

interface RoomVisualizerProps {
  room_shape: "L" | "U" | "Straight";
  segments: Record<string, number[]>;
  scale?: number;
  svgRef?: React.RefObject<SVGSVGElement>;
}

const colors = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#A66DD4", "#00C9A7"];
const cornerColor = "#888";

export default function RoomVisualizer({
  room_shape,
  segments,
  scale = 50,
  svgRef: externalSvgRef,
}: RoomVisualizerProps) {
  const internalSvgRef = useRef<SVGSVGElement>(null);
  const svgRef = externalSvgRef || internalSvgRef;

  /* ---------- EXPORT: SVG ➜ PNG ---------- */
  const exportPNG = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      URL.revokeObjectURL(url);

      const link = document.createElement("a");
      link.download = "room-shape.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  };

  /* ---------- EXPORT: SVG ➜ PDF ---------- */
  const exportPDF = () => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const bbox = svgElement.getBBox();
    const pageWidth = 842;  // A4 landscape width in pt
    const pageHeight = 595; // A4 landscape height in pt

    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    const viewBoxPadding = 20;

    clonedSvg.setAttribute("width", `${bbox.width + viewBoxPadding * 2}`);
    clonedSvg.setAttribute("height", `${bbox.height + viewBoxPadding * 2}`);
    clonedSvg.setAttribute("viewBox", `${bbox.x - viewBoxPadding} ${bbox.y - viewBoxPadding} ${bbox.width + viewBoxPadding * 2} ${bbox.height + viewBoxPadding * 2}`);
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      const scale = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const drawWidth = canvas.width * scale;
      const drawHeight = canvas.height * scale;
      const offsetX = (pageWidth - drawWidth) / 2;
      const offsetY = (pageHeight - drawHeight) / 2;

      pdf.addImage(imgData, "PNG", offsetX, offsetY, drawWidth, drawHeight);
      pdf.save("room-shape.pdf");

      URL.revokeObjectURL(url);
    };

    img.onerror = (err) => console.error("Image load failed for PDF export", err);
    img.crossOrigin = "anonymous";
    img.src = url;
  };

  /* ---------- DRAWING LOGIC ---------- */
  const spacing = 4;
  const rectH = 40;
  const cornerLength = 1;

  let dir: 0 | 1 | 2 | 3 = 0; // right, down, left, up
  let x = 200, y = 200;

  const move = (px: number) => {
    switch (dir) {
      case 0: x += px + spacing; break;
      case 1: y += px + spacing; break;
      case 2: x -= px + spacing; break;
      case 3: y -= px + spacing; break;
    }
  };

  let minX = x, minY = y, maxX = x, maxY = y;

  const elements: React.ReactElement[] = [];
  const sideKeys = Object.keys(segments);

  const cornerBetween: number[] =
    room_shape === "L" ? [0]
    : room_shape === "U" ? [0, 1]
    : [];

  sideKeys.forEach((sideKey, sideIdx) => {
    const originalSegs = segments[sideKey] || [];
    const segsToRender = [...originalSegs];

    if (cornerBetween.includes(sideIdx - 1)) {
      elements.push(drawSegment(1, x, y, dir, true));
      move(cornerLength * scale);
    }

    segsToRender.forEach((len, segIdx) => {
      elements.push(drawSegment(len, x, y, dir, false, sideIdx, segIdx));
      move(len * scale);
    });

    if (cornerBetween.includes(sideIdx)) {
      elements.push(drawSegment(1, x, y, dir, true));
      move(cornerLength * scale);
    }

    if (room_shape !== "Straight") {
      dir = ((dir + 1) % 4) as typeof dir;
    }
  });

  function drawSegment(
    len: number,
    x: number,
    y: number,
    dir: 0 | 1 | 2 | 3,
    isCorner = false,
    sideIdx?: number,
    segIdx?: number
  ): React.ReactElement {
    const horiz = dir % 2 === 0;
    const px = len * scale;
    const w = horiz ? px : rectH;
    const h = horiz ? rectH : px;
    const drawX = dir === 2 ? x - px : x;
    const drawY = dir === 3 ? y - px : y;

    minX = Math.min(minX, drawX);
    minY = Math.min(minY, drawY);
    maxX = Math.max(maxX, drawX + w);
    maxY = Math.max(maxY, drawY + h);

    return (
      <g key={`seg-${x}-${y}-${len}-${isCorner}`}>
        <rect
          x={drawX}
          y={drawY}
          width={w}
          height={h}
          fill={isCorner ? cornerColor : colors[(sideIdx! + segIdx!) % colors.length]}
          stroke="black"
          strokeWidth={1}
          rx={4}
        />
        <text
          x={drawX + w / 2}
          y={drawY + h / 2 + 4}
          textAnchor="middle"
          fontSize={12}
          fill="#fff"
          fontWeight="bold"
        >
          {len}m
        </text>
      </g>
    );
  }

  const margin = 30;
  const viewBox = `${minX - margin} ${minY - margin} ${maxX - minX + margin * 2} ${maxY - minY + margin * 2}`;

  return (
    <div className="mt-6 border rounded p-4 bg-white shadow">
      <h3 className="text-lg font-bold mb-4">Room Shape Preview</h3>
      <div className="overflow-auto max-w-full">
        <svg
          ref={svgRef}
          viewBox={viewBox}
          width={maxX - minX + margin * 2}
          height={maxY - minY + margin * 2}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          className="bg-white"
        >
          {elements}
        </svg>
      </div>
      <div className="mt-4 flex gap-3">
        <button 
          onClick={exportPNG} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          📷 PNG
        </button>
        <button 
          onClick={exportPDF} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          📄 PDF
        </button>
      </div>
    </div>
  );
}
