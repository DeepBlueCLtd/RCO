import { Layout, LayoutProps } from 'react-admin';
import useAudit from '../hooks/useAudit';
import AppBar from './AppBar';
import Menu from './Menu';

export default (props: LayoutProps) => {
    useAudit()
    return <Layout {...props} appBar={AppBar} menu={Menu} />;
};
