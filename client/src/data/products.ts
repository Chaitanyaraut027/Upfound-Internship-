import { Product, RevenueDataPoint, CategoryDataPoint, StatsData } from '../types';

export const CATEGORIES: string[] = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Sports'];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/prod1/400/400',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life. Features comfortable over-ear design with memory foam cushions.',
    specifications: [
      { label: 'Battery Life', value: '30 hours' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' },
      { label: 'Weight', value: '250g' },
      { label: 'Driver Size', value: '40mm' }
    ],
    inStock: true,
    stockCount: 45,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    price: 199.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/prod2/400/400',
    description: 'Advanced fitness tracker with GPS, heart rate monitoring, and 7-day battery life. Water resistant to 50m.',
    specifications: [
      { label: 'Display', value: '1.4" AMOLED' },
      { label: 'Battery', value: '7 days' },
      { label: 'Water Resistance', value: '50m' },
      { label: 'Sensors', value: 'HR, SpO2, GPS' }
    ],
    inStock: true,
    stockCount: 28,
    rating: 4.7
  },
  {
    id: '3',
    name: 'USB-C Hub Adapter',
    price: 49.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/prod3/400/400',
    description: '8-in-1 USB-C hub with HDMI 4K output, USB 3.0 ports, SD card reader, and 100W power delivery passthrough.',
    specifications: [
      { label: 'Ports', value: '8-in-1' },
      { label: 'HDMI', value: '4K@60Hz' },
      { label: 'PD', value: '100W' },
      { label: 'USB', value: '3.0 x3' }
    ],
    inStock: true,
    stockCount: 62,
    rating: 4.3
  },
  {
    id: '4',
    name: 'Classic Denim Jacket',
    price: 89.99,
    category: 'Clothing',
    image: 'https://picsum.photos/seed/prod4/400/400',
    description: 'Timeless denim jacket crafted from premium heavyweight cotton. Features button closure, chest pockets, and adjustable waist tabs.',
    specifications: [
      { label: 'Material', value: '100% Cotton Denim' },
      { label: 'Fit', value: 'Regular' },
      { label: 'Closure', value: 'Button' },
      { label: 'Care', value: 'Machine Wash' }
    ],
    inStock: true,
    stockCount: 35,
    rating: 4.6
  },
  {
    id: '5',
    name: 'Running Sneakers Pro',
    price: 129.99,
    category: 'Clothing',
    image: 'https://picsum.photos/seed/prod5/400/400',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for everyday comfort and performance.',
    specifications: [
      { label: 'Upper', value: 'Breathable Mesh' },
      { label: 'Sole', value: 'EVA Foam' },
      { label: 'Weight', value: '280g' },
      { label: 'Drop', value: '8mm' }
    ],
    inStock: false,
    stockCount: 0,
    rating: 4.4
  },
  {
    id: '6',
    name: 'Merino Wool Sweater',
    price: 69.99,
    category: 'Clothing',
    image: 'https://picsum.photos/seed/prod6/400/400',
    description: 'Luxuriously soft merino wool crew neck sweater. Temperature regulating and naturally odor resistant for all-day comfort.',
    specifications: [
      { label: 'Material', value: '100% Merino Wool' },
      { label: 'Fit', value: 'Slim' },
      { label: 'Neckline', value: 'Crew Neck' },
      { label: 'Care', value: 'Hand Wash' }
    ],
    inStock: true,
    stockCount: 22,
    rating: 4.8
  },
  {
    id: '7',
    name: 'Stainless Steel Cookware Set',
    price: 249.99,
    category: 'Home & Kitchen',
    image: 'https://picsum.photos/seed/prod7/400/400',
    description: '10-piece premium stainless steel cookware set with tri-ply construction. Oven safe to 500°F and dishwasher compatible.',
    specifications: [
      { label: 'Pieces', value: '10' },
      { label: 'Material', value: 'Tri-Ply Stainless' },
      { label: 'Oven Safe', value: '500°F' },
      { label: 'Dishwasher', value: 'Yes' }
    ],
    inStock: true,
    stockCount: 15,
    rating: 4.6
  },
  {
    id: '8',
    name: 'Smart LED Desk Lamp',
    price: 59.99,
    category: 'Home & Kitchen',
    image: 'https://picsum.photos/seed/prod8/400/400',
    description: 'Adjustable LED desk lamp with 5 brightness levels and 3 color temperatures. Features wireless charging base and USB port.',
    specifications: [
      { label: 'Brightness', value: '5 Levels' },
      { label: 'Color Temps', value: '3 Modes' },
      { label: 'Charging', value: 'Qi Wireless' },
      { label: 'Power', value: '12W LED' }
    ],
    inStock: true,
    stockCount: 40,
    rating: 4.2
  },
  {
    id: '9',
    name: 'Bamboo Cutting Board Set',
    price: 34.99,
    category: 'Home & Kitchen',
    image: 'https://picsum.photos/seed/prod9/400/400',
    description: 'Set of 3 organic bamboo cutting boards in different sizes. Naturally antimicrobial with juice grooves and easy-grip handles.',
    specifications: [
      { label: 'Material', value: 'Organic Bamboo' },
      { label: 'Sizes', value: 'S, M, L' },
      { label: 'Features', value: 'Juice Grooves' },
      { label: 'Care', value: 'Hand Wash' }
    ],
    inStock: true,
    stockCount: 55,
    rating: 4.5
  },
  {
    id: '10',
    name: 'Yoga Mat Premium',
    price: 44.99,
    category: 'Sports',
    image: 'https://picsum.photos/seed/prod10/400/400',
    description: 'Extra thick 6mm yoga mat with non-slip surface and alignment markers. Includes carrying strap and is eco-friendly.',
    specifications: [
      { label: 'Thickness', value: '6mm' },
      { label: 'Material', value: 'TPE Eco-Friendly' },
      { label: 'Size', value: '72" x 24"' },
      { label: 'Weight', value: '2.5 lbs' }
    ],
    inStock: true,
    stockCount: 30,
    rating: 4.7
  },
  {
    id: '11',
    name: 'Resistance Bands Set',
    price: 29.99,
    category: 'Sports',
    image: 'https://picsum.photos/seed/prod11/400/400',
    description: '5 pack resistance bands with varying resistance levels. Perfect for home workouts, rehabilitation, and strength training.',
    specifications: [
      { label: 'Bands', value: '5 Levels' },
      { label: 'Material', value: 'Natural Latex' },
      { label: 'Includes', value: 'Carry Bag' },
      { label: 'Max Stretch', value: '3x Length' }
    ],
    inStock: true,
    stockCount: 70,
    rating: 4.4
  },
  {
    id: '12',
    name: 'Insulated Water Bottle',
    price: 24.99,
    category: 'Sports',
    image: 'https://picsum.photos/seed/prod12/400/400',
    description: 'Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold 24 hours or hot 12 hours. BPA-free lid.',
    specifications: [
      { label: 'Capacity', value: '32 oz' },
      { label: 'Insulation', value: 'Double Wall' },
      { label: 'Cold', value: '24 hours' },
      { label: 'Hot', value: '12 hours' }
    ],
    inStock: false,
    stockCount: 0,
    rating: 4.6
  }
];
