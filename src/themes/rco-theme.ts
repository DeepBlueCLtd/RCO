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
            background: '#fff',
            color: 'rgba(0, 0, 0, 0.6)'
          },
          '& .MuiInputBase-input': {
            '-webkit-text-fill-color': 'rgba(0, 0, 0)'
          }
        }
      }
    }
  }
}
