import express, { Request, Response } from "express";
import {
  getBucketLists,
  getActivities,
  getPrivacyTypeAndOwner,
  checkIfShared,
  getBucketListInfo,
  getUserInfo,
  getSharedLists,
  getFriendsLists,
  getListOfFriends,
} from "../controllers/ViewContent";
import {
  BucketList,
  BucketListContent,
  FriendListType,
  PrivacyAndOwnerType,
  SharedListUserType,
} from "../types/content";

// /view prefix in url
const viewContentRouter = express.Router();

// get all lists for a user based on their google_id
viewContentRouter.get(
  "/lists/:google_id",
  async (req: Request, res: Response) => {
    const googleID: string = String(req.params.google_id);
    getBucketLists(googleID, (err: Error, lists: BucketList[]) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ data: lists });
    });
  }
);

// get lists for friend profile, get all public_friends/public_random and relevant shared lists
// note, this gets called after "/get-shared-lists/:id" gets called down below to get shared list ID's
viewContentRouter.post(
  "/get-friend-lists",
  async (req: Request, res: Response) => {
    const sharedListIDs = {
      array: req.body?.sharedListArray,
      friendGoogleID: req.body.friendGoogleID,
    };

    getFriendsLists(
      sharedListIDs.array,
      sharedListIDs.friendGoogleID,
      (err: Error, lists: BucketList[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ data: lists });
      }
    );
  }
);

// get title and description of a bucket list
viewContentRouter.get(
  "/bucket-list-info/:id",
  async (req: Request, res: Response) => {
    const bucketListID: number = Number(req.params.id);

    getBucketListInfo(
      bucketListID,
      (err: Error, bucketListInfo: BucketList) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ data: bucketListInfo });
      }
    );
  }
);

// get all activities for a bucket list based on id of bucket list
viewContentRouter.get(
  "/activities/:id",
  async (req: Request, res: Response) => {
    const bucketListId: number = Number(req.params.id);
    getActivities(
      bucketListId,
      (err: Error, activities: BucketListContent[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ data: activities });
      }
    );
  }
);

// get privacy type of bucket list based on its bucket_list_tracker id and get owner google idowner-
viewContentRouter.get(
  "/privacy-type-and-owner-google-id/:id",
  async (req: Request, res: Response) => {
    const bucketListID = Number(req.params.id);
    getPrivacyTypeAndOwner(
      bucketListID,
      (err: Error, privacyAndOwners: PrivacyAndOwnerType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ data: privacyAndOwners });
      }
    );
  }
);

// check if user is in shared list for a particular bucket list
viewContentRouter.get(
  "/check-if-user-in-shared-list/:id",
  async (req: Request, res: Response) => {
    const userID = String(req.user?.id);
    const bucketListID = Number(req.params.id);
    checkIfShared(
      userID,
      bucketListID,
      (err: Error, sharedListUsers: SharedListUserType[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ data: sharedListUsers });
      }
    );
  }
);

// check if user, who is visiting friend profile, is in any shared_list_users rows with the friend and return those bucket_list_id's
// (uses Google ID)
viewContentRouter.get(
  "/get-shared-lists/:id",
  (req: Request, res: Response) => {
    const userGoogleID = req.user?.profile.id;
    const friendGoogleID = req.params.id;

    getSharedLists(
      userGoogleID,
      friendGoogleID,
      (err: Error, bucketListIDs: number[]) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.status(200).json({ bucketListIDs: bucketListIDs });
      }
    );
  }
);

// get user info from database from google ID
viewContentRouter.get(
  "/get-user-info/:id",
  async (req: Request, res: Response) => {
    const googleID = req.params.id;

    getUserInfo(googleID, (err: Error, userInfo: any[]) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ userInfo: userInfo });
    });
  }
);

// get list of friends from google id
viewContentRouter.get(
  "/get-list-of-friends/:id",
  async (req: Request, res: Response) => {
    const userGoogleID = Number(req.params.id);

    getListOfFriends(userGoogleID, (err: Error, friends: FriendListType[]) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(200).json({ friends });
    });
  }
);

export { viewContentRouter };
