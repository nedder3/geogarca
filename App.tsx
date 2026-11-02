import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  BackHandler,
  AppState,
  AppStateStatus,
  StatusBar as RNStatusBar,
} from 'react-native';
import * as Battery from 'expo-battery';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { GeoGebraTheme } from '@/theme/tokens';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import { BottomNavBar, MainTab, AppNavigationMode } from '@/components/navigation/BottomNavBar';
import { NavigationDrawer } from '@/components/navigation/NavigationDrawer';
import { CartesianGrid } from '@/components/canvas/CartesianGrid';
import { VirtualKeyboard } from '@/components/keyboard/VirtualKeyboard';
import { AlgebraPanel } from '@/components/algebra/AlgebraPanel';
import { ToolsGallery } from '@/components/tools/ToolsGallery';
import { TableView } from '@/components/table/TableView';
import { SpreadsheetView } from '@/components/spreadsheet/SpreadsheetView';
import { ProbabilityView } from '@/components/probability/ProbabilityView';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { SplashScreenView } from '@/components/splash/SplashScreenView';
import {
  StartExamDialog,
  ExitExamDialog,
  ExamOkDialog,
} from '@/components/exam/ExamModals';
import { useExamStore } from '@/stores/useExamStore';
import { useInputStore } from '@/stores/useInputStore';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appMode, setAppMode] = useState<AppNavigationMode>('probability');
  const [activeTab, setActiveTab] = useState<MainTab>('distribution');
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showProbabilityTable, setShowProbabilityTable] = useState(false);
  const [showCurveOverlay, setShowCurveOverlay] = useState(false);

  const isExamActive = useExamStore((state) => state.isExamActive);
  const isStartModalOpen = useExamStore((state) => state.isStartModalOpen);
  const isConfirmExitOpen = useExamStore((state) => state.isConfirmExitOpen);
  const isSummaryOpen = useExamStore((state) => state.isSummaryOpen);

  const openStartModal = useExamStore((state) => state.openStartModal);
  const closeStartModal = useExamStore((state) => state.closeStartModal);
  const startExam = useExamStore((state) => state.startExam);
  const tick = useExamStore((state) => state.tick);
  const requestExitExam = useExamStore((state) => state.requestExitExam);
  const cancelExitExam = useExamStore((state) => state.cancelExitExam);
  const finishExam = useExamStore((state) => state.finishExam);
  const dismissSummary = useExamStore((state) => state.dismissSummary);
  const setBatteryLevel = useExamStore((state) => state.setBatteryLevel);

  const isKeyboardVisible = useInputStore((state) => state.isKeyboardVisible);

  // Synchronize real hardware battery level and listen for changes
  useEffect(() => {
    let batterySub: Battery.Subscription | null = null;

    async function syncBattery() {
      try {
        const level = await Battery.getBatteryLevelAsync();
        if (typeof level === 'number' && level >= 0) {
          setBatteryLevel(Math.round(level * 100));
        }
      } catch {
        // Fallback gracefully on devices/environments without battery sensors
      }

      try {
        batterySub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
          if (typeof batteryLevel === 'number' && batteryLevel >= 0) {
            setBatteryLevel(Math.round(batteryLevel * 100));
          }
        });
      } catch {
        // Fallback
      }
    }

    syncBattery();

    return () => {
      batterySub?.remove();
    };
  }, [setBatteryLevel]);

  // Toggle Android native system status bar visibility to prevent double status bar in Exam Mode
  useEffect(() => {
    RNStatusBar.setHidden(isExamActive, 'fade');
  }, [isExamActive]);

  // Timer in live Exam Mode (Wall-Clock synced)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isExamActive) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExamActive, tick]);

  // Synchronize immediately with wall-clock time when app returns from background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && isExamActive) {
        tick();
      }
    });
    return () => subscription.remove();
  }, [isExamActive, tick]);

  // Handle hardware back button on Android during Exam Mode
  useEffect(() => {
    const onBackPress = () => {
      if (isExamActive) {
        requestExitExam();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => subscription.remove();
  }, [isExamActive, requestExitExam]);

  // Centralized sub-app navigation to prevent getting anchored
  const navigateToSubApp = (mode: AppNavigationMode) => {
    setAppMode(mode);
    if (mode === 'probability') {
      setActiveTab('distribution');
    } else {
      setActiveTab('algebra');
    }
  };

  const handleSelectDrawerOption = (optionId: string) => {
    setDrawerOpen(false);
    if (optionId === 'switch_probability') {
      navigateToSubApp('probability');
    } else if (optionId === 'switch_graphing') {
      navigateToSubApp('graphing');
    } else if (optionId === 'exam') {
      openStartModal();
    } else if (optionId === 'exit_exam') {
      requestExitExam();
    } else if (optionId === 'settings') {
      setIsSettingsOpen(true);
    }
  };

  const handleToggleCurve = () => {
    // Top bar curve icon switches between Calculadora Gráfica and Probabilidad
    if (appMode === 'graphing') {
      navigateToSubApp('probability');
    } else {
      navigateToSubApp('graphing');
    }
  };

  const handleToggleTable = () => {
    if (appMode === 'graphing') {
      setActiveTab('table');
    } else {
      setShowProbabilityTable((prev) => !prev);
    }
  };

  const windowDimensions = Dimensions.get('window');
  const windowWidth = windowDimensions.width;
  const windowHeight = windowDimensions.height;

  // Responsive canvas height for graphing mode
  const canvasHeight =
    isKeyboardVisible && activeTab === 'algebra'
      ? 200
      : Math.min(260, Math.floor(windowHeight * 0.32));

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.safeArea,
          isExamActive && { backgroundColor: GeoGebraTheme.colors.examHeaderDark },
        ]}
        edges={isExamActive ? ['bottom', 'left', 'right'] : ['top', 'bottom', 'left', 'right']}
      >
        <View style={styles.container}>
          {/* Top App Bar (Normal / Exam) */}
          <TopAppBar
            title="Suite Calculadora"
            isExamActive={isExamActive}
            showProbabilityActions={true}
            onOpenMenu={() => setDrawerOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleCurve={handleToggleCurve}
            onToggleTable={handleToggleTable}
          />

          {/* Main Viewport */}
          {appMode === 'probability' ? (
            <View style={styles.contentContainer}>
              <ProbabilityView
                showTable={showProbabilityTable}
                showCurveOverlay={showCurveOverlay}
              />
            </View>
          ) : (
            <>
              {/* Upper Half: Cartesian Canvas */}
              <View style={[styles.canvasContainer, { height: canvasHeight }]}>
                <CartesianGrid width={windowWidth} height={canvasHeight} />
              </View>

              {/* Lower Half: Tabbed Content */}
              <View style={styles.contentContainer}>
                {activeTab === 'algebra' && <AlgebraPanel />}
                {activeTab === 'tools' && <ToolsGallery />}
                {activeTab === 'table' && <TableView />}
                {activeTab === 'spreadsheet' && <SpreadsheetView />}
              </View>

              {/* Virtual Keyboard */}
              {isKeyboardVisible && activeTab === 'algebra' && <VirtualKeyboard />}
            </>
          )}

          {/* Bottom Navigation */}
          <BottomNavBar
            mode={appMode}
            activeTab={activeTab}
            onTabPress={setActiveTab}
          />

          {/* Navigation Drawer */}
          <NavigationDrawer
            title="Suite Calculadora GeoGebra"
            activeAppMode={appMode}
            visible={isDrawerOpen}
            onClose={() => setDrawerOpen(false)}
            onSelectOption={handleSelectDrawerOption}
          />

          {/* Exam Dialogs */}
          <StartExamDialog
            visible={isStartModalOpen}
            onCancel={closeStartModal}
            onConfirm={() => startExam()}
          />

          <ExitExamDialog
            visible={isConfirmExitOpen}
            onCancel={cancelExitExam}
            onConfirmExit={() => finishExam()}
          />

          <ExamOkDialog
            appName="Suite Calculadora GeoGebra"
            visible={isSummaryOpen}
            onDismiss={dismissSummary}
          />

          {/* Settings / Properties Modal */}
          <SettingsDialog
            visible={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />

          {/* Animated In-App Splash Screen */}
          {showSplash && (
            <SplashScreenView
              durationMs={1200}
              onFinish={() => setShowSplash(false)}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  canvasContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E6',
  },
  contentContainer: {
    flex: 1,
  },
});
