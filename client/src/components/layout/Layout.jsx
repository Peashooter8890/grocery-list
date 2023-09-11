import React from 'react';
import Header from './header/Header';
import Footer from './footer/PageFooter';

const Layout = ({ children }) => (
    <div>
        <div className="flex flex-col h-screen bg-bodygreen">
            <Header />
                <main className="flex-grow overflow-y-auto">
                    {children}
                </main>
            <Footer />
        </div>
    </div>
);

export default Layout;