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