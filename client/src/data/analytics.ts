import { RevenueDataPoint, CategoryDataPoint, StatsData } from '../types';

export const REVENUE_DATA: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 15800 },
  { month: 'Mar', revenue: 13200 },
  { month: 'Apr', revenue: 18600 },
  { month: 'May', revenue: 22100 },
  { month: 'Jun', revenue: 19800 },
  { month: 'Jul', revenue: 24500 },
  { month: 'Aug', revenue: 21300 },
  { month: 'Sep', revenue: 27800 },
  { month: 'Oct', revenue: 25400 },
  { month: 'Nov', revenue: 31200 },
  { month: 'Dec', revenue: 28900 }
];

export const CATEGORY_DATA: CategoryDataPoint[] = [
  { name: 'Electronics', value: 38, color: '#6366f1' },
  { name: 'Clothing', value: 25, color: '#f59e0b' },
  { name: 'Home & Kitchen', value: 22, color: '#10b981' },
  { name: 'Sports', value: 15, color: '#ef4444' }
];

export const STATS: StatsData = {
  totalRevenue: '$261,000',
  totalOrders: 1847,
  avgOrderValue: '$141.31',
  conversionRate: '3.8%'
};
