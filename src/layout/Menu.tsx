import { useState } from 'react';
import Box from '@mui/material/Box';
import UserIcon from '@mui/icons-material/People';


import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
    MenuProps,
    useSidebarState,
    usePermissions
} from 'react-admin';





type MenuName = 'menuCatalog' | 'menuSales' | 'menuCustomers';

const Menu = ({ dense = false }: MenuProps) => {
  const {permissions} = usePermissions()

    const [state, setState] = useState({
        menuCatalog: true,
        menuSales: true,
        menuCustomers: true,
    });
    const translate = useTranslate();
    const [open] = useSidebarState();

    const handleToggle = (menu: MenuName) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };

    return (
        <Box
            sx={{
                width: open ? 200 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >

                <MenuItemLink
                    to="/users"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`Users`, {
                        smart_count: 2,
                    })}
                    leftIcon={<UserIcon />}
                    dense={dense}
                />
                {permissions ? <MenuItemLink
                    to="/audits"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`Aduits`, {
                        smart_count: 2,
                    })}
                    leftIcon={<UserIcon />}
                    dense={dense}
                /> : ''}
        </Box>
    );
};

export default Menu;
