import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GeoGebraTheme } from '@/theme/tokens';
import { useExamStore } from '@/stores/useExamStore';

interface StartExamDialogProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * StartExamDialog matches WhatsApp Image 2026-10-31 at 10.48.05 PM.jpeg
 */
export const StartExamDialog: React.FC<StartExamDialogProps> = ({ visible, onCancel, onConfirm }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay} testID="start-exam-dialog">
      <View style={styles.dialogCard}>
        <Text style={styles.title}>Iniciar Examen</Text>
        <Text style={styles.message}>
          El Registro de examen muestra la información del reloj durante la prueba.
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity testID="btn-cancel-start" onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancela</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="btn-confirm-start" onPress={onConfirm} style={styles.confirmBtn}>
            <Text style={styles.confirmText}>Comenzar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pinned app toast indication */}
      <View style={styles.toastCard}>
        <Text style={styles.toastText}>Esta aplicación está fijada</Text>
      </View>
    </View>
  );
};

interface ExitExamDialogProps {
  visible: boolean;
  onCancel: () => void;
  onConfirmExit: () => void;
}

/**
 * ExitExamDialog matches WhatsApp Image 2026-10-31 at 10.46.04 PM (2).jpeg
 */
export const ExitExamDialog: React.FC<ExitExamDialogProps> = ({ visible, onCancel, onConfirmExit }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay} testID="exit-exam-dialog">
      <View style={styles.dialogCard}>
        <Text style={styles.messageBold}>
          ¿Estás seguro que quieres salir del modo Examen?
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity testID="btn-cancel-exit" onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancela</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="btn-confirm-exit" onPress={onConfirmExit} style={styles.exitBtn}>
            <Text style={styles.confirmText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

interface ExamOkDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

/**
 * ExamOkDialog matches WhatsApp Image 2026-10-31 at 10.48.05 PM (1).jpeg
 */
export const ExamOkDialog: React.FC<ExamOkDialogProps> = ({ visible, onDismiss }) => {
  const formattedDuration = useExamStore((state) => state.formattedDuration);
  const startDate = useExamStore((state) => state.startDate);
  const endDate = useExamStore((state) => state.endDate);

  if (!visible) return null;

  const formatTime = (date: Date | null) => {
    if (!date) return '22:44:20';
    return date.toTimeString().split(' ')[0];
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '31 Octubre 2026';
    const day = date.getDate();
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <View style={styles.overlay} testID="exam-ok-dialog">
      <View style={styles.summaryCard}>
        {/* Emerald Green Header */}
        <View style={styles.summaryHeader}>
          <Text style={styles.summarySub}>Calculadora Gráfica GeoGebra</Text>
          <Text style={styles.summaryTitle}>Examen: OK</Text>
        </View>

        {/* Body with stats */}
        <View style={styles.summaryBody}>
          <Text style={styles.teacherInstruction}>Muestra esta pantalla a tu profesor</Text>

          <View style={styles.statGroup}>
            <Text style={styles.statLabel}>Duración</Text>
            <Text style={styles.statValue}>{formattedDuration}</Text>
          </View>

          <View style={styles.statGroup}>
            <Text style={styles.statLabel}>Fecha</Text>
            <Text style={styles.statValue}>{formatDate(startDate)}</Text>
          </View>

          <View style={styles.statGroup}>
            <Text style={styles.statLabel}>Hora de inicio</Text>
            <Text style={styles.statValue}>{formatTime(startDate)}</Text>
          </View>

          <View style={styles.statGroup}>
            <Text style={styles.statLabel}>Hora de finalización</Text>
            <Text style={styles.statValue}>{formatTime(endDate)}</Text>
          </View>

          <View style={styles.okButtonContainer}>
            <TouchableOpacity testID="btn-dismiss-ok" onPress={onDismiss} style={styles.exitBtn}>
              <Text style={styles.confirmText}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 999,
  },
  dialogCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: GeoGebraTheme.radii.dialog,
    padding: 24,
    elevation: GeoGebraTheme.elevation.dialog,
  },
  title: {
    fontSize: GeoGebraTheme.typography.sizes.dialogTitle,
    fontWeight: GeoGebraTheme.typography.weights.medium,
    color: GeoGebraTheme.colors.textPrimary,
    marginBottom: 16,
  },
  message: {
    fontSize: GeoGebraTheme.typography.sizes.bodyText,
    color: GeoGebraTheme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  messageBold: {
    fontSize: 16,
    color: GeoGebraTheme.colors.textPrimary,
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelText: {
    color: GeoGebraTheme.colors.primaryPurple,
    fontSize: 14,
    fontWeight: GeoGebraTheme.typography.weights.semibold,
  },
  confirmBtn: {
    backgroundColor: GeoGebraTheme.colors.primaryPurple,
    borderRadius: GeoGebraTheme.radii.button,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  exitBtn: {
    backgroundColor: GeoGebraTheme.colors.primaryPurple,
    borderRadius: GeoGebraTheme.radii.button,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: GeoGebraTheme.typography.weights.semibold,
  },
  toastCard: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  // Summary Dialog (Green Header)
  summaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: GeoGebraTheme.radii.dialog,
    overflow: 'hidden',
    elevation: GeoGebraTheme.elevation.dialog,
  },
  summaryHeader: {
    backgroundColor: GeoGebraTheme.colors.examHeaderBg,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  summarySub: {
    color: GeoGebraTheme.colors.examTextOnGreen,
    fontSize: 13,
    marginBottom: 4,
    opacity: 0.9,
  },
  summaryTitle: {
    color: GeoGebraTheme.colors.examTextOnGreen,
    fontSize: 22,
    fontWeight: GeoGebraTheme.typography.weights.bold,
  },
  summaryBody: {
    padding: 24,
  },
  teacherInstruction: {
    fontSize: 16,
    fontWeight: GeoGebraTheme.typography.weights.medium,
    color: GeoGebraTheme.colors.textPrimary,
    marginBottom: 20,
  },
  statGroup: {
    marginBottom: 14,
  },
  statLabel: {
    fontSize: 12,
    color: GeoGebraTheme.colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: GeoGebraTheme.typography.weights.medium,
    color: GeoGebraTheme.colors.textPrimary,
  },
  okButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
});
