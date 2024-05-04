export type User = {
    email: string;
    password: string;
  };
  
  export type UserPublic = User & {
    id: number;
  };
  