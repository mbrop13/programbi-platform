"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, ArrowRight, Info, Plus, Minus, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (qty: number, details: any, scheduling_slots: { date: string, time: string }[]) => void;
  isSubmitting?: boolean;
}

const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function SchedulingModal({ isOpen, onClose, onConfirm, isSubmitting }: SchedulingModalProps) {
  const [qty, setQty] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Selected slots: array of { date: 'YYYY-MM-DD', time: 'HH:MM' }
  const [selectedSlots, setSelectedSlots] = useState<{ date: string, time: string }[]>([]);
  
  // Unavailable slots from DB
  const [unavailableSlots, setUnavailableSlots] = useState<{ slot_date: string, slot_time: string }[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Fetch slots when month changes
  useEffect(() => {
    if (!isOpen) return;
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const start = `${year}-${month}-01`;
        // Generous end date to cover the next month too just in case
        const nextMonth = new Date(year, currentDate.getMonth() + 2, 0);
        const end = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-${String(nextMonth.getDate()).padStart(2, '0')}`;
        
        const res = await fetch(`/api/asesorias/slots?start=${start}&end=${end}`);
        if (res.ok) {
          const data = await res.json();
          setUnavailableSlots(data.slots || []);
        }
      } catch (err) {
        console.error("Error fetching slots", err);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [currentDate, isOpen]);

  // Calendar logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    if (prev.getMonth() >= today.getMonth() || prev.getFullYear() > today.getFullYear()) {
      setCurrentDate(prev);
    }
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    // Limit to +2 months
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    if (next <= maxDate) {
      setCurrentDate(next);
    }
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDateYYYYMMDD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getAvailableTimesForDate = (date: Date) => {
    const times = [];
    const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 4 = Thu
    const isMonToThu = dayOfWeek >= 1 && dayOfWeek <= 4;
    const dateStr = formatDateYYYYMMDD(date);

    for (let h = 8; h <= 22; h++) {
      if (isMonToThu && h >= 19 && h <= 22) continue; // Restricción Lunes a Jueves
      
      const hourStr = h.toString().padStart(2, "0");
      times.push(`${hourStr}:00`);
      if (h !== 22 || !isMonToThu) {
         times.push(`${hourStr}:30`);
      }
    }

    // Filter out unavailable
    return times.filter(t => !unavailableSlots.some(us => us.slot_date === dateStr && us.slot_time === t));
  };

  const handleSelectTime = (time: string) => {
    if (!selectedDate) return;
    const dateStr = formatDateYYYYMMDD(selectedDate);
    
    // Check if already selected
    const existingIndex = selectedSlots.findIndex(s => s.date === dateStr && s.time === time);
    
    if (existingIndex >= 0) {
      // Remove it
      setSelectedSlots(selectedSlots.filter((_, i) => i !== existingIndex));
    } else {
      // Add it if we haven't reached max
      if (selectedSlots.length < qty) {
        setSelectedSlots([...selectedSlots, { date: dateStr, time }]);
      } else {
        // Replace the oldest one (or last one) to be user friendly
        const newSlots = [...selectedSlots];
        newSlots.pop();
        newSlots.push({ date: dateStr, time });
        setSelectedSlots(newSlots);
      }
    }
  };

  // Adjust selections if qty is reduced
  useEffect(() => {
    if (selectedSlots.length > qty) {
      setSelectedSlots(selectedSlots.slice(0, qty));
    }
  }, [qty]);

  const handleConfirm = () => {
    if (selectedSlots.length < qty) return;
    // Format details for legacy support
    const sorted = [...selectedSlots].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    const primary = `${sorted[0].date} a las ${sorted[0].time}`;
    const secondary = sorted.length > 1 ? `${sorted[1].date} a las ${sorted[1].time}` : "No aplica";
    
    onConfirm(qty, { primary, secondary }, selectedSlots);
  };

  if (!isOpen) return null;

  const calendarDays = generateCalendarDays();
  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100 flex flex-col max-h-[95vh]"
        >
          {/* Header */}
          <div className="bg-[#0F172A] p-6 sm:p-8 text-white relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black font-display tracking-tight">Agendamiento Premium</h2>
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  Elige tus horarios para las sesiones 1 a 1.
                </p>
              </div>

              {/* Quantity Selector Mini */}
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 flex items-center gap-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Horas:</div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="w-6 text-center font-black text-xl text-white">
                    {qty}
                  </div>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-[#FAFAFA]">
            {/* Calendar Left Side */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-100 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900 capitalize">
                  {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrevMonth}
                    disabled={currentDate.getMonth() <= today.getMonth() && currentDate.getFullYear() <= today.getFullYear()}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    disabled={currentDate >= new Date(today.getFullYear(), today.getMonth() + 2, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_NAMES.map(day => (
                  <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {calendarDays.map((date, i) => {
                  if (!date) return <div key={`empty-${i}`} className="p-2" />;
                  
                  const isPast = date < today;
                  const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
                  const dateStr = formatDateYYYYMMDD(date);
                  const hasSelectionHere = selectedSlots.some(s => s.date === dateStr);

                  return (
                    <button
                      key={dateStr}
                      disabled={isPast}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        relative aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl text-sm font-bold transition-all border-2
                        ${isPast ? 'opacity-30 cursor-not-allowed border-transparent bg-gray-50' : 'cursor-pointer hover:border-blue-200'}
                        ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30' : 'bg-white text-gray-700 border-transparent'}
                        ${!isSelected && !isPast && 'hover:bg-blue-50'}
                      `}
                    >
                      {date.getDate()}
                      {hasSelectionHere && (
                        <div className={`absolute bottom-1.5 sm:bottom-2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Times Right Side */}
            <div className="w-full md:w-[320px] lg:w-[380px] flex flex-col bg-[#FAFAFA] shrink-0 h-full max-h-[400px] md:max-h-none overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-white shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900">
                    {selectedDate ? (
                      `${DAY_NAMES[selectedDate.getDay()]} ${selectedDate.getDate()} de ${MONTH_NAMES[selectedDate.getMonth()]}`
                    ) : (
                      "Selecciona un día"
                    )}
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">
                    {selectedSlots.length} / {qty} Horas
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedDate ? "Selecciona el horario deseado" : "Revisa el calendario a la izquierda"}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {!selectedDate ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                    <CalendarIcon className="w-12 h-12 opacity-20" />
                    <p className="text-sm font-medium">Día no seleccionado</p>
                  </div>
                ) : isLoadingSlots ? (
                  <div className="h-full flex flex-col items-center justify-center text-brand-blue gap-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : availableTimes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3 text-center">
                    <Clock className="w-12 h-12 opacity-20" />
                    <p className="text-sm font-medium">No hay horarios disponibles<br/>para este día.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {availableTimes.map(time => {
                      const isSelected = selectedSlots.some(s => s.date === formatDateYYYYMMDD(selectedDate) && s.time === time);
                      return (
                        <button
                          key={time}
                          onClick={() => handleSelectTime(time)}
                          className={`
                            py-3 px-4 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-2
                            ${isSelected 
                              ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                              : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-600'}
                          `}
                        >
                          {isSelected && <Check className="w-4 h-4" />}
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 sm:p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between shrink-0 gap-4">
            <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl text-blue-800 text-xs font-medium w-full sm:w-auto flex-1">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Las horas seleccionadas se reservarán al iniciar el pago.</p>
            </div>
            <button
              onClick={handleConfirm}
              disabled={selectedSlots.length < qty || isSubmitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
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
