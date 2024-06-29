import React, { useContext } from "react";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../common/logoipsum-245.svg";

/** Homepage of site.
 *
 * Shows welcome message if user is logged in.
 *
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
      backgroundColor: '#343a40', 
      color: 'white',
      padding: '20px',
      borderRadius: '4px',
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
       
        <h1> <img src={logo} alt="Card Back Quest" />Card Back Quest</h1>

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
