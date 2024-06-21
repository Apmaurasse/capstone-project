import React, { useContext } from "react";
import { createBrowserRouter, Route, Navigate, createRoutesFromElements, RouterProvider } from "react-router-dom";

import Homepage from "./templates/Homepage";
import RootLayout from "./templates/RootLayout";
import SignupForm from "./templates/SignupForm";
import LoginForm from "./templates/LoginForm";
import ProfileForm from "./templates/ProfileForm";
import CardBackList from "./templates/CardBackList";
import CardBackDetail from "./templates/CardBackDetail";
import UserLikes from "./templates/UserLikes";
import UserCollection from "./templates/UserCollection";
import ProjectOmegaContext from "./auth/ProjectOmegaContext";


const ProjectOmegaRoutes = ({signup, login, logout}) => {
    const {currentUser} = useContext(ProjectOmegaContext);
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout logout={logout}/>}> 
                
                <Route index element={<Homepage />} />
                <Route path="signup" element={<SignupForm signup={signup}/>} />
                <Route path="login" element={<LoginForm login={login}/>} />
                
                <Route
                path="profile"
                element={currentUser ? (<ProfileForm />) : (<Navigate to="/login" />)}/>
                <Route
                path="cardbacks"
                element={currentUser ? (<CardBackList />) : (<Navigate to="/login" />)}/>
                <Route
                path="cardbacks/:id"
                element={currentUser ? (<CardBackDetail />) : (<Navigate to="/login" />)}/>
                <Route
                path="likes"
                element={currentUser ? (<UserLikes />) : (<Navigate to="/login" />)}/>
                <Route
                path="collection"
                element={currentUser ? (<UserCollection />) : (<Navigate to="/login" />)}/>
                
                <Route path="*" element={<Navigate to="/" />} />
                
                </Route>
        )
    )
    
    return (
        <RouterProvider router={router} />
    );
};

export default ProjectOmegaRoutes;