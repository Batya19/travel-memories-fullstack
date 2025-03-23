import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// הגדרת קונפיגורציה בסיסית
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e6f1ff',
      100: '#b8d6ff',
      200: '#8abaff',
      300: '#5c9fff',
      400: '#2e83ff',
      500: '#1569e5', // צבע עיקרי של המותג
      600: '#0d52b8',
      700: '#073b8c',
      800: '#03255f',
      900: '#001034',
    },
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: { colorScheme: string }) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          },
        }),
      },
    },
  },
});

export default theme;