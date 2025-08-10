export type RegisterDto = {
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthResponse = {
  userId: string;       // Guid serialized
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  token: string;
  expiration: string;   // ISO from backend
};
