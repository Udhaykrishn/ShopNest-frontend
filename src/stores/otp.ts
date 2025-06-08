import { create } from "zustand"

type OtpProps = {
    email: string;
    setEmail: (email: string) => void;
}

export const otpStore = create<OtpProps>((set, get) => ({
    email: "",
    setEmail: (email: string) => {
        console.log("Before email setting:", get().email);
        set({ email: email });
        console.log("After email setting:", get().email);
    },
}))