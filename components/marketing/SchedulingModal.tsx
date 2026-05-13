"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, ArrowRight, Info, Plus, Minus } from "lucide-react";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (qty: number, details: any) => void;
  isSubmitting?: boolean;
}

export default function SchedulingModal({ isOpen, onClose, onConfirm, isSubmitting }: SchedulingModalProps) {
  const [qty, setQty] = useState(1);
  const [date1, setDate1] = useState("");
  const [time1, setTime1] = useState("");
  const [date2, setDate2] = useState("");
  const [time2, setTime2] = useState("");

  // Generar opciones de tiempo excluyendo lun-jue 19:00 - 22:00
  const getAvailableTimes = (dateStr: string) => {
    const times = [];
    const date = new Date(dateStr + "T12:00:00"); // Avoid timezone shift
    const day = date.getDay(); // 0 = Sun, 1 = Mon, ..., 4 = Thu
    
    const isMonToThu = day >= 1 && day <= 4;

    for (let h = 8; h <= 22; h++) {
      if (isMonToThu && h >= 19 && h <= 22) continue;
      
      const hourStr = h.toString().padStart(2, "0");
      times.push(`${hourStr}:00`);
      if (h !== 22 || !isMonToThu) {
         times.push(`${hourStr}:30`);
      }
    }
    return times;
  };

  const handleConfirm = () => {
    if (!date1 || !time1) return;
    const details = {
      primary: `${date1} a las ${time1}`,
      secondary: date2 && time2 ? `${date2} a las ${time2}` : "No especificada"
    };
    onConfirm(qty, details);
  };

  // Restrict past dates
  const today = new Date().toISOString().split("T")[0];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black font-display mb-2">Asignar Horario</h2>
            <p className="text-blue-100 text-sm font-medium">
              Selecciona cuántas horas necesitas y tus preferencias de horario.
            </p>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto">
            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-3 block">
                Cantidad de Horas a comprar
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="w-20 text-center font-black text-3xl text-gray-900">
                  {qty}
                </div>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-12 h-12 rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Primary Option */}
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-blue-900 text-sm mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs">1</span>
                  Opción Principal *
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1 block">Día</label>
                    <input
                      type="date"
                      min={today}
                      value={date1}
                      onChange={(e) => { setDate1(e.target.value); setTime1(""); }}
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1 block">Hora</label>
                    <select
                      value={time1}
                      onChange={(e) => setTime1(e.target.value)}
                      disabled={!date1}
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:opacity-50"
                    >
                      <option value="">Selecciona...</option>
                      {date1 && getAvailableTimes(date1).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Secondary Option */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">2</span>
                  Opción Secundaria (Opcional)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1 block">Día</label>
                    <input
                      type="date"
                      min={today}
                      value={date2}
                      onChange={(e) => { setDate2(e.target.value); setTime2(""); }}
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1 block">Hora</label>
                    <select
                      value={time2}
                      onChange={(e) => setTime2(e.target.value)}
                      disabled={!date2}
                      className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                    >
                      <option value="">Selecciona...</option>
                      {date2 && getAvailableTimes(date2).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 bg-blue-50 p-4 rounded-xl text-blue-800 text-sm font-medium">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p>
                Después de pagar, nuestro equipo se pondrá en contacto contigo para confirmar el enlace y la hora definitiva de la sesión.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
            <button
              onClick={handleConfirm}
              disabled={!date1 || !time1 || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Procesando..." : "Confirmar y Pagar"} 
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
