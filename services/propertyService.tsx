export type Property = {
  id: string;
  price: number;
  address: string;
  photos: string[];
};

export async function fetchProperties(p0: { location: string; minPrice: number; maxPrice: number; }): Promise<Property[]> {
  return [
    {
      id: '1',
      price: 350000,
      address: '123 Main St, Springfield',
      photos: ['https://via.placeholder.com/400x300'],
    },
    {
      id: '2',
      price: 450000,
      address: '456 Elm St, Shelbyville',
      photos: ['https://via.placeholder.com/400x300'],
    },
  ];
}