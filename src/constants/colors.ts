export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#45B7D1',
  warning: '#FFA07A',
  success: '#98D8C8',
  background: '#F7F7F7',
  white: '#FFFFFF',
  black: '#2C3E50',
  gray: '#95A5A6',
  lightGray: '#ECF0F1',
  darkGray: '#7F8C8D',
  
  // Category colors
  food: '#FF6B6B',
  shopping: '#4ECDC4',
  transport: '#45B7D1',
  entertainment: '#FFA07A',
  health: '#98D8C8',
  education: '#DDA0DD',
  travel: '#20B2AA',
  bills: '#F0E68C',
  other: '#D3D3D3',
  
  // Chart colors
  chartColors: [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#DDA0DD',
    '#20B2AA',
    '#F0E68C',
    '#D3D3D3',
    '#FFB6C1',
    '#87CEEB',
    '#F4A460',
    '#98FB98',
    '#DDA0DD',
    '#F0E68C'
  ]
};

export const THEME = {
  colors: COLORS,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
