
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  location: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  customerName: string;
  customerAddress: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export interface FilterOptions {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}
