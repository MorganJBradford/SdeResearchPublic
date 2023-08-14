import { createTheme, ThemeProvider } from '@mui/material/styles'

type ThemeProps = {
  children: JSX.Element
};

export enum themePalette {
  DARK_COLOR = '#24384A',
  LIGHT_COLOR = '#BBBCD3',
  LIGHTER_COLOR = '#EAF1F6',
  BLUE_COLOR = '#2659BF'
}

const customTheme = createTheme({
  palette: {
    primaryPalette: {
      darkColor: themePalette.DARK_COLOR,
      lightColor: themePalette.LIGHT_COLOR,
      lighterColor: themePalette.LIGHTER_COLOR,
      blueColor: themePalette.BLUE_COLOR
    },
  },
  typography: {
    h1: {
      fontWeight: 'bold',
      fontSize: '44px',
      lineHeight: '1.3'
    },
    h2: {
      fontWeight: 'bold',
      fontSize: '36px',
      lineHeight: '1.3'
    },
    h3: {
      fontWeight: 'bold',
      fontSize: '28px',
      lineHeight: '1.3'
    },
    h4: {
      fontWeight: 'bold',
      fontSize: '24px',
      lineHeight: '1.3'
    },
    h5: {
      fontWeight: 'bold',
      fontSize: '20px',
      lineHeight: '1.3'
    },
    h6: {
      fontWeight: 'bold',
      fontSize: '16px',
      lineHeight: '1.3'
    },
  }
});

export const ThemeConfig: React.FC<ThemeProps> = ({ children }) => {
  return (
    <ThemeProvider theme={customTheme}>
      {children}
    </ThemeProvider>
  )
}
