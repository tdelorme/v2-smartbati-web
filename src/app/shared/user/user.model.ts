export interface User {
    id?: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    active?: boolean;
    accountVerified?: boolean;
}