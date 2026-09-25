import { ViewStyle } from 'react-native';

interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  supplier: string;
  supplierLight: string;
  supplierDark: string;
  secondary: string;
  secondaryLight: string;
  success: string;
  successLight: string;
  successDark: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
}

interface ThemeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

interface ThemeShadows {
  sm: ThemeShadow;
  md: ThemeShadow;
  lg: ThemeShadow;
}

interface ThemeRadius {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface Theme {
  colors: ThemeColors;
  shadows: ThemeShadows;
  radius: ThemeRadius;
}

export const theme: Theme = {
  colors: {
    primary: '#4F46E5', // Indigo 600 - modern tech/commerce
    primaryLight: '#EEF2FF',
    primaryDark: '#3730A3',
    
    supplier: '#F59E0B', // Amber 500
    supplierLight: '#FEF3C7',
    supplierDark: '#B45309',

    secondary: '#0EA5E9', // Sky 500
    secondaryLight: '#E0F2FE',

    success: '#10B981', // Emerald 500
    successLight: '#ECFDF5',
    successDark: '#047857',

    warning: '#F59E0B',
    warningLight: '#FFFBEB',

    danger: '#EF4444',
    dangerLight: '#FEF2F2',

    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    
    textPrimary: '#0F172A', // Slate 900
    textSecondary: '#475569', // Slate 600
    textMuted: '#94A3B8', // Slate 400
    
    border: '#E2E8F0', // Slate 200
    borderLight: '#F1F5F9',
  },
  
  shadows: {
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    full: 9999,
  },
};
