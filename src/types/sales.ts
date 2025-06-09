export interface TopProduct {
  productName: string;
  price: number;
  orderedDate:string;
  orderId:number,
  quantity: number;
  image: string;
  total: number,
  status: string;
}

export interface OrderCount {
  _id: string;
  count: number;
}

export interface TotalSales {
  sum: number;
  count: number;
}

export interface HighestPaidVendor {
  vendor_name: string;
  vendor_email: string;
  payout: number;
}

export interface RolesCount {
  users_count: number;
  vendors_count: number;
}

export interface BackendData {
  revenue: number;
  products: number;
  topProducts: TopProduct[];
  totalSales: TotalSales;
  orderCount: OrderCount[];
  discount: number;
  highestPaidVendor: HighestPaidVendor[];
  rolesCount: RolesCount;
  bestSellCategory:BestSellCategory[]
}

export interface BestSellCategory {
  category: string;
  totalRevenue: number;
  totalSold: number;
}

export interface DashboardContentProps {
  backendData: BackendData;
}