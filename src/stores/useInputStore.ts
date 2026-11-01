import { create } from 'zustand';

export type KeyboardTab = '123' | 'f(x)' | 'abc' | '#&-';

export interface InputState {
  expression: string;
  cursorPosition: number;
  activeTab: KeyboardTab;
  isKeyboardVisible: boolean;

  // Actions
  insertText: (text: string) => void;
  backspace: () => void;
  clear: () => void;
  setActiveTab: (tab: KeyboardTab) => void;
  setKeyboardVisible: (visible: boolean) => void;
  reset: () => void;
}

export const useInputStore = create<InputState>((set) => ({
  expression: '',
  cursorPosition: 0,
  activeTab: '123',
  isKeyboardVisible: false,

  insertText: (text: string) =>
    set((state) => ({
      expression: state.expression + text,
      cursorPosition: state.cursorPosition + text.length,
    })),

  backspace: () =>
    set((state) => {
      if (state.expression.length === 0) return state;
      return {
        expression: state.expression.slice(0, -1),
        cursorPosition: Math.max(0, state.cursorPosition - 1),
      };
    }),

  clear: () => set({ expression: '', cursorPosition: 0 }),

  setActiveTab: (tab: KeyboardTab) => set({ activeTab: tab }),

  setKeyboardVisible: (visible: boolean) => set({ isKeyboardVisible: visible }),

  reset: () =>
    set({
      expression: '',
      cursorPosition: 0,
      activeTab: '123',
      isKeyboardVisible: false,
    }),
}));
