import { type ListProps } from 'react-admin'
import React, { type ReactElement } from 'react'
import { Box, Typography } from '@mui/material'
import FlexBox from './FlexBox'

type Props = PartialBy<ListProps, 'children'>

const style = { fontSize: '12px' }

export function SignatureDetails(): React.ReactElement {
  return (
    <>
      <Box>
        <Typography {...style}>Name (printed):</Typography>
        <Typography {...style}>Signature:</Typography>
        <Typography {...style}>Date:</Typography>
        <Typography {...style}>Rank/Grade:</Typography>
      </Box>
    </>
  )
}
const sx = {
  flex: 1,
  border: '2px solid rgba(224, 224, 224, 1)',
  padding: '10px',
  minHeight: '168px',
  height: 'inherit'
}

export default function ReportSignature(props: Props): ReactElement {
  return (
    <FlexBox columnGap={0} alignItems='start'>
      <Box sx={sx}>
        <Typography {...style}>
          The {props.children} items listed above have been 100% mustered by:
        </Typography>
        <SignatureDetails />
      </Box>
      <FlexBox
        alignItems='start'
        sx={{
          ...sx,
          borderLeft: 'none'
        }}>
        <SignatureDetails />
      </FlexBox>
    </FlexBox>
  )
}
