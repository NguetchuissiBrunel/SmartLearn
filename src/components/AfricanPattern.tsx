import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Rect, G, Pattern } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

/**
 * AfricanPattern - A premium geometric background inspired by Bogolan and geometric patterns.
 * Uses SVG for sharp, scalable, and lightweight decoration.
 */
const AfricanPattern = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <G opacity={0.03}>
          {/* Main pattern repeat */}
          <Pattern
            id="bogolan"
            patternUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100"
            height="100"
            viewBox="0 0 100 100"
          >
            {/* Geometric diamond */}
            <Path
              d="M 50 10 L 90 50 L 50 90 L 10 50 Z"
              fill="none"
              stroke="#000"
              strokeWidth="2"
            />
            {/* Inner cross */}
            <Path
              d="M 50 10 L 50 90 M 10 50 L 90 50"
              stroke="#000"
              strokeWidth="2"
            />
            {/* Small dots */}
            <Rect x="48" y="28" width="4" height="4" fill="#000" />
            <Rect x="48" y="68" width="4" height="4" fill="#000" />
            <Rect x="28" y="48" width="4" height="4" fill="#000" />
            <Rect x="68" y="48" width="4" height="4" fill="#000" />
          </Pattern>
          
          <Rect width="100%" height="100%" fill="url(#bogolan)" />
        </G>
        
        {/* Decorative corner accents */}
        <G opacity={0.05} transform={`translate(${width - 150}, -50)`}>
           <Path
            d="M 0 100 Q 75 0 150 100"
            fill="none"
            stroke="#003366"
            strokeWidth="20"
          />
        </G>
        <G opacity={0.05} transform={`translate(-50, ${height - 150})`}>
           <Path
            d="M 0 0 Q 75 100 150 0"
            fill="none"
            stroke="#003366"
            strokeWidth="20"
          />
        </G>
      </Svg>
    </View>
  );
};

export default AfricanPattern;
