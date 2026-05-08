import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography } from '../constants/theme';
import AfricanPattern from '../components/AfricanPattern';
import { GraduationCap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Registration');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={styles.container}
    >
      <AfricanPattern />
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.logoContainer,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.iconCircle}>
            <GraduationCap size={60} color={Colors.primary} />
          </View>
        </Animated.View>

        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <Text style={styles.title}>SMARTLearn</Text>
          <Text style={styles.subtitle}>L'IA au service de l'éducation</Text>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.version}>v1.0 Premium Demo</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    ...Typography.h1,
    color: '#FFF',
    fontSize: 42,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: -height * 0.3,
    alignItems: 'center',
  },
  version: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default SplashScreen;
