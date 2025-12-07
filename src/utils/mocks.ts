import { faker } from '@faker-js/faker';
import { City, Offer, OfferExtended, Comment, OfferType } from '../types';

export const makeFakeCity = (): City => ({
  name: faker.location.city(),
  location: {
    latitude: faker.number.float({ min: -90, max: 90, fractionDigits: 6 }),
    longitude: faker.number.float({ min: -180, max: 180, fractionDigits: 6 }),
    zoom: faker.number.int({ min: 10, max: 16 }),
  },
});

export const makeFakeCities = (count: number): City[] =>
  Array.from({ length: count }, (): City => makeFakeCity());

export const makeFakeOffer = (): Offer => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  type: faker.helpers.arrayElement([
    'apartment',
    'room',
    'house',
    'hotel',
  ]) as OfferType,
  price: faker.number.int({ min: 50, max: 1000 }),
  city: makeFakeCity(),
  location: {
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    zoom: faker.number.int({ min: 10, max: 16 }),
  },
  isFavorite: faker.datatype.boolean(),
  isPremium: faker.datatype.boolean(),
  rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
  previewImage: faker.image.url(),
});

export const makeFakeOffers = (count: number): Offer[] =>
  Array.from({ length: count }, (): Offer => makeFakeOffer());

export const makeFakeExtendedOffer = (): OfferExtended => {
  const baseOffer = makeFakeOffer();

  return {
    ...baseOffer,
    description: faker.lorem.paragraph(),
    bedrooms: faker.number.int({ min: 1, max: 5 }),
    goods: Array.from({ length: 5 }, (): string => faker.commerce.product()),
    host: {
      name: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
      isPro: faker.datatype.boolean(),
    },
    images: Array.from({ length: 6 }, (): string => faker.image.url()),
    maxAdults: faker.number.int({ min: 1, max: 6 }),
  };
};

export const makeFakeComment = (): Comment => ({
  id: faker.string.uuid(),
  date: faker.date.recent().toISOString(),
  user: {
    name: faker.person.fullName(),
    avatarUrl: faker.image.avatar(),
    isPro: faker.datatype.boolean(),
  },
  comment: faker.lorem.paragraph(),
  rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
});

export const makeFakeComments = (count: number): Comment[] =>
  Array.from({ length: count }, (): Comment => makeFakeComment());
