"use client";

import React, { type ElementType } from "react";
import { cn } from "@/lib/utils";

export type TextShimmerWaveProps = {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  duration?: number;
  baseColor?: string;
  shimmerColor?: string;
  zDistance?: number;
  xDistance?: number;
  yDistance?: number;
  spread?: number;
  scaleDistance?: number;
  rotateYDistance?: number;
  style?: React.CSSProperties;
};

type TextSegment = { char: string; className?: string };

function extractChars(children: React.ReactNode): TextSegment[] {
  const result: TextSegment[] = [];

  function traverse(node: React.ReactNode, inheritedClassName?: string) {
    if (typeof node === "string" || typeof node === "number") {
      const str = String(node);
      for (const char of str) {
        result.push({ char, className: inheritedClassName });
      }
    } else if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ className?: string; children?: React.ReactNode }>;
      const mergedClass = cn(inheritedClassName, element.props.className);
      React.Children.forEach(element.props.children, (child) => {
        traverse(child, mergedClass);
      });
    } else if (Array.isArray(node)) {
      node.forEach((child) => traverse(child, inheritedClassName));
    }
  }

  traverse(children);
  return result;
}

export function TextShimmerWave({
  children,
  as: Component = "p",
  className,
  duration = 1.3,
  baseColor,
  shimmerColor,
  zDistance = 10,
  xDistance = 2,
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.08,
  rotateYDistance = 8,
  style,
}: TextShimmerWaveProps) {
  const segments = extractChars(children);
  const total = segments.length || 1;

  return (
    <Component
      className={cn("relative inline-block [perspective:500px]", className)}
      style={
        {
          ...style,
          "--base-color":
            baseColor ?? "color-mix(in oklab, currentColor 55%, transparent)",
          "--base-gradient-color": shimmerColor ?? "currentColor",
          "--x-dist": `${xDistance}px`,
          "--y-dist": `${yDistance}px`,
          "--z-dist": `${zDistance}px`,
          "--scale-dist": scaleDistance,
          "--rotate-dist": `${rotateYDistance}deg`,
          "--duration": `${duration}s`,
        } as React.CSSProperties
      }
    >
      {segments.map((item, i) => {
        const delay = (i * duration * (1 / spread)) / total;

        return (
          <span
            key={i}
            className={cn(
              "inline-block whitespace-pre [transform-style:preserve-3d] animate-shimmer-wave",
              item.className
            )}
            style={{
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            {item.char}
          </span>
        );
      })}
    </Component>
  );
}
