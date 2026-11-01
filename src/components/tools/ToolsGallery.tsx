import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GeoGebraTheme } from '@/theme/tokens';

export interface ToolItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface ToolCategory {
  title: string;
  tools: ToolItem[];
}

interface ToolsGalleryProps {
  onSelectTool?: (toolId: string) => void;
  activeToolId?: string;
}

/**
 * ToolsGallery matches the categories and tools from WhatsApp Image 2026-10-31 at 10.48.04 PM (1).jpeg
 */
export const ToolsGallery: React.FC<ToolsGalleryProps> = ({ onSelectTool, activeToolId }) => {
  const categories: ToolCategory[] = [
    {
      title: 'Herramientas básicas',
      tools: [
        { id: 'move', name: 'Mueve', icon: 'navigate-outline' },
        { id: 'point', name: 'Punto', icon: 'radio-button-on-outline' },
        { id: 'slider', name: 'Deslizador', icon: 'remove-outline' },
        { id: 'intersect', name: 'Intersección', icon: 'close-outline' },
        { id: 'extremum', name: 'Extremos', icon: 'pulse-outline' },
        { id: 'roots', name: 'Raíces', icon: 'trending-up-outline' },
        { id: 'fit_line', name: 'Ajuste lineal', icon: 'git-commit-outline' },
      ],
    },
    {
      title: 'Edición',
      tools: [
        { id: 'select', name: 'Seleccionar\nobjetos', icon: 'scan-outline' },
        { id: 'pan_view', name: 'Desplaza Vista\nGráfica', icon: 'move-outline' },
        { id: 'delete', name: 'Borrar', icon: 'trash-outline' },
        { id: 'show_label', name: 'Mostrar/\nocultar\netiqueta', icon: 'text-outline' },
      ],
    },
  ];

  return (
    <ScrollView testID="tools-gallery" style={styles.container}>
      {categories.map((cat) => (
        <View key={cat.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{cat.title}</Text>
          <View style={styles.grid}>
            {cat.tools.map((t) => {
              const isSelected = activeToolId === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  testID={`tool-${t.id}`}
                  onPress={() => onSelectTool?.(t.id)}
                  style={[styles.toolCard, isSelected && styles.toolCardSelected]}
                >
                  <View style={[styles.iconWrapper, isSelected && styles.iconWrapperSelected]}>
                    <Ionicons
                      name={t.icon}
                      size={24}
                      color={isSelected ? GeoGebraTheme.colors.primaryPurple : GeoGebraTheme.colors.textPrimary}
                    />
                  </View>
                  <Text style={styles.toolName} numberOfLines={3} textBreakStrategy="simple">
                    {t.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <TouchableOpacity testID="more-tools-button" style={styles.moreButton}>
        <Text style={styles.moreButtonText}>MÁS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: GeoGebraTheme.typography.weights.semibold,
    color: GeoGebraTheme.colors.textPrimary,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  toolCard: {
    width: '21%',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolCardSelected: {
    opacity: 0.9,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconWrapperSelected: {
    backgroundColor: GeoGebraTheme.colors.purplePillBg,
  },
  toolName: {
    fontSize: 11,
    color: GeoGebraTheme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
  },
  moreButton: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GeoGebraTheme.colors.borderLight,
    marginBottom: 32,
    marginTop: 8,
  },
  moreButtonText: {
    fontSize: 13,
    fontWeight: GeoGebraTheme.typography.weights.semibold,
    color: GeoGebraTheme.colors.textSecondary,
  },
});
