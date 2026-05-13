"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Clock, ArrowRight, Info, Plus, Minus, ChevronLeft, ChevronRight, Check, CalendarCheck } from "lucide-react";

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
  const [selectedSlots, setSelectedSlots] = useState<{ date: string, time: string }[]>([]);
  const [unavailableSlots, setUnavailableSlots] = useState<{ slot_date: string, slot_time: string }[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Fetch slots when modal opens or month changes
  useEffect(() => {
    if (!isOpen) return;
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const start = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const nextMonth = new Date(year, month + 2, 0);
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDateYYYYMMDD = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatDateReadable = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return `${DAY_NAMES[date.getDay()]} ${d} de ${MONTH_NAMES[m - 1]}`;
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    if (prev.getFullYear() > today.getFullYear() || prev.getMonth() >= today.getMonth()) {
      setCurrentDate(prev);
    }
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    if (next <= maxDate) setCurrentDate(next);
  };

  const calendarDays = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  })();

  const getAvailableTimesForDate = (date: Date) => {
    const times: string[] = [];
    const dayOfWeek = date.getDay();
    const isMonToThu = dayOfWeek >= 1 && dayOfWeek <= 4;
    const dateStr = formatDateYYYYMMDD(date);
    for (let h = 8; h <= 22; h++) {
      if (isMonToThu && h >= 19 && h <= 22) continue;
      [`${String(h).padStart(2,'0')}:00`, `${String(h).padStart(2,'0')}:30`].forEach(t => {
        if (!unavailableSlots.some(us => us.slot_date === dateStr && us.slot_time === t)) {
          times.push(t);
        }
      });
    }
    return times;
  };

  const handleSelectTime = (time: string) => {
    if (!selectedDate) return;
    const dateStr = formatDateYYYYMMDD(selectedDate);
    const existingIndex = selectedSlots.findIndex(s => s.date === dateStr && s.time === time);
    if (existingIndex >= 0) {
      setSelectedSlots(selectedSlots.filter((_, i) => i !== existingIndex));
    } else if (selectedSlots.length < qty) {
      setSelectedSlots([...selectedSlots, { date: dateStr, time }]);
    }
  };

  // Reset excess selections when qty decreases
  useEffect(() => {
    if (selectedSlots.length > qty) setSelectedSlots(selectedSlots.slice(0, qty));
  }, [qty]);

  const handleConfirm = () => {
    if (selectedSlots.length < qty) return;
    const sorted = [...selectedSlots].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    const primary = `${sorted[0].date} a las ${sorted[0].time}`;
    const secondary = sorted.length > 1 ? `${sorted[1].date} a las ${sorted[1].time}` : "No aplica";
    onConfirm(qty, { primary, secondary }, selectedSlots);
  };

  if (!isOpen) return null;

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100 flex flex-col"
          style={{ maxHeight: "calc(100vh - 32px)" }}
        >
          {/* ── HEADER (light) ── */}
          <div className="bg-white border-b border-gray-100 p-5 sm:p-6 shrink-0">
            <div className="flex items-center justify-between gap-4">
              {/* Title */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">Agendamiento Premium</h2>
                  <p className="text-xs text-gray-400 font-medium">Selecciona tus horarios de sesión 1 a 1</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-gray-500 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">

            {/* ── Calendar (left) ── */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-100 bg-white min-h-0">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-base text-gray-900 capitalize">
                  {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevMonth}
                    disabled={currentDate.getMonth() <= today.getMonth() && currentDate.getFullYear() <= today.getFullYear()}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    disabled={currentDate >= new Date(today.getFullYear(), today.getMonth() + 2, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-1.5">
                {DAY_NAMES.map(day => (
                  <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1.5">{day}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {calendarDays.map((date, i) => {
                  if (!date) return <div key={`e-${i}`} />;
                  const isPast = date < today;
                  const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
                  const dateStr = formatDateYYYYMMDD(date);
                  const hasSlot = selectedSlots.some(s => s.date === dateStr);

                  return (
                    <button
                      key={dateStr}
                      disabled={isPast}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all
                        ${isPast ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                        ${isSelected && !isPast ? 'bg-blue-600 text-white shadow-md shadow-blue-400/30' : ''}
                        ${!isSelected && !isPast ? 'hover:bg-blue-50 text-gray-700' : ''}
                      `}
                    >
                      {date.getDate()}
                      {hasSlot && (
                        <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>


            </div>

            {/* ── Time Slots (right) ── */}
            <div className="w-full md:w-[300px] lg:w-[340px] shrink-0 flex flex-col bg-gray-50 min-h-0">
              {/* Header */}
              <div className="p-5 border-b border-gray-100 bg-white shrink-0">
                <h4 className="font-bold text-gray-900 text-sm">
                  {selectedDate
                    ? `${DAY_NAMES[selectedDate.getDay()]} ${selectedDate.getDate()} de ${MONTH_NAMES[selectedDate.getMonth()]}`
                    : "Selecciona un día"}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">
                  {selectedDate
                    ? `${availableTimes.length} horarios disponibles`
                    : "Haz clic en el calendario para ver horas"}
                </p>
              </div>

              {/* Scrollable times — fills all remaining space to footer */}
              <div className="flex-1 overflow-y-auto p-4">
                {!selectedDate ? (
                  <div className="h-32 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <CalendarIcon className="w-8 h-8 opacity-20" />
                    <p className="text-xs font-medium text-center">Elige un día en el calendario</p>
                  </div>
                ) : isLoadingSlots ? (
                  <div className="h-32 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : availableTimes.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-gray-400 gap-2 text-center">
                    <Clock className="w-8 h-8 opacity-20" />
                    <p className="text-xs font-medium">Sin disponibilidad<br />este día</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimes.map(time => {
                      const isSelected = selectedSlots.some(
                        s => s.date === formatDateYYYYMMDD(selectedDate) && s.time === time
                      );
                      const isFull = selectedSlots.length >= qty && !isSelected;
                      return (
                        <button
                          key={time}
                          onClick={() => !isFull && handleSelectTime(time)}
                          disabled={isFull}
                          className={`
                            py-2.5 px-3 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-1.5
                            ${isSelected
                              ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                              : isFull
                              ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                              : 'bg-white border-gray-100 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'}
                          `}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div className="bg-white border-t border-gray-100 p-5 sm:p-6 shrink-0">

            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${qty > 0 ? (selectedSlots.length / qty) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs font-black text-blue-600 tabular-nums shrink-0">{selectedSlots.length} / {qty} horas</span>
            </div>

            {/* Summary of selected slots */}
            {selectedSlots.length > 0 ? (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {selectedSlots.map((slot, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
                      <CalendarCheck className="w-3.5 h-3.5" />
                      {formatDateReadable(slot.date)} — {slot.time}
                      <button
                        onClick={() => setSelectedSlots(selectedSlots.filter((_, idx) => idx !== i))}
                        className="ml-1 text-blue-400 hover:text-blue-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {selectedSlots.length < qty && (
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-dashed border-gray-300 text-gray-400 text-xs font-bold px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      {qty - selectedSlots.length} hora{qty - selectedSlots.length > 1 ? 's' : ''} por elegir
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-4 text-xs text-gray-400 font-medium">
                Selecciona {qty} horario{qty > 1 ? 's' : ''} en el calendario para continuar.
              </div>
            )}

            {/* Action Row */}
            <div className="flex items-center gap-3">
              {/* Qty selector */}
              <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-100 rounded-2xl px-3 py-2 shrink-0">
                <span className="text-xs font-bold text-blue-600 hidden sm:block">Horas:</span>
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-7 h-7 rounded-xl bg-white border border-blue-200 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors shadow-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-black text-lg text-blue-700">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-7 h-7 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleConfirm}
                disabled={selectedSlots.length < qty || isSubmitting}
                className="flex-1 sm:flex-none sm:ml-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Procesando..." : "Confirmar y Pagar"}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
