export interface OrderItem {
    productName: string;
    qty: number;
    price: number;
    subtotal?: number;
}

export interface Order {
    _id?: string;           // ← MongoDB id
    customerName: string;
    email: string;
    items: OrderItem[];
    totalAmount: number;
    createdAt?: Date;
}