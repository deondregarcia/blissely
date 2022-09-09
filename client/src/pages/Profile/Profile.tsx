import React, { useState, useEffect, ReactNode, useRef } from "react";
import Axios from "axios";
import "./Profile.css";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { GoogleUserObjectType } from "../../types/authTypes";

// import types
import {
  BucketListType,
  RecipeContentType,
  UserType,
  FriendListType,
} from "../../types/content";

// import components
import BucketList from "../../components/BucketList/BucketList";
import EmptyArrayMessage from "../../components/EmptyArrayMessage/EmptyArrayMessage";
import ContentContainerHeader from "../../components/ContentContainerHeader/ContentContainerHeader";
import RecipeDisplay from "../../components/ProfileComponents/RecipeDisplay/RecipeDisplay";
import RecipeInput from "../../components/ProfileComponents/RecipeInput/RecipeInput";
import { RecipeInputDefault } from "../../components/ProfileComponents/RecipeInput/RecipeInputDefault";
import useAuth from "../../hooks/useAuth";
import AddBucketList from "../../components/ProfileComponents/AddBucketList/AddBucketList";
import EditBucketList from "../../components/ProfileComponents/EditBucketList/EditBucketList";
import FriendList from "../../components/ProfileComponents/FriendManager/FriendList/FriendList";
import Search from "../../components/ProfileComponents/FriendManager/Search/Search";

const Profile = () => {
  const [userID, setUserID] = useState<number>(0);
  const { auth } = useAuth();
  const [googleUserObject, setGoogleUserObject] = useState<
    GoogleUserObjectType | any
  >();
  const [friendManager, setFriendManager] = useState("friends");
  const [requestTabSelected, setRequestTabSelected] = useState(false);
  const [userObject, setUserObject] = useState<UserType | undefined>(undefined);
  const [friends, setFriends] = useState<FriendListType[]>([]);

  const [recipeArray, setRecipeArray] =
    useState<RecipeContentType[]>(RecipeInputDefault);
  const { id } = useParams();

  // set state to display AddBucketList component
  const [publicAdd, setPublicAdd] = useState(false);
  const [sharedAdd, setSharedAdd] = useState(false);
  const [privateAdd, setPrivateAdd] = useState(false);

  // set state to display EditBucketList component
  const [publicEdit, setPublicEdit] = useState(false);
  const [sharedEdit, setSharedEdit] = useState(false);
  const [privateEdit, setPrivateEdit] = useState(false);

  // ID's to grab when editing per each section
  const [publicEditObject, setPublicEditObject] =
    useState<BucketListType | null>(null);
  const [sharedEditObject, setSharedEditObject] =
    useState<BucketListType | null>(null);
  const [privateEditObject, setPrivateEditObject] =
    useState<BucketListType | null>(null);

  const [triggerRefresh, setTriggerRefresh] = useState(false);

  // separate the bucket list arrays for easier nullish checks in render
  const [publicBucketListArray, setPublicBucketListArray] = useState<
    BucketListType[]
  >([]);
  const [sharedBucketListArray, setSharedBucketListArray] = useState<
    BucketListType[]
  >([]);
  const [privateBucketListArray, setPrivateBucketListArray] = useState<
    BucketListType[]
  >([]);
  const [initialPublicBound, setInitialPublicBound] = useState<
    number | undefined
  >(undefined);
  const [publicOffset, setPublicOffset] = useState<number | undefined>(
    undefined
  );
  const [initialSharedBound, setInitialSharedBound] = useState<
    number | undefined
  >(undefined);
  const [sharedOffset, setSharedOffset] = useState<number | undefined>(
    undefined
  );
  const [initialPrivateBound, setInitialPrivateBound] = useState<
    number | undefined
  >(undefined);
  const [privateOffset, setPrivateOffset] = useState<number | undefined>(
    undefined
  );

  // grab bucket_list_tracker data
  const getBucketListData = () => {
    // google_id
    Axios.get(
      `/view/lists/${JSON.parse(auth.session_info.data).passport.user.id}`
    )
      .then((response) => {
        setPublicBucketListArray(
          response.data.data.filter((bucketList: BucketListType) => {
            return (
              bucketList.privacy_type === "public_friends" ||
              bucketList.privacy_type === "public_random"
            );
          })
        );
        setSharedBucketListArray(
          response.data.data.filter((bucketList: BucketListType) => {
            return bucketList.privacy_type === "shared";
          })
        );
        setPrivateBucketListArray(
          response.data.data.filter((bucketList: BucketListType) => {
            return bucketList.privacy_type === "private";
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get google user info
  const getGoogleUserInfo = () => {
    Axios.get("/googleuser")
      .then((res) => {
        setGoogleUserObject(res.data.google_user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get user info from google id
  const getUserInfo = () => {
    Axios.get(`/view/get-user-info/${id}`)
      .then((res) => {
        setUserObject(res.data.userInfo[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get list of friends
  const getFriendsList = () => {
    Axios.get(`/view/get-list-of-friends/${id}`)
      .then((res) => {
        setFriends(res.data.friends);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // combine funcs to hopefully improve performance
  const runInitialFunctions = () => {
    getBucketListData();
    getGoogleUserInfo();
    getUserInfo();
    getFriendsList();
  };

  useEffect(() => {
    runInitialFunctions();

    return () => {};
  }, []);

  useEffect(() => {
    getBucketListData();

    return () => {};
  }, [triggerRefresh]);

  // --------- Below useEffects set and calculate necessary offset values for edit overlays --------------
  // without these offset values for a transform, overlay would not render in correct position

  useEffect(() => {
    setInitialPublicBound(
      document?.getElementById("public-bound")?.getBoundingClientRect().top
    );
    setInitialSharedBound(
      document?.getElementById("shared-bound")?.getBoundingClientRect().top
    );
    setInitialPrivateBound(
      document?.getElementById("private-bound")?.getBoundingClientRect().top
    );
  }, [publicBucketListArray]);

  useEffect(() => {
    const offset =
      initialPublicBound! -
      document?.getElementById("public-bound")?.getBoundingClientRect().top! -
      window.scrollY;
    setPublicOffset(offset);
  }, [publicEdit]);
  useEffect(() => {
    const offset =
      initialSharedBound! -
      document?.getElementById("shared-bound")?.getBoundingClientRect().top! -
      window.scrollY;
    setSharedOffset(offset);
  }, [sharedEdit]);
  useEffect(() => {
    const offset =
      initialPrivateBound! -
      document?.getElementById("private-bound")?.getBoundingClientRect().top! -
      window.scrollY;
    setPrivateOffset(offset);
  }, [privateEdit]);

  return (
    <>
      <div className="home-container">
        <div className="profile-info">
          <h2>{userObject?.username}</h2>
          <img
            // src={googleUserObject?.photos[0].value}
            src={userObject?.google_photo_link}
            referrerPolicy="no-referrer" // referrer policy that blocked loading of img sometimes - look into it
            alt="google profile picture"
            className="profile-pic"
          />
          <h3 className="profile-info-name">
            {userObject?.first_name} {userObject?.last_name}
          </h3>
          <div className="profile-bio-container">
            <h3 className="profile-bio-container-header">Bio</h3>
            <div className="profile-separator" />
            <p>{userObject?.bio}</p>
          </div>
        </div>
        <div
          className="content-container public"
          style={publicEdit ? { overflowY: "hidden" } : { overflowY: "scroll" }}
        >
          <ContentContainerHeader
            setCallback={setPublicAdd}
            addState={publicAdd}
            category="Public"
          />
          {publicAdd && (
            <AddBucketList
              setCallback={setPublicAdd}
              addState={publicAdd}
              privacyType="public"
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
            />
          )}
          {publicEdit && (
            <EditBucketList
              setCallback={setPublicEdit}
              editState={publicEdit}
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              arraySpecificObject={publicEditObject}
              offset={publicOffset}
            />
          )}
          {/* if publicBucketListArray is true, render, if null, display message */}
          {publicBucketListArray.length > 0 ? (
            publicBucketListArray.map((bucketList) => {
              return (
                <BucketList
                  bucketList={bucketList}
                  setArrayObject={setPublicEditObject}
                  setEditMode={setPublicEdit}
                  key={bucketList.id}
                  category="public"
                />
              );
            })
          ) : (
            <EmptyArrayMessage />
          )}
        </div>
        <div className="right-column-container friend-feed">
          <h2 className="side-container-header">Recent Friend Activities</h2>
          <div className="side-container-header-separator" />
        </div>

        {/* <div className="today-i-should-container">
          <h2 className="side-container-header">Today, I should...</h2>
          <div className="side-container-header-separator" />
          <p>Today I should try working out</p>
        </div> */}
        <div
          id="test3"
          className="content-container shared"
          style={sharedEdit ? { overflowY: "hidden" } : { overflowY: "scroll" }}
        >
          <ContentContainerHeader
            setCallback={setSharedAdd}
            addState={sharedAdd}
            category="Shared"
          />
          {sharedAdd && (
            <AddBucketList
              setCallback={setSharedAdd}
              addState={sharedAdd}
              privacyType="shared"
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
            />
          )}
          {sharedEdit && (
            <EditBucketList
              setCallback={setSharedEdit}
              editState={sharedEdit}
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              arraySpecificObject={sharedEditObject}
              offset={sharedOffset}
            />
          )}
          {sharedBucketListArray.length > 0 ? (
            sharedBucketListArray.map((bucketList) => {
              return (
                <BucketList
                  bucketList={bucketList}
                  setArrayObject={setSharedEditObject}
                  setEditMode={setSharedEdit}
                  key={bucketList.id}
                  category="shared"
                />
              );
            })
          ) : (
            <EmptyArrayMessage />
          )}
        </div>
        <div className="right-column-container friend-manager">
          <div className="friend-manager-header-container">
            <div
              onClick={() => setFriendManager("friends")}
              className={
                friendManager === "friends"
                  ? "friend-manager-header-clicked my-friends"
                  : "friend-manager-header my-friends"
              }
            >
              <h2>Friends</h2>
            </div>
            <div
              onClick={() => setFriendManager("search")}
              className={
                friendManager === "search"
                  ? "friend-manager-header-clicked search"
                  : "friend-manager-header search"
              }
            >
              <h2>Search</h2>
            </div>
          </div>
          <div className="side-container-header-separator" />
          <div className="friend-manager-content-container">
            <FriendList friendManager={friendManager} friends={friends} />
            <Search friendManager={friendManager} />
            <div
              className={
                requestTabSelected
                  ? "friend-manager-request-tab request-tab-selected"
                  : "friend-manager-request-tab"
              }
            >
              <div
                onClick={() => setRequestTabSelected(!requestTabSelected)}
                className="friend-manager-request-tab-button"
              >
                <h3>Requests</h3>
                <div className="friend-manager-request-count">
                  <h3>3</h3>
                </div>
              </div>
              <div className="friend-manager-request-tab-bar"></div>
            </div>
          </div>
        </div>
        <div
          className="content-container private"
          style={
            privateEdit ? { overflowY: "hidden" } : { overflowY: "scroll" }
          }
        >
          <ContentContainerHeader
            setCallback={setPrivateAdd}
            addState={privateAdd}
            category="Private"
          />
          {privateAdd && (
            <AddBucketList
              setCallback={setPrivateAdd}
              addState={privateAdd}
              privacyType="private"
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
            />
          )}
          {privateEdit && (
            <EditBucketList
              setCallback={setPrivateEdit}
              editState={privateEdit}
              setTriggerRefresh={setTriggerRefresh}
              triggerRefresh={triggerRefresh}
              arraySpecificObject={privateEditObject}
              offset={privateOffset}
            />
          )}
          {privateBucketListArray.length > 0 ? (
            privateBucketListArray.map((bucketList) => {
              return (
                <BucketList
                  bucketList={bucketList}
                  setArrayObject={setPrivateEditObject}
                  setEditMode={setPrivateEdit}
                  key={bucketList.id}
                  category="private"
                />
              );
            })
          ) : (
            <EmptyArrayMessage />
          )}
        </div>
        <div className="right-column-container recipe-suggestions">
          <h2 className="side-container-header">Recipe Suggestions</h2>
          <div className="side-container-header-separator" />
          <RecipeInput setRecipeArray={setRecipeArray} />
          <div className="recipe-api-content">
            {recipeArray?.map((recipe, index) => {
              return (
                <div key={index}>
                  <RecipeDisplay recipe={recipe} />
                  <div className="recipe-separator" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
