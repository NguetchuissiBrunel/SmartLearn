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
          <View style={styles.outerBadge}>
            <View style={styles.innerBadge}>
              <GraduationCap size={70} color={Colors.primary} strokeWidth={2.5} />
            </View>
            <View style={styles.goldRing} />
          </View>
        </Animated.View>

        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            alignItems: 'center'
          }}
        >
          <Text style={styles.title}>SMARTLearn</Text>
          <View style={styles.taglineBox}>
            <Text style={styles.subtitle}>L'EXCELLENCE PAR L'IA</Text>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.version}>PREMIUM COMPETITION EDITION</Text>
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
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerBadge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  innerBadge: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  goldRing: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 72.5,
    borderWidth: 2,
    borderColor: '#F59E0B',
    opacity: 0.6,
  },
  title: {
    ...Typography.h1,
    color: '#FFF',
    fontSize: 48,
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  taglineBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  subtitle: {
    ...Typography.caption,
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 3,
  },
  footer: {
    position: 'absolute',
    bottom: -height * 0.25,
    alignItems: 'center',
  },
  version: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
});

export default SplashScreen;
