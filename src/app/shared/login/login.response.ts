export interface LoginResponse {
    username: string;
    tokenValid: boolean;
    authValid: boolean;
    message: string;
    jwt: string;
}