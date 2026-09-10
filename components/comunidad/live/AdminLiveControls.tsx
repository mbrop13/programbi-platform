"use client";

import { Button } from "@/components/ui/button";

export function AdminLiveControls({
  canStart,
  canComplete,
  onStart,
  onComplete,
}: {
  canStart: boolean;
  canComplete: boolean;
  onStart: () => void;
  onComplete: () => void;
}) {
  if (!canStart && !canComplete) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {canStart ? (
        <Button type="button" size="sm" onClick={onStart}>
          Iniciar clase
        </Button>
      ) : null}
      {canComplete ? (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={() => {
            if (window.confirm("¿Finalizar la clase y moverla a grabaciones?")) onComplete();
          }}
        >
          Finalizar
        </Button>
      ) : null}
    </div>
  );
}
