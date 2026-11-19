export type FilaMapa = {
  slug: string;
  nombre: string;
  tasa: number;
  yoy: number | null;
  nota?: "a" | "b";
};

export const colores = ["#dcecf5", "#b5d7e9", "#79b4d4", "#357ca5", "#1469ad", "#174e83"];
export const numero = (n: number) => n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
