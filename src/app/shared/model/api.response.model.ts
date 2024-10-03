export interface ApiResponse<T> {
    data: T;
    errorMessage: string;
    dateTime: Date;
}

export interface PageableApiResponse<T> extends ApiResponse<T> {
    total_count: number;
}