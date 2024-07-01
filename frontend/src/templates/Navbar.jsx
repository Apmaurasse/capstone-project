import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../common/logoipsum-245.svg";

function NavbarComponent({ logout }) {
    const { currentUser } = useContext(ProjectOmegaContext);

    function LoggedInNavbar() {
        return (
            <>
                <Nav.Item>
                    <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/cardbacks">Card Backs</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/likes">Likes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/collection">Collection</Nav.Link>
                </Nav.Item>
            </>
        );
    }

    function LoggedOutNavbar() {
        return (
            <>
                <Nav.Item>
                    <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav.Item>
            </>
        );
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
            <Navbar.Brand as={Link} to="/" className="ms-4">
                <img
                    src={logo}
                    alt="Card Back Quest Logo"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                Card Back Quest
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {currentUser ? LoggedInNavbar() : LoggedOutNavbar()}
                </Nav>
                {currentUser && (
                    <Nav className="ms-auto">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/" onClick={logout}>
                                Logout {currentUser.firstName || currentUser.username}
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavbarComponent;

