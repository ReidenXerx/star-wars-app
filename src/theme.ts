// theme.ts
import { createTheme } from '@mui/material/styles'
import { deepPurple, amber } from '@mui/material/colors'

declare module '@mui/material/styles' {
  interface TypeText {
    pink: string
  }

  interface Palette {
    text: TypeText
  }

  interface PaletteOptions {
    text?: Partial<TypeText>
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark', // Set the theme mode to dark
    primary: {
      main: deepPurple[500],
    },
    secondary: {
      main: amber[500],
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
      pink: '#ff4081',
    },
  },
  typography: {
    h3: {
      fontFamily: 'Star Jedi, Arial, sans-serif',
      fontWeight: 700,
    },
    body2: {
      fontSize: 14,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: '#1d1d1d',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#ffffff',
        },
      },
    },
  },
})

export default theme
