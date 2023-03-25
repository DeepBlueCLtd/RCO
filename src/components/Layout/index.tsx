import React from 'react';
import { Login } from '@mui/icons-material';
import { Box, Icon } from '@mui/material';
import { type Theme } from '@mui/system';
import { makeStyles } from '@mui/styles';

import {
	AppBar,
	type AppBarProps,
	Button,
	Layout,
	type LayoutProps,
	Logout,
	useAuthState,
	useRedirect,
	UserMenu,
	type UserMenuProps,
} from 'react-admin';
import { SideMenus } from './SideMenus';

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		width: '100%',
		height: '36px',
		padding: '6px 16px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		'& span': {
			height: 'auto',
			width: 'auto',
			lineHeight: 1,
		},
	},
	startIcon: {
		margin: 0,
		minWidth: '40px',
	},
}));

const MyUserMenu = (props: UserMenuProps): React.ReactElement => {
	const styles = useStyles();
	const { authenticated } = useAuthState();
	const redirect = useRedirect();

	const handleLogin = (): void => {
		redirect('/login');
	};

	return (
		<UserMenu {...props}>
			{authenticated === null && (
				<Button
					onClick={handleLogin}
					classes={{ root: styles.root, startIcon: styles.startIcon }}
					startIcon={
						<Icon>
							<Login />
						</Icon>
					}
					label="Login"
				/>
			)}
			<Logout />
		</UserMenu>
	);
};

const MyAppBar = (props: AppBarProps): React.ReactElement => (
	<AppBar {...props} userMenu={<MyUserMenu />} >
		<Box flex={1} /> 
		[RCO]
		<Box flex={1} /> 
	</AppBar>
);

const MyLayout = (props: LayoutProps): React.ReactElement => (
	<Layout {...props} appBar={MyAppBar} menu={SideMenus} />
);

export default MyLayout;
