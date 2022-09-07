import React, { useState } from "react";
import Axios from "axios";
import "./AddBucketListContent.css";

const AddBucketListContent = ({
  setAddMode,
  setTriggerRefresh,
  triggerRefresh,
  bucketListID,
  ownerID,
}: {
  setAddMode: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRefresh: boolean;
  bucketListID: number | undefined;
  ownerID: number | null;
}) => {
  const [newActivity, setNewActivity] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const addBucketListItem = async () => {
    // if either input is empty
    if (!newActivity || !newDescription) {
      alert("Please enter a title/description.");
      return;
    }
    await Axios.post("/content/add", {
      tracker_id: bucketListID,
      activity: newActivity,
      description: newDescription,
      is_completed: 0,
      user_id: ownerID,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    setTriggerRefresh(!triggerRefresh);
    setAddMode(false);
  };

  return (
    <div className="add-bucket-list-content-wrapper">
      <div className="add-bucket-list-content-container">
        <div
          onClick={() => setAddMode(false)}
          className="add-bucket-list-content-exit-button"
        >
          <h1>X</h1>
        </div>
        <div className="add-bucket-list-content-header">
          <h2>Add Activity</h2>
        </div>
        <div className="add-bucket-list-content-body">
          <label htmlFor="new-activity-title-input">Title:</label>
          <input
            className="add-bucket-list-content-title-input"
            type="text"
            id="new-activity-title-input"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
          />
          <label htmlFor="new-activity-description-input">Description:</label>
          <input
            className="add-bucket-list-content-description-input"
            type="text"
            id="new-activity-description-input"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>
        <div
          onClick={addBucketListItem}
          className="add-bucket-list-content-save-button"
        >
          <h2>Save</h2>
        </div>
      </div>
    </div>
  );
};

export default AddBucketListContent;