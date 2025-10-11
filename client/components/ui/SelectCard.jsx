import React from "react";
import clsx from "clsx";

export function Card({ className, children }) {
  return (
    <div
      className={clsx("rounded-xl border p-4 shadow-sm bg-white", className)}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={clsx("mb-2", className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={clsx("text-lg font-semibold", className)}>{children}</h3>;
}

export function CardContent({ children, className }) {
  return <div className={clsx("mb-3", className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return <div className={clsx("pt-2 border-t mt-2", className)}>{children}</div>;
}
