export type Page<T> = {
    content: T[];
    first: boolean;
    last: boolean;
    number: number;
    size: number;
    totalElements: number;
};
