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

  it('should increment elapsed seconds and format MM:SS correctly', () => {
    useExamStore.getState().startExam();
    useExamStore.getState().tick(63); // 1 minute 3 seconds

    const state = useExamStore.getState();
    expect(state.elapsedSeconds).toBe(63);
    expect(state.formattedDuration).toBe('01:03');
  });

  it('should finish exam, record end time and open summary dialog', () => {
    const start = new Date('2026-10-31T22:44:20');
    const end = new Date('2026-10-31T22:45:24');

    useExamStore.getState().startExam(start);
    useExamStore.getState().tick(64);
    useExamStore.getState().finishExam(end);

    const state = useExamStore.getState();
    expect(state.isExamActive).toBe(false);
    expect(state.endDate).toEqual(end);
    expect(state.isSummaryOpen).toBe(true);
    expect(state.formattedDuration).toBe('01:04');
  });

  it('should close summary dialog on dismissSummary', () => {
    useExamStore.getState().startExam();
    useExamStore.getState().finishExam();
    expect(useExamStore.getState().isSummaryOpen).toBe(true);

    useExamStore.getState().dismissSummary();
    expect(useExamStore.getState().isSummaryOpen).toBe(false);
  });
});
