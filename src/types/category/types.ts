// types/index.ts
export interface Category {
    id: number;
    name: string;
    status: "active" | "inactive";
    subcategories: string[];
}


export interface SubcategoryWithParent {
    categoryId: number;
    categoryName: string;
    categoryStatus: "active" | "inactive";
}

