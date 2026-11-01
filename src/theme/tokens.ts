/**
 * GeoGebra Android Reference Design Tokens
 * Extracted directly from reference screenshots in assets/
 */
export const GeoGebraTheme = {
  colors: {
    // Modo Normal (Material 3 GeoGebra Light)
    primaryPurple: '#695BD4',
    primaryPurpleLight: '#A08FFF',
    purplePillBg: '#E8E5FF',
    appBarBg: '#FFFFFF',
    canvasBg: '#FFFFFF',
    gridLines: '#E2E2E6',
    axesLines: '#2A2A2A',
    textPrimary: '#1F1F1F',
    textSecondary: '#5F6368',
    bottomNavBg: '#F8F9FA',
    bottomNavInactive: '#5F6368',
    keyboardBg: '#F3F4F8',
    keyBg: '#FFFFFF',
    keyActionBg: '#E3E4E8',
    keyText: '#1F1F1F',
    borderLight: '#E0E0E0',

    // Modo Examen (Header y banners institucionales)
    examHeaderBg: '#008476',
    examHeaderDark: '#02332D',
    examHeaderBorder: '#005D53',
    examNavBg: '#004D40',
    examNavActivePill: '#00695C',
    examTextOnGreen: '#FFFFFF',
  },
  typography: {
    sizes: {
      appBarTitle: 18,
      drawerTitle: 20,
      dialogTitle: 20,
      bodyText: 15,
      labelText: 12,
      keyboardKey: 20,
      keyLabelSmall: 13,
      axisLabel: 11,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  radii: {
    dialog: 24,
    button: 20,
    keyboardKey: 8,
    bottomSheetTop: 16,
    activeTabPill: 16,
  },
  elevation: {
    header: 2,
    dialog: 6,
    keyboard: 4,
  },
} as const;

export type ThemeColors = typeof GeoGebraTheme.colors;
