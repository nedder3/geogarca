import { create } from 'zustand';

export interface ExamState {
  isExamActive: boolean;
  isStartModalOpen: boolean;
  isConfirmExitOpen: boolean;
  isSummaryOpen: boolean;
  elapsedSeconds: number;
  formattedDuration: string;
  startDate: Date | null;
  endDate: Date | null;
  batteryLevel: number; // 0..100

  // Actions
  openStartModal: () => void;
  closeStartModal: () => void;
  startExam: (now?: Date) => void;
  tick: (seconds?: number) => void;
  requestExitExam: () => void;
  cancelExitExam: () => void;
  finishExam: (now?: Date) => void;
  dismissSummary: () => void;
  reset: () => void;
}

const formatMMSS = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  return `${mm}:${ss}`;
};

export const useExamStore = create<ExamState>((set) => ({
  isExamActive: false,
  isStartModalOpen: false,
  isConfirmExitOpen: false,
  isSummaryOpen: false,
  elapsedSeconds: 0,
  formattedDuration: '00:00',
  startDate: null,
  endDate: null,
  batteryLevel: 85,

  openStartModal: () => set({ isStartModalOpen: true }),
  closeStartModal: () => set({ isStartModalOpen: false }),

  startExam: (now = new Date()) =>
    set({
      isExamActive: true,
      isStartModalOpen: false,
      isConfirmExitOpen: false,
      isSummaryOpen: false,
      elapsedSeconds: 0,
      formattedDuration: '00:00',
      startDate: now,
      endDate: null,
    }),

  tick: (seconds) =>
    set((state) => {
      const nextSeconds = seconds !== undefined ? seconds : state.elapsedSeconds + 1;
      return {
        elapsedSeconds: nextSeconds,
        formattedDuration: formatMMSS(nextSeconds),
      };
    }),

  requestExitExam: () => set({ isConfirmExitOpen: true }),
  cancelExitExam: () => set({ isConfirmExitOpen: false }),

  finishExam: (now = new Date()) =>
    set((state) => ({
      isExamActive: false,
      isConfirmExitOpen: false,
      isSummaryOpen: true,
      endDate: now,
    })),

  dismissSummary: () => set({ isSummaryOpen: false }),

  reset: () =>
    set({
      isExamActive: false,
      isStartModalOpen: false,
      isConfirmExitOpen: false,
      isSummaryOpen: false,
      elapsedSeconds: 0,
      formattedDuration: '00:00',
      startDate: null,
      endDate: null,
      batteryLevel: 85,
    }),
}));
