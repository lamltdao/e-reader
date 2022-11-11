import React from 'react'
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
            <div>
                {children}
            </div>
        </div>
    )
}
