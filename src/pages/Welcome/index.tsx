import React from 'react';
import { Box, Typography } from '@mui/material';
import AppIcon from '../../assets/rco_transparent.png';

export default function Welcome(): React.ReactElement {
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
				}}
			>
				<img src={AppIcon} style={{
					width: '228px',
					height: '228px'
				}} />
				<Typography variant="h1">&nbsp;Welcome to RCO</Typography>
			</Box>
		</>
	);
}
