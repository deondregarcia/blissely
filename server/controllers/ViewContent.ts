import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import {
  BucketList,
  BucketListContent,
  FriendListType,
  PrivacyAndOwnerType,
  SharedListUserType,
  FullUserListType,
} from "../types/content";

// view list of all bucket lists user is involved in
export const getBucketLists = (googleId: string, callback: Function) => {
  const getUserQueryString = "SELECT id FROM users WHERE google_id=?";
  // pull from bucket_list_tracker table
  const firstQueryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=(${getUserQueryString}) OR `;
  // query shared_list_users table
  const secondQueryString = `id IN (SELECT bucket_list_id FROM shared_list_users WHERE contributor_id=(${getUserQueryString}))`;
  const mainQueryString = firstQueryString + secondQueryString;

  db.query(mainQueryString, [googleId, googleId], (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const lists: BucketList[] = [];

    rows.forEach((row) => {
      const list: BucketList = {
        id: row.id,
        owner_id: row.owner_id,
        privacy_type: row.privacy_type,
        created_at: row.created_at,
        title: row.title,
        description: row.description,
        permissions: row.permissions,
      };
      lists.push(list);
    });
    callback(null, lists);
  });
};

// get all public_random bucket lists for non-friend profile pages
export const getPublicBucketLists = (
  userGoogleID: string,
  callback: Function
) => {
  const getUserQueryString = "(SELECT id FROM users WHERE google_id=?)";

  // get only public bucket lists
  const queryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=${getUserQueryString} AND privacy_type=?`;

  db.query(queryString, [userGoogleID, "public_random"], (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const lists: BucketList[] = [];

    rows.forEach((row) => {
      const list: BucketList = {
        id: row.id,
        owner_id: row.owner_id,
        privacy_type: row.privacy_type,
        created_at: row.created_at,
        title: row.title,
        description: row.description,
        permissions: row.permissions,
      };
      lists.push(list);
    });
    callback(null, lists);
  });
};

export const getBucketListInfo = (trackerID: number, callback: Function) => {
  const queryString = "SELECT * FROM bucket_list_tracker WHERE id=?";

  db.query(queryString, trackerID, (err, result) => {
    if (err) {
      console.log(err);
    }

    const bucketListInfo = <RowDataPacket>result;
    callback(null, bucketListInfo[0]);
  });
};

// view all activities in a bucket list
export const getActivities = (trackerId: number, callback: Function) => {
  const queryString = `SELECT * FROM bucket_list_content WHERE tracker_id=?`;

  db.query(queryString, trackerId, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const activities: BucketListContent[] = [];

    rows.forEach((row) => {
      const activity: BucketListContent = {
        id: row.id,
        tracker_id: row.tracker_id,
        activity: row.activity,
        description: row.description,
        is_completed: row.boolean,
        user_id: row.user_id,
        date_added: row.date_added,
        date_completed: row.date_completed,
      };
      activities.push(activity);
    });
    callback(null, activities);
  });
};

// get privacy type of BL based on bucket_list_tracker id
export const getPrivacyTypeAndOwner = (
  trackerID: number,
  callback: Function
) => {
  const queryString =
    "SELECT privacy_type, owner_id FROM bucket_list_tracker WHERE id=?";

  db.query(queryString, trackerID, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const privacyAndOwners: PrivacyAndOwnerType[] = [];
    rows.forEach((row) => {
      const privacyAndOwner: PrivacyAndOwnerType = {
        privacy_type: row.privacy_type,
        owner_id: row.owner_id,
      };
      privacyAndOwners.push(privacyAndOwner);
    });
    callback(null, privacyAndOwners);
  });
};

// given the user's google id, check if user is in shared_list_users
export const checkIfShared = (
  userID: string,
  bucketListID: number,
  callback: Function
) => {
  const queryString =
    "SELECT * FROM shared_list_users WHERE contributor_id=(SELECT id FROM users WHERE google_id=?) AND bucket_list_id=?";

  db.query(queryString, [userID, bucketListID], (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const sharedListUsers: SharedListUserType[] = [];
    rows.forEach((row) => {
      const sharedListUser: SharedListUserType = {
        id: row.id,
        bucket_list_id: row.bucket_list_id,
        contributor_id: row.contributor_id,
      };
      sharedListUsers.push(sharedListUser);
    });
    callback(null, sharedListUsers);
  });
};

// given a friend's Google ID, return all shared lists between user and friend
export const getSharedLists = (
  userGoogleID: string,
  friendGoogleID: string,
  callback: Function
) => {
  // get user ID from Google ID
  const getUserID = "(SELECT id FROM users WHERE google_id=?)";

  // get friend ID from Google ID
  const getFriendID = "(SELECT id FROM users WHERE google_id=?)";

  // select all bucket_list_id's where either friend or user is the contributor_id and the other is the owner of the bucket list
  const queryString = `SELECT bucket_list_id FROM shared_list_users WHERE (contributor_id=${getUserID} AND bucket_list_id IN (SELECT id FROM bucket_list_tracker WHERE owner_id=${getFriendID})) OR (contributor_id=${getFriendID} AND bucket_list_id IN (SELECT id FROM bucket_list_tracker WHERE owner_id=${getUserID}))`;

  db.query(
    queryString,
    [userGoogleID, friendGoogleID, friendGoogleID, userGoogleID],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const rows = <RowDataPacket[]>result;
      const bucketListIDs: number[] = [];
      rows.forEach((row) => {
        const bucketListID: number = row.bucket_list_id;
        bucketListIDs.push(bucketListID);
      });
      callback(null, bucketListIDs);
    }
  );
};

// get all users in shared_list_users
export const getSharedListUsers = (trackerID: number, callback: Function) => {
  const queryString =
    "SELECT contributor_id FROM shared_list_users WHERE bucket_list_id=?";

  db.query(queryString, trackerID, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const contributorIDs: number[] = [];
    rows.forEach((row) => {
      const contributorID: number = row.contributor_id;
      contributorIDs.push(contributorID);
    });
    callback(null, contributorIDs);
  });
};

// get all contributor's for all of user's owned, shared bucket lists
export const getAllContributors = (
  userGoogleID: string,
  callback: Function
) => {
  const getUserID = "(SELECT id FROM users WHERE google_id=?)";
  const getRelevantBucketListIDs = `(SELECT id FROM bucket_list_tracker WHERE owner_id=${getUserID})`;
  const queryString = `SELECT bucket_list_id, contributor_id FROM shared_list_users WHERE bucket_list_id IN ${getRelevantBucketListIDs}`;

  db.query(queryString, userGoogleID, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const contributorObjects: SharedListUserType[] = [];
    rows.forEach((row) => {
      const contributorObject: SharedListUserType = {
        bucket_list_id: row.bucket_list_id,
        contributor_id: row.contributor_id,
      };
      contributorObjects.push(contributorObject);
    });
    callback(null, contributorObjects);
  });
};

// get all of friend's public lists, and relevant shared lists
export const getFriendsLists = (
  sharedListArray: number[],
  friendGoogleID: string,
  callback: Function
) => {
  // get friend ID from Google ID
  const getFriendID = "(SELECT id FROM users WHERE google_id=?)";

  const queryString = `SELECT * FROM bucket_list_tracker WHERE owner_id=${getFriendID} AND (privacy_type="public_friends" OR privacy_type="public_random") OR id IN (?)`;

  db.query(queryString, [friendGoogleID, sharedListArray], (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const lists: BucketList[] = [];

    rows.forEach((row) => {
      const list: BucketList = {
        id: row.id,
        owner_id: row.owner_id,
        privacy_type: row.privacy_type,
        created_at: row.created_at,
        title: row.title,
        description: row.description,
        permissions: row.permissions,
      };
      lists.push(list);
    });
    callback(null, lists);
  });
};

// get user info from database from google ID
export const getUserInfo = (googleID: string, callback: Function) => {
  const queryString = "SELECT * FROM users WHERE google_id=?";

  db.query(queryString, googleID, (err, result) => {
    if (err) {
      callback(err);
    }

    const userInfo = <RowDataPacket>result;
    callback(null, userInfo);
  });
};

// get list of friends from google id
export const getListOfFriends = (userGoogleID: string, callback: Function) => {
  const getUserID = "(SELECT id FROM users WHERE google_id=?)";
  const queryString = `SELECT username, first_name, last_name, google_photo_link, google_id, id, wants_to FROM users WHERE id IN (SELECT user_id FROM friends WHERE friend_id=${getUserID} UNION SELECT friend_id FROM friends WHERE user_id=${getUserID})`;

  db.query(queryString, [userGoogleID, userGoogleID], (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const friends: FriendListType[] = [];

    rows.forEach((row) => {
      const friend: FriendListType = {
        username: row.username,
        first_name: row.first_name,
        last_name: row.last_name,
        google_photo_link: row.google_photo_link,
        google_id: row.google_id,
        user_id: row.id,
        wants_to: row.wants_to,
      };
      friends.push(friend);
    });
    callback(null, friends);
  });
};

// get full list of users, excluding current user
export const getUserList = (userGoogleID: string, callback: Function) => {
  // get user id from google id
  const getUserID = "(SELECT id FROM users WHERE google_id=?)";
  const queryString = `SELECT username, first_name, last_name, google_id, google_photo_link FROM users WHERE NOT id=${getUserID}`;

  db.query(queryString, userGoogleID, (err, result) => {
    if (err) {
      callback(err);
    }

    const rows = <RowDataPacket[]>result;
    const userList: FullUserListType[] = [];

    rows.forEach((row) => {
      const user: FullUserListType = {
        username: row.username,
        first_name: row.first_name,
        google_id: row.google_id,
        google_photo_link: row.google_photo_link,
      };
      userList.push(user);
    });
    callback(null, userList);
  });
};

// get user's friends' recent activities
export const getRecentFriendActivities = (
  userGoogleID: string,
  callback: Function
) => {
  // get list of user's friends first
  const getUserID = "(SELECT id FROM users WHERE google_id=?)";
  const getFriendsQueryString = `(SELECT user_id FROM friends WHERE friend_id=${getUserID} UNION SELECT friend_id FROM friends WHERE user_id=${getUserID})`;
  const getPermittedTrackerIDs = `(SELECT id FROM bucket_list_tracker WHERE privacy_type IN ("public_random", "public_friends") OR id IN (SELECT bucket_list_id FROM shared_list_users WHERE contributor_id=${getUserID}) OR owner_id=${getUserID})`;
  const mainQueryString = `SELECT * FROM bucket_list_content WHERE user_id IN ${getFriendsQueryString} AND tracker_id IN ${getPermittedTrackerIDs} ORDER BY date_added DESC, id DESC LIMIT 10`;

  db.query(
    mainQueryString,
    [userGoogleID, userGoogleID, userGoogleID, userGoogleID],
    (err, result) => {
      if (err) {
        callback(err);
      }

      const rows = <RowDataPacket[]>result;
      const activities: BucketListContent[] = [];

      rows.forEach((row) => {
        const activity: BucketListContent = {
          id: row.id,
          tracker_id: row.tracker_id,
          activity: row.activity,
          description: row.description,
          is_completed: row.boolean,
          user_id: row.user_id,
          date_added: row.date_added,
          date_completed: row.date_completed,
        };
        activities.push(activity);
      });
      callback(null, activities);
    }
  );
};
