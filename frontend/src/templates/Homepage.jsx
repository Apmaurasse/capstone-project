import React, { useContext } from "react";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";

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

  return (
      <div>
        <div>
          <h1>Project Omega</h1>
          <p>Test Project.</p>
          {currentUser
              ? <h2>
                Welcome Back, {currentUser.firstName || currentUser.username}!
              </h2>
              : (
                  <p>
                    An additional welcome message. Maybe some links.
                  </p>
              )}
        </div>
      </div>
  );
}

export default Homepage;