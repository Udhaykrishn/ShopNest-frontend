export type Offer = {
    _id:string;
    name:string;
    discount:number,
    start_date:string | Date,
    end_date:string | Date,
    isBlocked:boolean,
    type:string,
    category:string,
    status:string;
}