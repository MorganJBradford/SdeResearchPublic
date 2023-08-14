import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    primaryPalette: {
      darkColor: string,
      lightColor: string,
      lighterColor: string,
      blueColor: string,
    },
  }

  interface PaletteOptions {
    primaryPalette: {
      darkColor: string,
      lightColor: string,
      lighterColor: string,
      blueColor: string,
    },
  }
}
