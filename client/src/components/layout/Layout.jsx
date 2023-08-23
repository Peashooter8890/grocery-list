import React from 'react';
import Header from '../layout/header/PageHeader';
import Footer from '../layout/footer/PageFooter';

const Layout = ({ children }) => (
    <div>
        <Header />
            <main>
                {children}
            </main>
        <Footer />
    </div>
);

export default Layout;