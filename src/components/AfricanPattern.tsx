import React, { memo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Rect, G, Pattern, Defs, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const AfricanPattern = memo(() => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" style={{ opacity: 0.04 }}>
        <Defs>
          <Pattern id="african-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Geometric African Motif */}
            <Path
              d="M0 50 L50 0 L100 50 L50 100 Z"
              stroke="#4F46E5"
              strokeWidth="1.5"
              fill="none"
            />
            <Path
              d="M25 50 L50 25 L75 50 L50 75 Z"
              stroke="#4F46E5"
              strokeWidth="1"
              fill="none"
            />
            <Circle cx="50" cy="50" r="5" fill="#4F46E5" opacity="0.5" />
            <Path
              d="M10 10 L30 10 M70 10 L90 10 M10 90 L30 90 M70 90 L90 90"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Zig-Zag accents */}
            <Path
              d="M0 20 L10 10 L20 20 M80 20 L90 10 L100 20"
              stroke="#0EA5E9"
              strokeWidth="1"
              fill="none"
            />
            <Path
              d="M0 80 L10 90 L20 80 M80 80 L90 90 L100 80"
              stroke="#0EA5E9"
              strokeWidth="1"
              fill="none"
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#african-pattern)" />

        {/* Decorative corner accents */}
        <G opacity={0.05} transform={`translate(${width - 150}, -50)`}>
          <Path
            d="M 0 100 Q 75 0 150 100"
            fill="none"
          />
        </G>
        <G opacity={0.1} transform={`translate(-50, ${height - 150})`}>
          <Path
            d="M 0 0 Q 75 100 150 0"
            fill="none"
            stroke="#FFF"
            strokeWidth="20"
          />
        </G>
      </Svg>
    </View>
  );
});

export default AfricanPattern;
