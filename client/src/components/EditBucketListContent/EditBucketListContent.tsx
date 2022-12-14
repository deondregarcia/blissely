import React, { useState } from "react";
import Axios from "axios";
import "./EditBucketListContent.css";
import { BucketListContentType } from "../../types/content";

const EditBucketListContent = ({
  content,
  trackerID,
  setEditMode,
  triggerRefresh,
  setTriggerRefresh,
}: {
  content: BucketListContentType;
  trackerID: number;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRefresh: boolean;
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newActivity, setNewActivity] = useState(content.activity);
  const [newDescription, setNewDescription] = useState(content.description);

  const saveContent = async () => {
    await Axios.patch("/content/activity", {
      id: content.id,
      activity: newActivity,
      description: newDescription,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setTriggerRefresh(!triggerRefresh);
    setEditMode(false);
  };

  const deleteContent = () => {
    if (window.confirm("Are you sure you want to delete this?")) {
      Axios.delete("/content/activity", {
        params: {
          tracker_id: trackerID,
          content_id: content.id,
        },
      })
        .then((res) => {
          console.log(res);
          setTriggerRefresh(!triggerRefresh);
          setEditMode(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  };

  return (
    <div className="edit-bucket-list-content-wrapper">
      <div className="edit-bucket-list-content-container">
        <div onClick={deleteContent} className="edit-bucket-list-delete-button">
          <h2>Delete</h2>
        </div>
        <div
          onClick={() => setEditMode(false)}
          className="edit-bucket-list-content-exit-button"
        >
          <h1>X</h1>
        </div>
        <div className="edit-bucket-list-content-header">
          <h2>Edit Activity</h2>
        </div>
        <div className="edit-bucket-list-content-body">
          <label htmlFor="activity-title-input">Title:</label>
          <input
            className="edit-bucket-list-content-title-input"
            type="text"
            id="activity-title-input"
            maxLength={50}
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
          />
          <label htmlFor="activity-description-input">Description:</label>
          <input
            className="edit-bucket-list-content-description-input"
            type="text"
            id="activity-description-input"
            maxLength={150}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>
        <div
          onClick={saveContent}
          className="edit-bucket-list-content-save-button"
        >
          <h2>Save</h2>
        </div>
      </div>
    </div>
  );
};

export default EditBucketListContent;
