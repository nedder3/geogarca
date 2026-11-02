import { useExamStore } from '../useExamStore';

describe('useExamStore', () => {
  beforeEach(() => {
    useExamStore.getState().reset();
  });

  it('should initialize with normal non-exam state', () => {
    const state = useExamStore.getState();
    expect(state.isExamActive).toBe(false);
    expect(state.elapsedSeconds).toBe(0);
    expect(state.formattedDuration).toBe('00:00');
    expect(state.startDate).toBeNull();
    expect(state.endDate).toBeNull();
    expect(state.isSummaryOpen).toBe(false);
  });

  it('should transition to exam active state on startExam', () => {
    const now = new Date('2026-10-31T22:44:20');
    useExamStore.getState().startExam(now);

    const state = useExamStore.getState();
    expect(state.isExamActive).toBe(true);
    expect(state.startDate).toEqual(now);
    expect(state.elapsedSeconds).toBe(0);
  });

  it('should compute elapsed time based on wall-clock difference when tick() is called', () => {
    const start = new Date('2026-10-31T20:00:00.000Z');
    useExamStore.getState().startExam(start);

    // Simulate 25 minutes passing while app was in background or running
    const later = new Date('2026-10-31T20:25:00.000Z');
    useExamStore.getState().tick(later);

    const state = useExamStore.getState();
    expect(state.elapsedSeconds).toBe(1500); // 25 * 60
    expect(state.formattedDuration).toBe('25:00');
  });

  it('should support explicit seconds in tick() for backwards compatibility', () => {
    useExamStore.getState().startExam();
    useExamStore.getState().tick(63); // 1 minute 3 seconds

    const state = useExamStore.getState();
    expect(state.elapsedSeconds).toBe(63);
    expect(state.formattedDuration).toBe('01:03');
  });

  it('should guarantee mathematical congruence between startDate, endDate and duration on finishExam', () => {
    const start = new Date('2026-10-31T20:08:26.000Z');
    const end = new Date('2026-10-31T20:49:30.000Z'); // Exact values from user screenshot

    useExamStore.getState().startExam(start);
    // Notice: NO tick() was called (e.g. app was locked/in background the entire time)
    useExamStore.getState().finishExam(end);

    const state = useExamStore.getState();
    expect(state.isExamActive).toBe(false);
    expect(state.endDate).toEqual(end);
    expect(state.isSummaryOpen).toBe(true);
    // 41 minutes and 4 seconds = 2464 seconds
    expect(state.elapsedSeconds).toBe(2464);
    expect(state.formattedDuration).toBe('41:04');
  });

  it('should format duration with hours if exam exceeds 60 minutes', () => {
    const start = new Date('2026-10-31T10:00:00.000Z');
    const end = new Date('2026-10-31T11:15:30.000Z');

    useExamStore.getState().startExam(start);
    useExamStore.getState().finishExam(end);

    const state = useExamStore.getState();
    expect(state.formattedDuration).toBe('01:15:30');
  });

  it('should close summary dialog on dismissSummary', () => {
    useExamStore.getState().startExam();
    useExamStore.getState().finishExam();
    expect(useExamStore.getState().isSummaryOpen).toBe(true);

    useExamStore.getState().dismissSummary();
    expect(useExamStore.getState().isSummaryOpen).toBe(false);
  });
});
