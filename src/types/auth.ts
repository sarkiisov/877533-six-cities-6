export type AuthStatus = 'AUTH' | 'NO_AUTH' | 'UNKNOWN';

export type AuthInfo = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
  email: string;
  token: string;
};
