import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class ProjectOmegaApi {
  // the token for interacting with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ProjectOmegaApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

//TODO:
// Add functions to get user's likes and collection.
// Add functions to add to user's collection.
// Add functions to remove from user's collection.
// Add functions to add to user's likes.
// Add functions to remove from user's likes.

  /** Get card backs (filtered by name if not undefined) */

  static async getCardBacks(name) {
    let res = await this.request("cardBacks", { name });
    // console.log(res)
    return res.cardBacks;
  }

    /** Get details on a company by handle. */

  static async getCardBack(id) {
    let res = await this.request(`cardBacks/${id}`);
    return res.cardBack;
  }


  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

/** Get user's likes */
  static async getUserLikes(username) {
    let res = await this.request(`users/${username}/likes`);
    // console.log(res.likes)
    return res.likes;
  }

/** Add to user's likes */
  static async addUserLike(username, cardBackId) {
    let res = await this.request(`users/${username}/likes/${cardBackId}`, {}, "post");
    return res.liked;
  }

/** Remove from user's likes */
  static async removeUserLike(username, cardBackId) {
    let res = await this.request(`users/${username}/likes/${cardBackId}`, {}, "delete");
    return res.unliked;
  }

/** Check if a user has liked a card back. */
  static async hasUserLiked(username, cardBackId) {
    let res = await this.request(`users/${username}/likes/${cardBackId}`);
    return res.hasLiked;
  }

/** Get user's collection */
static async getUserCollection(username) {
  let res = await this.request(`users/${username}/collections`);
  return res.collections;
}

/** Add to user's collection */
static async addToUserCollection(username, cardBackId) {
  let res = await this.request(`users/${username}/collections/${cardBackId}`, {}, "post");
  return res.collection;
}

/** Remove from user's collection */
static async removeFromUserCollection(username, cardBackId) {
  let res = await this.request(`users/${username}/collections/${cardBackId}`, {}, "delete");
  return res.uncollected;
}

/** Check if a user has collected a card back. */
static async hasUserCollected(username, cardBackId) {
  let res = await this.request(`users/${username}/collections/${cardBackId}`);
  return res.hasCollected;
}
}
export default ProjectOmegaApi;



// TODO: Review hasUserLiked and hasUserCollected to check if a user has liked or collected a card back.