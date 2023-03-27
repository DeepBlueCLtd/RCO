import React from 'react';
import { Box, Typography } from '@mui/material';

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
				<Typography variant="h1">Welcome</Typography>
			</Box>
		</>
	);
}
