import React from "react";
// Exports components with predefined styles according to important-ness

export function HeadingI({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-gray-50 font-bold font-poppins text-4xl">{children}</h1>
  );
}

export function HeadingII({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-gray-50 font-bold font-poppins text-2xl">{children}</h2>
  );
}

export function HeadingIII({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-gray-50 font-bold font-poppins text-xl">{children}</h3>
  );
}

export function HighlightedTextBlock({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className={`${color ? color : "text-gray-50"} font-medium font-inter text-base`}
    >
      {children}
    </div>
  );
}

export function HighlightedText({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className={`${color ? color : "text-gray-50"} font-medium font-inter text-base`}
    >
      {children}
    </span>
  );
}

export function TextBlock({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className={`${color ? color : "text-gray-50"} font-normal font-inter text-base`}
    >
      {children}
    </div>
  );
}

export function Text({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className={`${color ? color : "text-gray-50"} font-normal font-inter text-base`}
    >
      {children}
    </span>
  );
}

export function DescriptionBlock({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className={`${color ? color : "text-gray-50"} font-normal font-inter text-sm opacity-70`}
    >
      {children}
    </div>
  );
}

export function Description({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className={`${color ? color : "text-gray-50"} font-normal font-inter text-sm opacity-70`}
    >
      {children}
    </span>
  );
}
