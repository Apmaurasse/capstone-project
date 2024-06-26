import React, { useContext } from "react";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../common/logoipsum-245.svg";

/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * Routes -> Homepage
 */

function Homepage() {
  const { currentUser } = useContext(ProjectOmegaContext);
  console.debug("Homepage", "currentUser=", currentUser);

  const styles = {
    container: {
      backgroundColor: 'black',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      backgroundColor: '#343a40', // Bootstrap dark grey color
      color: 'white',
      padding: '20px',
      borderRadius: '4px',
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
       
        <h1> <img src={logo} alt="Project Omega" />Project Omega</h1>

        {currentUser ? (
          <h2>
            Welcome Back, {currentUser.firstName || currentUser.username}!
          </h2>
        ) : (
          <p>
            A site for viewing Hearthstone card backs.
          </p>
        )}
      </div>
    </div>
  );
}

export default Homepage;
