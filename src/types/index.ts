export type Location = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type City = {
  name: string;
  location: Location;
};

export type OfferType = 'apartment' | 'room' | 'house' | 'hotel';

export type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  previewImage: string;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
};

export type OfferExtended = {
  id: string;
  title: string;
  type: OfferType;
  price: number;
  city: City;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  description: string;
  bedrooms: number;
  goods: string[];
  host: {
    avatarUrl: string;
    isPro: boolean;
    name: string;
  };
  images: string[];
  maxAdults: number;
};

export type Point = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
};

export type Comment = {
  id: string;
  date: string;
  user: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  comment: string;
  rating: number;
};

export type AuthorizationStatus = 'AUTH' | 'NO_AUTH' | 'UNKNOWN';

export type AuthInfo = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
  email: string;
  token: string;
};
