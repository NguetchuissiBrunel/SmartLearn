export const Colors = {
  primary: '#4F46E5',    // Indigo (Vibrant primary)
  secondary: '#0EA5E9',  // Sky blue (Accents/Secondary)
  accent: '#F59E0B',     // Amber for highlights/badges
  background: '#F8FAFC', // Slate 50 (Very light gray/blue)
  text: '#0F172A',       // Slate 900 (Dark for contrast)
  textSecondary: '#64748B', // Slate 500
  border: '#E2E8F0',     // Slate 200
  success: '#10B981',    // Emerald 500
  error: '#EF4444',      // Red 500
  surface: '#FFFFFF',    // White for cards
  gradientStart: '#4F46E5',
  gradientEnd: '#3B82F6',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  h1: {
    fontSize: 34,
    fontWeight: '900' as '900',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '800' as '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as '700',
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
};
