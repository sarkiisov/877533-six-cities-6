export type Card = {
  id: string;
  isPremium?: boolean;
  imageSrc?: string;
  price: number;
  isBookmarked?: boolean;
  rating: number;
  name: string;
  type: 'Apartment' | 'Room';
};
