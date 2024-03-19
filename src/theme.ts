// theme.ts

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "dark", // 'dark' | 'light'
  useSystemColorMode: false,
};

// 3. Customize the theme colors for light mode
const customTheme = {
  
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'light' ? 'gray.100' : 'gray.800',
      },
    }),
  },
  fonts: {
    body: "Source Code Pro, monospace",
    heading: "Source Code Pro, monospace",
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700,
  },
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
    '8xl': '6rem', // 96px
    '9xl': '8rem', // 128px
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold', // Make button text bold
      },
    },
  },
};

// 4. extend the theme with custom configurations
const theme = extendTheme({ config, ...customTheme });

export default theme;
