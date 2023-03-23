import { Menu, usePermissions,useAuthenticated  } from 'react-admin';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = (props: any) => {
    useAuthenticated();
    const { permissions } = usePermissions();
    return (
        <Menu {...props}>
            <Menu.DashboardItem to="/dashboard" />
            {permissions == 'admin' && <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />} />}
            <Menu.Item to="/reports" primaryText="Reports" leftIcon={<LabelIcon />} />
        </Menu>
    )
};