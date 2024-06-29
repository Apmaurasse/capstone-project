import React from "react";
import { Outlet } from "react-router-dom";
import NavbarComponent from "./Navbar";

// Layout for all pages.
// Includes Navbar, and Outlet for all child pages.

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