import { Box, type BoxProps, Typography } from '@mui/material'

interface Props extends BoxProps {
  title: string
}

export default function FieldSet(props: Props): React.ReactElement {
  const { title, children, ...rest } = props
  return (
    <Box
      component='fieldset'
      sx={{
        width: '100%',
        padding: '0 15px',
        borderRadius: 6,
        margin: '20px 10px',
        flex: 1
      }}
      {...rest}>
      {title && (
        <legend>
          <Typography variant='h5' align='center' sx={{ fontWeight: '600' }}>
            {title}
          </Typography>
        </legend>
      )}
      {children}
    </Box>
  )
}
