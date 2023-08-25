import React from 'react';
import Header from '../layout/header/LoginHeader';
import Footer from '../layout/footer/PageFooter';

const Layout2 = ({ children }) => (
    <div className="flex flex-col h-screen bg-bodygreen">
        <Header />
            <main className="flex-grow">
                {children}
            </main>
        <Footer />
    </div>
);

export default Layout2;