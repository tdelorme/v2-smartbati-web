export interface User {
    id?: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    zipCode?: string;
    city?: string;
    active?: boolean;
    accountVerified?: boolean;
    website?: string;
    tax?: number;
    footer?: string;
    maxValidityBilling?: number;
}