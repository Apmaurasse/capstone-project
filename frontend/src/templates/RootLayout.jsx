import React from "react";
import { Outlet } from "react-router-dom";
import NavbarComponent from "./Navbar";


const RootLayout = ({logout}) => {
    return (
        <div>
            <header>
                <NavbarComponent logout={logout} />
            </header>
            <main>
            <Outlet />
            </main>
        </div>
    );
};

export default RootLayout