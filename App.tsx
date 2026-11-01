import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  BackHandler,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import { BottomNavBar, MainTab, AppNavigationMode } from '@/components/navigation/BottomNavBar';
import { NavigationDrawer } from '@/components/navigation/NavigationDrawer';
import { CartesianGrid } from '@/components/canvas/CartesianGrid';
import { VirtualKeyboard } from '@/components/keyboard/VirtualKeyboard';
import { AlgebraPanel } from '@/components/algebra/AlgebraPanel';
import { ToolsGallery } from '@/components/tools/ToolsGallery';
import { ProbabilityView } from '@/components/probability/ProbabilityView';
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

  const isKeyboardVisible = useInputStore((state) => state.isKeyboardVisible);

  // Timer in live Exam Mode
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

  const handleSelectDrawerOption = (optionId: string) => {
    setDrawerOpen(false);
    if (optionId === 'switch_probability') {
      setAppMode('probability');
      setActiveTab('distribution');
    } else if (optionId === 'switch_graphing') {
      setAppMode('graphing');
      setActiveTab('algebra');
    } else if (optionId === 'exam') {
      openStartModal();
    } else if (optionId === 'exit_exam') {
      requestExitExam();
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top App Bar (Normal / Exam) */}
          <TopAppBar
            title="Suite Calculadora"
            showProbabilityActions={appMode === 'probability'}
            onOpenMenu={() => setDrawerOpen(true)}
            onOpenSettings={() => {}}
            onToggleCurve={() => setShowCurveOverlay((prev) => !prev)}
            onToggleTable={() => setShowProbabilityTable((prev) => !prev)}
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
                {activeTab === 'table' && <View style={styles.emptyView} />}
                {activeTab === 'spreadsheet' && <View style={styles.emptyView} />}
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
  emptyView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
