import React from 'react'
import Footer from '../pages/Home/components/footer';
import Navbar from '../pages/Home/components/navbar'

type MainLayoutProps = {
    children: React.ReactNode;
}
export default function mainLayout({ children }: MainLayoutProps) {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <br />
            <div>
                {children}
            </div>
            {/* <div>
                <Footer />
            </div> */}
        </div>
    )
}
