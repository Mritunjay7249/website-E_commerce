import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const noPaddingRoutes = ['/auth', '/seller-signup'];
  const mainClassName = `flex-grow container mx-auto px-4 ${noPaddingRoutes.includes(location.pathname) ? '' : 'py-8'}`;

  return (
    <div className="flex flex-col min-h-screen bg-neutral font-sans">
      <Navbar />
      <main className={mainClassName}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;