import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

interface Props {
  onFinish?: () => void;
  durationMs?: number;
}

/**
 * SplashScreenView replicates the exact launch screen from
 * WhatsApp Image 2026-10-31 at 10.48.04 PM.jpeg
 */
export const SplashScreenView: React.FC<Props> = ({ onFinish, durationMs = 1500 }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onFinish?.();
      });
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, fadeAnim, onFinish]);

  return (
    <Animated.View testID="splash-screen-view" style={[styles.container, { opacity: fadeAnim }]}>
      <Image
        source={require('../../../assets/splash.png')}
        style={styles.splashImage}
        resizeMode="contain"
        testID="splash-image"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    elevation: 10000,
  },
  splashImage: {
    width: '75%',
    height: '75%',
  },
});
