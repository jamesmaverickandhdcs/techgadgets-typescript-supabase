// Type definitions for our application

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    stock: number;
    created_at?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export type Category = 'keyboards' | 'mice' | 'audio' | 'accessories' | 'all';

// NEW: Add these below
export interface Order {
    orderNumber: string;
    orderDate: string;
    customer: CustomerInfo;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    payment: string;
}

export interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal: string;
    country: string;
}