export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  specifications: ProductSpecification[];
  inStock: boolean;
  stockCount: number;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'customer' | 'supplier';
  timestamp: string;
}

export type UserRole = 'customer' | 'supplier' | null;

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface StatsData {
  totalRevenue: string;
  totalOrders: number;
  avgOrderValue: string;
  conversionRate: string;
}
