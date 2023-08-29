import React from 'react';
import Header from '../layout/header/PageHeader';
import Footer from '../layout/footer/PageFooter';

const Layout = ({ children }) => (
    <div className="flex flex-col h-screen">
        <Header />
            <main className="flex-1">
                {children}
            </main>
        <Footer />
    </div>
);

export default Layout;