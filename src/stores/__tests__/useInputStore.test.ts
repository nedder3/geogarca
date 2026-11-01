import { useInputStore } from '../useInputStore';

describe('useInputStore', () => {
  beforeEach(() => {
    useInputStore.getState().reset();
  });

  it('should initialize with empty expression and tab 123 active', () => {
    const state = useInputStore.getState();
    expect(state.expression).toBe('');
    expect(state.activeTab).toBe('123');
    expect(state.isKeyboardVisible).toBe(false);
  });

  it('should append text to expression', () => {
    useInputStore.getState().insertText('x');
    useInputStore.getState().insertText('^2');
    useInputStore.getState().insertText('+');
    useInputStore.getState().insertText('4');

    expect(useInputStore.getState().expression).toBe('x^2+4');
  });

  it('should delete previous character on backspace', () => {
    useInputStore.getState().insertText('1');
    useInputStore.getState().insertText('2');
    useInputStore.getState().insertText('3');
    useInputStore.getState().backspace();

    expect(useInputStore.getState().expression).toBe('12');
  });

  it('should switch active keyboard tab', () => {
    useInputStore.getState().setActiveTab('f(x)');
    expect(useInputStore.getState().activeTab).toBe('f(x)');

    useInputStore.getState().setActiveTab('abc');
    expect(useInputStore.getState().activeTab).toBe('abc');
  });

  it('should toggle keyboard visibility', () => {
    useInputStore.getState().setKeyboardVisible(true);
    expect(useInputStore.getState().isKeyboardVisible).toBe(true);

    useInputStore.getState().setKeyboardVisible(false);
    expect(useInputStore.getState().isKeyboardVisible).toBe(false);
  });
});
