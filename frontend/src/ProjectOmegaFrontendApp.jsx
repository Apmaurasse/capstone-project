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
 */
const ProjectOmegaFrontendApp = () => {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [likedCardBacks, setLikedCardBacks] = useState(new Set());
  const [collectedCardBacks, setCollectedCardBacks] = useState(new Set());
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  console.debug(
    "App",
    "infoLoaded=", infoLoaded,
    "currentUser=", currentUser,
    "likedCardBacks=", likedCardBacks,
    "collectedCardBacks=", collectedCardBacks,
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

          let likedCardBacks = await ProjectOmegaApi.getUserLikes(username);
          setLikedCardBacks(new Set(likedCardBacks));

          let collectedCardBacks = await ProjectOmegaApi.getUserCollection(username);
          setCollectedCardBacks(new Set(collectedCardBacks));
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
    setLikedCardBacks(new Set([]));
    setCollectedCardBacks(new Set([]));
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
  
  /** Check if a card back is liked by the user */
  function hasLiked(cardBackId) {
    return likedCardBacks.has(cardBackId);
  }

    /** Add a like to a card back */
  async function likeCardBack(cardBackId) {
    try {
        await ProjectOmegaApi.addUserLike(currentUser.username, cardBackId);
        setLikedCardBacks(new Set([...likedCardBacks, cardBackId]));
      } catch (err) {
        console.error("likeCardBack failed", err);
      }
    }

  /** Remove a like from a card back */
  async function unlikeCardBack(cardBackId) {
    try {
        await ProjectOmegaApi.removeUserLike(currentUser.username, cardBackId);
        setLikedCardBacks(new Set([...likedCardBacks].filter(id => id !== cardBackId)));
      } catch (err) {
        console.error("unlikeCardBack failed", err);
      }
    }

  /** Check if a card back has been collected by the user */
  function hasCollected(cardBackId) {
    return collectedCardBacks.has(cardBackId);
  }

  /** Add a card back to user's collection */
  async function collectCardBack(cardBackId) {
    try {
        await ProjectOmegaApi.addToUserCollection(currentUser.username, cardBackId);
        setCollectedCardBacks(new Set([...collectedCardBacks, cardBackId]));
      } catch (err) {
        console.error("addToUserCollection failed", err);
      }
    }

  /** Remove a card back from a user's collection. */
  async function uncollectCardBack(cardBackId) {
    try {
        await ProjectOmegaApi.removeFromUserCollection(currentUser.username, cardBackId);
        setCollectedCardBacks(new Set([...collectedCardBacks].filter(id => id !== cardBackId)));
      } catch (err) {
        console.error("uncollectCardBack failed", err);
      }
    }

  if (!infoLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <ProjectOmegaContext.Provider 
      value={{currentUser, setCurrentUser, hasLiked, likeCardBack, unlikeCardBack, likedCardBacks, hasCollected, collectCardBack, uncollectCardBack, collectedCardBacks}}>
          <ProjectOmegaRoutes login={login} signup={signup} logout={logout}/>
    </ProjectOmegaContext.Provider>
  );
};

export default ProjectOmegaFrontendApp;