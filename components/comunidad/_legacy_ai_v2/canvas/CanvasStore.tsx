"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

/**
 * Estado global del Modo Canvas.
 *
 * Se administra con React Context + useReducer (sin Zustand, consistente con
 * la decisión arquitectónica de la plataforma de no usar stores globales).
 * Mantiene el archivo activo, un historial de apertura y pilas de
 * deshacer/rehacer para la edición de código en caliente.
 */

export interface CanvasFile {
  id: string;
  title: string;
  code: string;
  language: string;
}

interface CanvasState {
  isOpen: boolean;
  activeFile: CanvasFile | null;
  history: CanvasFile[];
  undoStack: string[];
  redoStack: string[];
}

type Action =
  | { type: "OPEN"; file: CanvasFile }
  | { type: "CLOSE" }
  | { type: "UPDATE_CODE"; code: string }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SELECT_FROM_HISTORY"; id: string };

const MAX_HISTORY = 15;

const initialState: CanvasState = {
  isOpen: false,
  activeFile: null,
  history: [],
  undoStack: [],
  redoStack: [],
};

function pushHistory(history: CanvasFile[], file: CanvasFile): CanvasFile[] {
  const next = history.filter((f) => f.id !== file.id);
  next.unshift(file);
  return next.slice(0, MAX_HISTORY);
}

function reducer(state: CanvasState, action: Action): CanvasState {
  switch (action.type) {
    case "OPEN": {
      return {
        ...state,
        isOpen: true,
        activeFile: action.file,
        history: pushHistory(state.history, action.file),
        undoStack: [],
        redoStack: [],
      };
    }
    case "CLOSE":
      return { ...state, isOpen: false };
    case "UPDATE_CODE": {
      if (!state.activeFile) return state;
      // Evita apilar si el código no cambió (p.ej. edits triviales)
      if (action.code === state.activeFile.code) return state;
      return {
        ...state,
        activeFile: { ...state.activeFile, code: action.code },
        undoStack: [...state.undoStack, state.activeFile.code].slice(-50),
        redoStack: [],
      };
    }
    case "UNDO": {
      if (!state.activeFile || state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        activeFile: { ...state.activeFile, code: prev },
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, state.activeFile.code].slice(-50),
      };
    }
    case "REDO": {
      if (!state.activeFile || state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      return {
        ...state,
        activeFile: { ...state.activeFile, code: next },
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, state.activeFile.code].slice(-50),
      };
    }
    case "SELECT_FROM_HISTORY": {
      const file = state.history.find((f) => f.id === action.id);
      if (!file) return state;
      return {
        ...state,
        isOpen: true,
        activeFile: file,
        undoStack: [],
        redoStack: [],
      };
    }
    default:
      return state;
  }
}

interface CanvasContextValue {
  isOpen: boolean;
  activeFile: CanvasFile | null;
  history: CanvasFile[];
  canUndo: boolean;
  canRedo: boolean;
  canvasModeActive: boolean;
  setCanvasModeActive: (active: boolean) => void;
  openCanvas: (file: CanvasFile) => void;
  closeCanvas: () => void;
  updateCode: (code: string) => void;
  undo: () => void;
  redo: () => void;
  selectFromHistory: (id: string) => void;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [canvasModeActive, setCanvasModeActive] = useState(true);

  const openCanvas = useCallback((file: CanvasFile) => dispatch({ type: "OPEN", file }), []);
  const closeCanvas = useCallback(() => dispatch({ type: "CLOSE" }), []);
  const updateCode = useCallback((code: string) => dispatch({ type: "UPDATE_CODE", code }), []);
  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const selectFromHistory = useCallback(
    (id: string) => dispatch({ type: "SELECT_FROM_HISTORY", id }),
    []
  );

  const value = useMemo<CanvasContextValue>(
    () => ({
      isOpen: state.isOpen,
      activeFile: state.activeFile,
      history: state.history,
      canUndo: state.undoStack.length > 0,
      canRedo: state.redoStack.length > 0,
      canvasModeActive,
      setCanvasModeActive,
      openCanvas,
      closeCanvas,
      updateCode,
      undo,
      redo,
      selectFromHistory,
    }),
    [state, canvasModeActive, openCanvas, closeCanvas, updateCode, undo, redo, selectFromHistory]
  );

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

export function useCanvas(): CanvasContextValue {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas debe usarse dentro de <CanvasProvider>");
  return ctx;
}
