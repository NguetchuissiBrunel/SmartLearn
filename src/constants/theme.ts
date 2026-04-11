export const Colors = {
  primary: '#FFFFFF',    // White
  secondary: '#0056D2',  // Blue (Education feel)
  accent: '#000000',     // Black
  background: '#F8F9FA', // Off-white for better readability
  text: '#1A1A1A',
  textSecondary: '#4A4A4A',
  border: '#E5E5E5',
  success: '#28A745',
  error: '#DC3545',
  surface: '#FFFFFF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  h1: {
    fontSize: 28 as number,
    fontWeight: 'bold' as 'bold',
    color: Colors.accent,
  },
  h2: {
    fontSize: 22 as number,
    fontWeight: 'bold' as 'bold',
    color: Colors.accent,
  },
  body: {
    fontSize: 16 as number,
    color: Colors.text,
  },
  caption: {
    fontSize: 14 as number,
    color: Colors.textSecondary,
  },
};
