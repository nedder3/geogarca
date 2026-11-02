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
  tick: (timeOrSeconds?: Date | number) => void;
  requestExitExam: () => void;
  cancelExitExam: () => void;
  finishExam: (now?: Date) => void;
  dismissSummary: () => void;
  reset: () => void;
}

export const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    const hh = hours.toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
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

  tick: (timeOrSeconds) =>
    set((state) => {
      // Explicit numeric seconds override (for tests / manual overrides)
      if (typeof timeOrSeconds === 'number') {
        return {
          elapsedSeconds: timeOrSeconds,
          formattedDuration: formatDuration(timeOrSeconds),
        };
      }

      // Wall-clock time difference calculation (immune to background suspension)
      const now = timeOrSeconds instanceof Date ? timeOrSeconds : new Date();
      if (state.startDate) {
        const diffSeconds = Math.max(
          0,
          Math.floor((now.getTime() - state.startDate.getTime()) / 1000)
        );
        return {
          elapsedSeconds: diffSeconds,
          formattedDuration: formatDuration(diffSeconds),
        };
      }

      const nextSeconds = state.elapsedSeconds + 1;
      return {
        elapsedSeconds: nextSeconds,
        formattedDuration: formatDuration(nextSeconds),
      };
    }),

  requestExitExam: () => set({ isConfirmExitOpen: true }),
  cancelExitExam: () => set({ isConfirmExitOpen: false }),

  finishExam: (now = new Date()) =>
    set((state) => {
      const finalSeconds = state.startDate
        ? Math.max(0, Math.floor((now.getTime() - state.startDate.getTime()) / 1000))
        : state.elapsedSeconds;

      return {
        isExamActive: false,
        isConfirmExitOpen: false,
        isSummaryOpen: true,
        endDate: now,
        elapsedSeconds: finalSeconds,
        formattedDuration: formatDuration(finalSeconds),
      };
    }),

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
