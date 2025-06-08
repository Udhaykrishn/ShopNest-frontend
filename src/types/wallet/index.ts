interface Transaction {
    _id: string;
    amount: number;
    type: 'credit' | 'debit';
    date: string;
}

export interface IUserTransaction extends Transaction {
    userId: string;
}

export interface IVendorTransaction extends Transaction {
    vendorId: string;
    
}

interface WalletData<T extends Transaction = Transaction> {
    data: { balance: any; transactions: any; };
    balance: number;
    transactions: T[];
    total: number;
}

export interface WalletProps<T extends Transaction = Transaction> {
    data: WalletData<T>;
    route:string;
    addToWallet:any;
}
