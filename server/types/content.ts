export interface BucketList {
  id?: number;
  owner_id: number;
  collab_type: string;
  privacy_type: string;
  created_at?: string;
  title: string;
  description: string;
}

export interface BucketListContent {
  id?: number;
  tracker_id: number;
  activity: string;
  description: string;
  is_completed: boolean;
  user_id: number;
  date_added?: string;
  date_completed?: string;
}