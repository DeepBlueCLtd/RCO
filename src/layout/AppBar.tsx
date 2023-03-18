
import { AppBar, Logout, UserMenu} from 'react-admin';

import {
    Box,
    Typography,
    useMediaQuery,
    Theme,
} from '@mui/material';


const CustomUserMenu = () => (
    <UserMenu>
        <Logout />
    </UserMenu>
);

const CustomAppBar = (props: any) => {
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );
    return (
        <AppBar
            {...props}
            color="secondary"
            elevation={1}
            userMenu={<CustomUserMenu />}
        >
            {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}
        </AppBar>
    );
};

export default CustomAppBar;
