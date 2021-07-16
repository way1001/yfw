export interface User {
  email?: string;
  name?: string;
  userStats?: UserStats;
  isFollowedByMe?: boolean;
  avatarHash?: string;
}

export interface UserStats {
  micropostCnt: number;
  followingCnt: number;
  followerCnt: number;
}

export interface Authorized {
  username: string;
  authorization: string;
}

export interface SendStatus {
  phone: string;
  message: string;
}
