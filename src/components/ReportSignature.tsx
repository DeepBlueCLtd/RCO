import { type ListProps, Count } from 'react-admin'
import React, { type ReactElement } from 'react'
import { Box, Typography } from '@mui/material'
import * as constants from '../constants'
import FlexBox from './FlexBox'

type Props = PartialBy<ListProps, 'children'> & { id: number }

export function SignatureDetails(): React.ReactElement {
  return (
    <>
      <Box>
        <Typography>Name (printed):</Typography>
        <Typography>Signature:</Typography>
        <Typography>Date:</Typography>
        <Typography>Rank/Grade:</Typography>
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
  const { id } = props

  return (
    <FlexBox columnGap={0} alignItems='start'>
      <Box sx={sx}>
        <Typography>
          The{' '}
          {
            <Count
              resource={constants.R_ITEMS}
              sx={{ fontSize: '1rem' }}
              filter={{ vaultLocation: id }}
            />
          }{' '}
          items listed above have been 100%
        </Typography>
        <Typography>Mustered by:</Typography>
        <SignatureDetails />
      </Box>
      <FlexBox
        alignItems='end'
        sx={{
          ...sx,
          borderLeft: 'none'
        }}>
        <SignatureDetails />
      </FlexBox>
    </FlexBox>
  )
}
