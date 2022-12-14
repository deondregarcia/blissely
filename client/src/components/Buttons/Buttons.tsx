// exports of all buttons
import React from "react";
import "./Buttons.css";

// login and sign up button with Google on landing page
export const LandingLoginButton = ({ googleLink }: { googleLink: string }) => {
  return (
    <a href={googleLink}>
      <div className="landing-login-button">
        <h3 className="landing-login-button-text">Login with Google</h3>
      </div>
    </a>
  );
};

export const LogoutButton = ({
  logout,
}: {
  logout: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div onClick={logout} className="logout-button">
      <h3 className="logout-button-text">Logout</h3>
    </div>
  );
};

export const LoginButton = ({ googleLink }: { googleLink: string }) => {
  return (
    <a href={googleLink}>
      <div className="login-button">
        <h3 className="login-button-text">Login with Google</h3>
      </div>
    </a>
  );
};

export const GetRecipesButton = ({
  getRecipes,
}: {
  getRecipes: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div onClick={getRecipes} className="outline-button get-recipes-button">
      <h3 className="get-recipes-button-text">Search</h3>
    </div>
  );
};

export const ViewProfileButton = ({ googleID }: { googleID: string }) => {
  return (
    <div className="view-profile-button">
      {/* CheckUserOrFriend will later route based on friend or nonfriend status */}
      <a className="view-profile-button-link" href={`/profile/${googleID}`}>
        <h3 className="view-profile-button-text">View Profile</h3>
      </a>
    </div>
  );
};

// button which does nothing but turn red for sample account page
export const SampleViewProfileButton = () => {
  return (
    <div className="sample-account-view-profile-button">
      <h3 className="sample-account-view-profile-button-text">View Profile</h3>
    </div>
  );
};
