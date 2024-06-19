import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";

function Navbar({logout}) {
    const {currentUser} = useContext(ProjectOmegaContext);
    
    function LoggedInNavbar() {
        return ( 
                <ul>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <Link to="/cardbacks">Card Backs</Link>
                    </li>
                    <li>
                        <Link to="/" onClick={logout}>
                        Logout {currentUser.firstName || currentUser.username}
                        </Link></li>
                </ul>
        );
    }

    function LoggedOutNavbar() {
        return ( 
                <ul>
                    <li>
                        <Link to="/signup">Signup</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                </ul>
        );
    }
   
    return (
        <nav>
        <Link to="/">Project Omega</Link>
        {currentUser ? LoggedInNavbar() : LoggedOutNavbar()}
        </nav>
    )

   
}

export default Navbar;