// src/Layout.tsx
import { Layout as RaLayout } from 'react-admin';
import { LayoutProps } from 'react-admin';
import CustomMenu from './CustomMenu'; // <-- Important

export const Layout = (props: LayoutProps) => <RaLayout {...props} menu={CustomMenu} />;