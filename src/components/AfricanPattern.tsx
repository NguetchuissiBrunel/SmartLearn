import React, { memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Rect, G, Pattern, Defs, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const AfricanPattern = memo(() => {
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 0 }]} pointerEvents="none">
      <Svg width="100%" height="100%" style={{ opacity: 0.4 }}>
        <Defs>
          <Pattern id="african-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Bold Background Grid */}
            <Path
              d="M0 0 L100 100 M100 0 L0 100"
              stroke="#4F46E5"
              strokeWidth="0.5"
              opacity={0.3}
            />
            
            {/* High-Relief Geometric Motif */}
            <Path
              d="M50 5 L95 50 L50 95 L5 50 Z"
              stroke="#FFF"
              strokeWidth="4"
              fill="rgba(255, 255, 255, 0.05)"
            />
            
            {/* Native Symbol: The Eye / Sun */}
            <Circle cx="50" cy="50" r="15" stroke="#F59E0B" strokeWidth="5" fill="none" />
            <Circle cx="50" cy="50" r="8" fill="#F59E0B" />
            
            {/* Bogolan Zig-Zags - Thick and High Contrast */}
            <Path
              d="M0 20 L25 5 L50 20 L75 5 L100 20"
              stroke="#FFF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              opacity={0.8}
            />
            <Path
              d="M0 80 L25 95 L50 80 L75 95 L100 80"
              stroke="#FFF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              opacity={0.8}
            />
            
            {/* Decorative Dots in Gold */}
            <Circle cx="20" cy="50" r="5" fill="#F59E0B" />
            <Circle cx="80" cy="50" r="5" fill="#F59E0B" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#african-pattern)" />
      </Svg>
    </View>
  );
});

export default AfricanPattern;
