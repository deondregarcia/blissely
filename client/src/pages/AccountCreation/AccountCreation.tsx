import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Axios from "axios";
import "./AccountCreation.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AccountCreation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [wantsTo, setWantsTo] = useState("");
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();

  // submit form for new user creation
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await Axios.get(`/user/username/${username}`)
      .then((res) => {
        if (res.data.username[0]) {
          alert("Username is already taken");
        } else {
          // check if any values are empty
          if (!firstName || !lastName || !username) {
            alert("Please fill out all fields with an asterisk.");
            return;
          }
          Axios.post("/user/user", {
            firstName: firstName,
            lastName: lastName,
            username: username,
            wantsTo: wantsTo,
          })
            .then((responseTwo) => {
              if (responseTwo.status === 200) {
                navigate(
                  `/my-profile/${
                    JSON.parse(auth.session_info.data).passport.user.id
                  }`
                );
              } else {
                console.log("something went wrong");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // check if logged in google user already has account
    Axios.get("/user/user-id")
      .then((res) => {
        if (res.data.userID[0]) {
          navigate(
            `/my-profile/${JSON.parse(auth.session_info.data).passport.user.id}`
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="account-creation-container">
      {/* <button onClick={checkUsername}>Check Username</button> */}
      <div className="account-creation-header-container">
        <h2>Welcome to Blissely!</h2>
      </div>
      <div className="account-creation-body-container">
        <form onSubmit={handleSubmit}>
          <div className="account-creation-form-container">
            <div className="account-creation-form-input-wrapper">
              <label htmlFor="first-name">First Name*</label>
              <input
                type="text"
                id="first-name"
                maxLength={15}
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="account-creation-form-input-wrapper">
              <label htmlFor="last-name">Last Name*</label>
              <input
                type="text"
                id="last-name"
                maxLength={15}
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="account-creation-form-input-wrapper">
              <label htmlFor="username">Username*</label>
              <input
                type="text"
                id="username"
                maxLength={15}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="account-creation-form-input-wrapper">
              <label htmlFor="wants-to">
                What's one thing you want to do?<p>(Max 90 characters)</p>
              </label>
              <textarea
                maxLength={90}
                id="wants-to"
                placeholder="Eat some tacos! Go on a road trip!"
                value={wantsTo}
                onChange={(e) => setWantsTo(e.target.value)}
              />
            </div>
            <input
              type="submit"
              value="Create Account"
              className="account-creation-form-submit"
            />
            <p>*Fields with an asterisk are required</p>
            <p>*Your Google profile photo will be your account profile photo</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountCreation;
