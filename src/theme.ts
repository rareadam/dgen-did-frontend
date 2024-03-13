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
};

// 4. extend the theme with custom configurations
const theme = extendTheme({ config, ...customTheme });

export default theme;
