"use client";

import { Toaster } from "sonner";

export function DatosToaster() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          color: "#0f172a",
          boxShadow: "0 10px 25px -5px rgb(15 23 42 / 0.08)",
        },
      }}
    />
  );
}
