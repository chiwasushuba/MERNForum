import FollowType from './followType';

type UserDetailsType = {
  _id: string
  email: string
  username: string
  password: string
  profile: string
  bio: string
  followers: number
  following: number
  followedBy: FollowType[]
  followingUsers: FollowType[]
  verified: boolean
}

export default UserDetailsType;