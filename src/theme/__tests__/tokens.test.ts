import { GeoGebraTheme } from '@/theme/tokens';

describe('GeoGebra Theme Tokens', () => {
  it('should have exact brand purple extracted from assets', () => {
    expect(GeoGebraTheme.colors.primaryPurple).toBe('#695BD4');
    expect(GeoGebraTheme.colors.primaryPurpleLight).toBe('#A08FFF');
    expect(GeoGebraTheme.colors.purplePillBg).toBe('#E8E5FF');
  });

  it('should have exact exam emerald green extracted from assets', () => {
    expect(GeoGebraTheme.colors.examHeaderBg).toBe('#008476');
    expect(GeoGebraTheme.colors.examHeaderDark).toBe('#02332D');
  });

  it('should specify appropriate border radii for Android Material 3 components', () => {
    expect(GeoGebraTheme.radii.dialog).toBe(24);
    expect(GeoGebraTheme.radii.button).toBe(20);
    expect(GeoGebraTheme.radii.keyboardKey).toBe(8);
  });
});
