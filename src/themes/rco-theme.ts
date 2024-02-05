import { defaultTheme } from 'react-admin'
const isDevelopment = process.env.VAL_DEV === 'true'
export const rcoTheme = {
  ...defaultTheme,
  palette: {
    primary: {
      main: isDevelopment ? '#940202' : '#1F3860'
    },
    secondary: {
      main: isDevelopment ? '#940202' : '#1F3860'
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
    },
    RaDatagrid: {
      styleOverrides: {
        root: {
          '& .RaDatagrid-headerCell': {
            fontWeight: 'bold',
            fontSize: '16px'
          }
        }
      }
    }
  }
}
