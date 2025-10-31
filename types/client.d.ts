interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    images: string[];
    category: string;
    serviceType: string;
    earnings: number;
}

export type { Client };