export type Status = 'active' | 'blocked';

export interface Category {
    _id: string;
    name: string;
    offer:number;
    subCategory: Array<string>;
    isBlocked: boolean;
}

export interface SubcategoryWithParent {
    categoryId: number;
    categoryName: string;
    categoryStatus: Status;
}

export interface NewCategory {
    name: string;
}

export interface NewSubcategory{
    name: string;
    categoryId: number | null;
}