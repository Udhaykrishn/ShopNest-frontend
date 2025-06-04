import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet as WalletIcon, Plus } from 'lucide-react';
import { formatINR } from '@/utils';
import { IVendorTransaction, WalletProps } from '@/types/wallet';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { PaymentComponent } from '@/components/payment';
import { router } from '@/router';
import { Link } from '@tanstack/react-router';

function formatDate(date: string) {
    return date.split('').slice(0, 10).join("");
}

export const Wallet = ({ data, addToWallet, route }: WalletProps<IVendorTransaction>) => {
    const { balance, transactions } = data.data;
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const suggestedAmounts = [100, 500, 1000];
    const [page, setPage] = useState(1);
    const limit = 5;


    const totalPage = Math.ceil(data.total / limit);

    console.log(totalPage)
    const MAX_AMOUNT = 10000;

    const handlePaymentSuccess = async () => {
        await addToWallet.mutateAsync(amount, {
            onSuccess: () => {
                router.load();
            }
        })
        setIsOpen(false);
        setAmount('');
        setError('');
    };

    const handlePaymentFailure = (error: any) => {
        console.error("Payment Failed:", error);
    };

    const handlePaymentDismiss = () => {
        setIsOpen(false);
        setAmount('');
        setError('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            const numValue = parseFloat(value);
            if (value === '' || numValue <= MAX_AMOUNT) {
                setAmount(value);
                setError('');
            } else {
                setError(`Amount cannot exceed ₹${formatINR(MAX_AMOUNT)}`);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedKeys = [
            'Backspace',
            'Delete',
            'ArrowLeft',
            'ArrowRight',
            'Tab',
            'Enter',
        ];
        if (allowedKeys.includes(e.key)) {
            return;
        }
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleSuggestedAmount = (value: number) => {
        if (value <= MAX_AMOUNT) {
            setAmount(value.toString());
            setError('');
        } else {
            setError(`Amount cannot exceed ₹${formatINR(MAX_AMOUNT)}`);
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 shadow-lg rounded-xl transition-transform hover:scale-[1.02] duration-300">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <WalletIcon className="h-10 w-10 text-primary animate-pulse" />
                        <CardTitle className="text-2xl font-semibold text-gray-800">
                            Wallet Balance
                        </CardTitle>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add Money
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-lg">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-semibold">Add Money to Wallet</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-sm font-medium">Amount (₹)</Label>
                                    <Input
                                        id="amount"
                                        type="text"
                                        value={amount}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Enter amount"
                                        className="w-full rounded-lg border-gray-300 focus:ring-primary"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        max={MAX_AMOUNT}
                                    />
                                    {error && (
                                        <p className="text-sm text-red-600">{error}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {suggestedAmounts.map((value) => (
                                        <Button
                                            key={value}
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleSuggestedAmount(value)}
                                            className={`flex-1 rounded-lg border-gray-300 hover:bg-primary hover:text-white transition-colors ${amount === value.toString() ? 'bg-primary text-white' : ''
                                                }`}
                                        >
                                            ₹{value}
                                        </Button>
                                    ))}
                                </div>
                                {amount && parseFloat(amount) > 0 && parseFloat(amount) <= MAX_AMOUNT && (
                                    <PaymentComponent
                                        amount={parseFloat(amount)}
                                        onSuccess={handlePaymentSuccess}
                                        onFailure={handlePaymentFailure}
                                        onDismiss={handlePaymentDismiss}
                                    />
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-extrabold text-primary tracking-tight">
                        {formatINR(balance)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        Available balance as of {new Date().toLocaleDateString()}
                    </p>
                </CardContent>
            </Card>

            <Card className="shadow-md rounded-xl">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                        Transaction History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-lg">
                            No transactions found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="text-left text-gray-700 font-semibold text-lg py-4 w-1/3">
                                            Date
                                        </TableHead>
                                        <TableHead className="text-left text-gray-700 font-semibold text-lg py-4 w-1/3">
                                            Type
                                        </TableHead>
                                        <TableHead className="text-right text-gray-700 font-semibold text-lg py-4 w-1/3">
                                            Amount
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction, index) => (
                                        <TableRow
                                            key={index}
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                } hover:bg-gray-100 transition-colors duration-200`}
                                        >
                                            <TableCell className="text-left font-medium text-lg text-gray-800 py-4 w-1/3">
                                                {transaction?.date
                                                    ? formatDate(transaction?.date)
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-left font-medium text-lg py-4 w-1/3">
                                                <span
                                                    className={`${transaction?.type === 'credit'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                        } font-semibold`}
                                                >
                                                    {transaction?.type.charAt(0).toUpperCase() +
                                                        transaction?.type.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-lg text-gray-800 py-4 w-1/3">
                                                {formatINR(transaction?.amount)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className='w-full flex items-center justify-end'>
                                <Button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}>
                                    <Link className='w-full' to={route} search={{ page: page - 1, limit }}>
                                        prev
                                    </Link>
                                </Button>
                                <span className='bold ml-5 mr-5'> {page} of {totalPage} </span>
                                <Button
                                    disabled={page === totalPage}
                                    onClick={() => {
                                        setPage(page + 1)
                                    }}>
                                    <Link className='w-full border-1' to={route} search={{ page: page + 1, limit }}>
                                        next
                                    </Link>
                                </Button>
                            </div>
                        </div>

                    )}
                </CardContent>

            </Card>

        </div>
    );
};