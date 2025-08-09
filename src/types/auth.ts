export type RegisterDto = {
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthResponse = {
  userId: string;
  userName: string;
  email: string;
  token: string; //JWT
  expiration: string; // ISO from server
};
