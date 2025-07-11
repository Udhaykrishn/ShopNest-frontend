export const formatINR = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
        style: 'currency',
        currency: "INR",
        minimumFractionDigits: 2,
    }).format(amount)
}