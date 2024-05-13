export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

declare module 'express' {
  export interface Request {
    user: UserData;
    userID: string;
    email: string;
  }
}
