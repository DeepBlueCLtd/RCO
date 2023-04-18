import { defaultTheme } from 'react-admin'
export const rcoTheme = {
  ...defaultTheme,
  palette: {
    primary: {
      main: '#1F3860'
    },
    secondary: {
      main: '#1F3860'
    }
  },
  components: {
    ...defaultTheme.components,
    RaShow: {
      styleOverrides: {
        root: {
          '& .Mui-disabled': {
            background: '#fff !important',
            color: 'rgba(0, 0, 0, 0.6) !important'
          },
          '& .MuiInputBase-input': {
            WebkitTextFillColor: 'rgba(0, 0, 0) !important'
          }
        }
      }
    }
  }
}
