export interface Product {
    _id?: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive';
    description: string;
    createdAt?: Date;
}