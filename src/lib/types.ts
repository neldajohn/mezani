export type Restaurant = {
  id: number;
  slug: string;
  name: string;
  city: string;
  neighborhood: string;
  cuisine: string;
  priceRange: number;
  rating: number;
  reviewCount: number;
  description: string;
  address: string;
  phone: string;
  opensAt: string;
  closesAt: string;
  accent: string;
  emoji: string;
  popularDishes: string[];
};

export type Reservation = {
  id: number;
  code: string;
  restaurantId: number;
  fullName: string;
  phone: string;
  email: string | null;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  specialRequest: string | null;
  status: string;
  createdAt: string;
};

export type MenuItem = {
  id: number;
  restaurantId: number;
  name: string;
  category: string;
  price: number;
};

export type ReservationItem = {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
};

export type ReservationWithRestaurant = Reservation & {
  restaurant: Restaurant;
  items: ReservationItem[];
};

export type RestaurantAccount = {
  id: number;
  whatsappNumber: string;
  restaurantId: number | null;
};
