
import { Product } from './types';

export const INITIAL_CATEGORIES = [
  'Polo T-Shirts',
  'Round Neck T-Shirts',
  'Joggers',
  'Chino Shorts',
  'Hoodies',
  'Sweatshirts'
];

export const PRODUCTS: Product[] = [
  {
    id: 'm1',
    name: 'Classic Pique Polo - Navy',
    category: 'Polo T-Shirts',
    price: 1499,
    originalPrice: 2499,
    description: 'A timeless navy blue pique polo crafted from 100% premium cotton for a breathable, comfortable fit.',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'White', 'Black'],
    rating: 4.8,
    reviewCount: 450,
    isNew: true,
    stock: 50,
    fabric: '100% Cotton Pique'
  },
  {
    id: 'm2',
    name: 'Tech-Fleece Joggers - Charcoal',
    category: 'Joggers',
    price: 2299,
    originalPrice: 3499,
    description: 'High-performance joggers featuring a tapered fit, zippered pockets, and moisture-wicking tech fleece.',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Grey'],
    rating: 4.9,
    reviewCount: 280,
    stock: 35,
    fabric: 'Polyester Blend'
  },
  {
    id: 'm3',
    name: 'Essential Round Neck Tee',
    category: 'Round Neck T-Shirts',
    price: 899,
    originalPrice: 1299,
    description: 'The perfect everyday tee. Soft-touch jersey fabric with a classic crew neck and premium finish.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Olive'],
    rating: 4.7,
    reviewCount: 1200,
    isNew: true,
    stock: 100,
    fabric: 'Supima Cotton'
  },
  {
    id: 'm4',
    name: 'Tailored Chino Shorts - Khaki',
    category: 'Chino Shorts',
    price: 1899,
    originalPrice: 2599,
    description: 'Smart-casual chino shorts with a tailored fit, perfect for weekend outings or summer vacations.',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: ['Khaki', 'Navy', 'Stone'],
    rating: 4.6,
    reviewCount: 190,
    stock: 25,
    fabric: 'Cotton Twill'
  },
  {
    id: 'm5',
    name: 'Overstated Hoodie - Sand',
    category: 'Hoodies',
    price: 2999,
    originalPrice: 4499,
    description: 'Heavyweight loopback cotton hoodie with an oversized fit and dropped shoulders for a modern silhouette.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Sand', 'Black'],
    rating: 4.8,
    reviewCount: 320,
    stock: 15,
    fabric: 'Heavyweight Loopback Cotton'
  },
  {
    id: 'm6',
    name: 'Slim Fit Oxford Shirt',
    category: 'Round Neck T-Shirts',
    price: 1999,
    originalPrice: 2999,
    description: 'Though categorized under essentials, this Oxford shirt is a staple for every man\'s wardrobe.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Light Blue', 'White'],
    rating: 4.5,
    reviewCount: 110,
    stock: 40,
    fabric: 'Oxford Cotton'
  }
];
