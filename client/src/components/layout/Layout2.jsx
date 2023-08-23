import React from 'react';
import Header from '../layout/header/LoginHeader';
import Footer from '../layout/footer/PageFooter';

const Layout2 = ({ children }) => (
    <div className="flex justify-between flex-col h-screen bg-bodygreen">
        <Header />
            <main>
                {children}
            </main>
            <div className="flex-[.1_.1_0%]"></div>
        <Footer />
    </div>
);

export default Layout2;