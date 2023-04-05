import { Box, type BoxProps } from '@mui/material'

const FlexBox = (props: BoxProps): React.ReactElement => {
  const { children, ...rest } = props
  return (
    <Box
      display='flex'
      width='100%'
      alignItems='center'
      columnGap='20px'
      {...rest}>
      {children}
    </Box>
  )
}

export default FlexBox
