import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import 'bootstrap/dist/css/bootstrap.min.css';

function NavbarComponent({ logout }) {
    const { currentUser } = useContext(ProjectOmegaContext);

    function LoggedInNavbar() {
        return (
            <>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link as={Link} to="/cardbacks">Card Backs</Nav.Link>
                <Nav.Link as={Link} to="/likes">Likes</Nav.Link>
                <Nav.Link as={Link} to="/collection">Collection</Nav.Link>
                <Nav.Link as={Link} to="/" onClick={logout}>
                    Logout {currentUser.firstName || currentUser.username}
                </Nav.Link>
            </>
        );
    }

    function LoggedOutNavbar() {
        return (
            <>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </>
        );
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
            <Navbar.Brand as={Link} to="/" className="ms-4">Project Omega</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {currentUser ? LoggedInNavbar() : LoggedOutNavbar()}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavbarComponent;
