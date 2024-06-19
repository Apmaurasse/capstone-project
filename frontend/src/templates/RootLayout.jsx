import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";


const RootLayout = ({logout}) => {
    return (
        <div>
            <header>
                <Navbar logout={logout} />
            </header>
            <main>
            <Outlet />
            </main>
        </div>
    );
};

export default RootLayout