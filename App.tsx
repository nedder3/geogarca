import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  BackHandler,
  Platform,
} from 'react-native';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import { BottomNavBar, MainTab } from '@/components/navigation/BottomNavBar';
import { NavigationDrawer } from '@/components/navigation/NavigationDrawer';
import { CartesianGrid } from '@/components/canvas/CartesianGrid';
import { VirtualKeyboard } from '@/components/keyboard/VirtualKeyboard';
import { AlgebraPanel } from '@/components/algebra/AlgebraPanel';
import { ToolsGallery } from '@/components/tools/ToolsGallery';
import {
  StartExamDialog,
  ExitExamDialog,
  ExamOkDialog,
} from '@/components/exam/ExamModals';
import { useExamStore } from '@/stores/useExamStore';
import { useInputStore } from '@/stores/useInputStore';

export default function App() {
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

  const windowWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top App Bar (Normal / Exam) */}
        <TopAppBar
          onOpenMenu={() => setDrawerOpen(true)}
          onOpenSettings={() => {}}
        />

        {/* Viewport - Upper Half: Cartesian Canvas */}
        <View style={styles.canvasContainer}>
          <CartesianGrid width={windowWidth} height={260} />
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

        {/* Navigation Drawer */}
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  canvasContainer: {
    height: 260,
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
