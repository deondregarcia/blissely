import express, { Request, Response } from "express";
import {
  createBucketList,
  addActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/ManageContent";
import { BucketList, BucketListContent } from "../types/content";

const contentRouter = express.Router();

// create new bucket list
contentRouter.post("/create", async (req: Request, res: Response) => {
  const newBucketList: BucketList = {
    google_id: req.user?.profile.id,
    privacy_type: req.body.privacy_type,
    title: req.body.title,
    description: req.body.description,
    permissions: req.body.permissions,
  };

  createBucketList(newBucketList, (err: Error, creationId: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ creationId: creationId });
  });
});

// add an activity to a particular bucket list based on id of that list
contentRouter.post("/add", async (req: Request, res: Response) => {
  const newActivity: BucketListContent = req.body;

  addActivity(newActivity, (err: Error, addId: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ addId: addId });
  });
});

// delete an activity from a bucket list based on id of that list
contentRouter.post("/delete-activity", async (req: Request, res: Response) => {
  const activityIDs = {
    trackerID: req.body.tracker_id,
    contentID: req.body.content_id,
  };

  deleteActivity(activityIDs, (err: Error, insertID: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ insertID: insertID });
  });
});

// update an activity in a bucket list
contentRouter.put("/update-activity", async (req: Request, res: Response) => {
  const updatedActivity: BucketListContent = req.body;

  updateActivity(updatedActivity, (err: Error, updatedId: number) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ updatedId: updatedId });
  });
});

export { contentRouter };
