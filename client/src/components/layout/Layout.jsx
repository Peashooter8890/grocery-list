import React from 'react';
import Header from '../layout/header/PageHeader';
import Footer from '../layout/footer/PageFooter';

const Layout = ({ children }) => (
    <div className="flex flex-col min-h-screen">
        <Header />
            <main className="flex-grow">
                {children}
            </main>
        <Footer />
    </div>
);

export default Layout;