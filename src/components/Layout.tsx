import { Layout } from 'react-admin';
import { MyMenu } from './Menu';

export const LayoutComponent = (props: any) => <Layout {...props} menu={MyMenu} />;