import { nanoid } from 'nanoid';

const OfferPack = {
  TAXI: [
    {
      id: nanoid(),
      shortTitle: 'uber',
      title: 'Order Uber',
      price: 20,
    },
    {
      id: nanoid(),
      shortTitle: 'business',
      title: 'Upgrade to a business class',
      price: 120,
    },
  ],
  BUS: [],
  TRAIN: [],
  SHIP: [],
  FLIGHT: [
    {
      id: nanoid(),
      shortTitle: 'luggage',
      title: 'Add luggage',
      price: 30,
    },
    {
      id: nanoid(),
      shortTitle: 'comfort',
      title: 'Switch to comfort class',
      price: 100,
    },
    {
      id: nanoid(),
      shortTitle: 'meal',
      title: 'Add meal',
      price: 15,
    },
    {
      id: nanoid(),
      shortTitle: 'seats',
      title: 'Choose seats',
      price: 5,
    },
    {
      id: nanoid(),
      shortTitle: 'train',
      title: 'Travel by train',
      price: 40,
    },
  ],
  DRIVE: [
    {
      id: nanoid(),
      shortTitle: 'rent',
      title: 'Rent a car',
      price: 200,
    },
  ],
  CHECK_IN: [
    {
      id: nanoid(),
      shortTitle: 'breakfast',
      title: 'Add breakfast',
      price: 50,
    },
  ],
  SIGHTSEEING: [
    {
      id: nanoid(),
      shortTitle: 'tickets',
      title: 'Book tickets',
      price: 40,
    },
    {
      id: nanoid(),
      shortTitle: 'lunch',
      title: 'Lunch in city',
      price: 30,
    },
  ],
  RESTAURANT: [],
};

export { OfferPack };
