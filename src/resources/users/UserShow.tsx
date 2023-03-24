import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BooleanField, Show, TextField } from 'react-admin';

const ValueField = ({ label, children }: { label: string; children: any }): React.ReactElement => {
	return (
		<Typography fontWeight="bold">
			{label}: {children}
		</Typography>
	);
};

export default function UserShow(): React.ReactElement {
	return (
		<Show>
			<Card>
				<CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
					<ValueField label="Id">
						<TextField variant="h6" source="id" />
					</ValueField>
					<ValueField label="Name">
						<TextField variant="h6" source="name" />
					</ValueField>
					<ValueField label="Password">
						<TextField variant="h6" source="password" />
					</ValueField>
					<ValueField label="Admin Rights">
						<BooleanField source="adminRights" label="Admin Rights" />
					</ValueField>
				</CardContent>
			</Card>
		</Show>
	);
}
