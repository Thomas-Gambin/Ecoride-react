export type ProfileType = "passenger" | "driver" | "passenger_driver"

export type AuthUser = {
  id: number
  email: string
  username: string
  roles: string[]
  credits: number
  isVerified: boolean
  profileType: ProfileType
}
