import React, { useState, useContext } from "react";
import Alert from "../common/Alert";
import ProjectOmegaApi from "../api/api";
import ProjectOmegaContext from "../auth/ProjectOmegaContext";
import './Forms.css'; 

/** Profile editing form.
 *
 * Displays profile form and handles changes to local form state.
 * Submitting the form calls the API to save, and triggers user reloading
 * throughout the site.
 *
 */

function ProfileForm() {
  const { currentUser, setCurrentUser } = useContext(ProjectOmegaContext);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
  });
  const [formErrors, setFormErrors] = useState([]);

  const [saveConfirmed, setSaveConfirmed] = useState(false);


  console.debug(
    "ProfileForm",
    "currentUser=", currentUser,
    "formData=", formData,
    "formErrors=", formErrors,
    "saveConfirmed=", saveConfirmed,
  );

  /** on form submit:
   * - attempt save to backend & report any errors
   * - if successful
   *   - clear previous error messages and password
   *   - show save-confirmed message
   *   - set current user info throughout the site
   */

  async function handleSubmit(evt) {
    evt.preventDefault();

    let profileData = {
      email: formData.email,
      password_hash: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    let username = formData.username;
    let updatedUser;

    try {
      updatedUser = await ProjectOmegaApi.saveProfile(username, profileData);
    } catch (errors) {
      debugger;
      setFormErrors(errors);
      return;
    }

    setFormData(f => ({ ...f, password: "" }));
    setFormErrors([]);
    setSaveConfirmed(true);

    // trigger reloading of user information throughout the site
    setCurrentUser(updatedUser);
  }

  /** Handle form data changing */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(f => ({
      ...f,
      [name]: value,
    }));
    setFormErrors([]);
  }

  return (
    <div className="container">
      <div className="col-md-6 col-lg-4">
      <h3 className="header">Profile</h3>
        <div className="card content">
          <div className="card-body">
            <form>
              <div className="form-group">
                <p className="form-control-plaintext username">{formData.username}</p>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>First Name</label>
                <input
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Confirm password to make changes:</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {formErrors.length
                ? <Alert type="danger" messages={formErrors} />
                : null}

              {saveConfirmed
                ? <Alert type="success" messages={["Updated successfully."]} />
                : null}

              <button
                className="btn btn-primary btn-block mt-4 button"
                onClick={handleSubmit}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;



