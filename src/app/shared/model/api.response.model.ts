export interface ApiResponse<T> {
    data: T;
    errorMessage: string;
    dateTime: Date;
}