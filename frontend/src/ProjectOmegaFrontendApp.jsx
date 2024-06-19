import React, { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import LoadingSpinner from "./common/LoadingSpinner";
import ProjectOmegaApi from "./api/api";
import ProjectOmegaRoutes from "./ProjectOmegaRoutes";
import ProjectOmegaContext from "./auth/ProjectOmegaContext";
import { jwtDecode } from "jwt-decode";


// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "project-omega-token";

/** ProjectOmega application.
 *
 * - infoLoaded: has user data been pulled from API?
 *   (this manages spinner for "loading...")
 *
 * - currentUser: user obj from API. This becomes the canonical way to tell
 *   if someone is logged in. This is passed around via context throughout app.
 *
 * - token: for logged in users, this is their authentication JWT.
 *   Is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 * App -> Routes
 */
const ProjectOmegaFrontendApp = () => {
  const [infoLoaded, setInfoLoaded] = useState(false);
  //Todo:
  //Review how the state is used throughout the app. 
  // Update to use with liked card backs and collections.
  // const [applicationIds, setApplicationIds] = useState(new Set([]));
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  console.debug(
    "App",
    "infoLoaded=", infoLoaded,
    "currentUser=", currentUser,
    "token=", token,
  );

  // Load user info from API. Until a user is logged in and they have a token,
  // this should not run. It only needs to re-run when a user logs out, so
  // the value of the token is a dependency for this effect.

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwtDecode(token);  
        //   let { username } = jwt_decode(token, null, true) blocked out the line for reference; 
        // `null` as the key, `true` to disable signature verification
          // put the token on the Api class so it can use it to call the API.
          ProjectOmegaApi.token = token;
          let currentUser = await ProjectOmegaApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          // Todo:
          // Add function to for set cardBack ids from current user 
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control the spinner.
    setInfoLoaded(false);
    getCurrentUser();

  }, [token]);

  /** Handles site-wide logout. */
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  /** Handles site-wide signup.
   *
   * Automatically logs them in (set token) upon signup.
   *
   * Make sure you await this function and check its return value!
   */
  async function signup(signupData) {
    try {
      let token = await ProjectOmegaApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles site-wide login.
   *
   * Make sure you await this function and check its return value!
   */
  async function login(loginData) {
    try {
      let token = await ProjectOmegaApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  // TODO: add a function to check if a card back has been liked, or added to collection.
  // TODO: add a function to like card backs and add to collection.
 

  if (!infoLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <ProjectOmegaContext.Provider 
      value={{currentUser, setCurrentUser}}>
          <ProjectOmegaRoutes login={login} signup={signup} logout={logout}/>
    </ProjectOmegaContext.Provider>
  );
};

export default ProjectOmegaFrontendApp;