import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import { BottomNavBar, MainTab } from '@/components/navigation/BottomNavBar';
import { NavigationDrawer } from '@/components/navigation/NavigationDrawer';
import { CartesianGrid } from '@/components/canvas/CartesianGrid';
import { VirtualKeyboard } from '@/components/keyboard/VirtualKeyboard';
import { AlgebraPanel } from '@/components/algebra/AlgebraPanel';
import { ToolsGallery } from '@/components/tools/ToolsGallery';
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
  const [activeTab, setActiveTab] = useState<MainTab>('algebra');
  const [isDrawerOpen, setDrawerOpen] = useState(false);

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
    if (optionId === 'exam') {
      openStartModal();
    } else if (optionId === 'exit_exam') {
      requestExitExam();
    }
  };

  const windowDimensions = Dimensions.get('window');
  const windowWidth = windowDimensions.width;
  const windowHeight = windowDimensions.height;

  // Responsive canvas height: smaller when keyboard is up to let algebra list breathe
  const canvasHeight = isKeyboardVisible && activeTab === 'algebra' ? 200 : Math.min(260, Math.floor(windowHeight * 0.32));

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top App Bar (Normal / Exam) */}
          <TopAppBar
            onOpenMenu={() => setDrawerOpen(true)}
            onOpenSettings={() => {}}
          />

          {/* Viewport - Upper Half: Cartesian Canvas */}
          <View style={[styles.canvasContainer, { height: canvasHeight }]}>
            <CartesianGrid width={windowWidth} height={canvasHeight} />
          </View>

          {/* Viewport - Lower Half: Tabbed Content */}
          <View style={styles.contentContainer}>
            {activeTab === 'algebra' && <AlgebraPanel />}
            {activeTab === 'tools' && <ToolsGallery />}
            {activeTab === 'table' && <View style={styles.emptyView} />}
            {activeTab === 'spreadsheet' && <View style={styles.emptyView} />}
          </View>

          {/* Virtual Keyboard */}
          {isKeyboardVisible && activeTab === 'algebra' && <VirtualKeyboard />}

          {/* Bottom Navigation */}
          <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />

          {/* Navigation Drawer (renders on top of everything) */}
          <NavigationDrawer
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
