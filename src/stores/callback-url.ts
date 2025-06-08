import { create } from "zustand"

type urlProps = {
    url: string;
    fetchUrl: string;
    setUrl: (url: string) => void;
    setFetchUrl: (fetch: string) => void
}

export const urlStore = create<urlProps>((set) => ({
    url: "",
    fetchUrl: "",
    setUrl: (url: string) => set({ url }),
    setFetchUrl: (fetch: string) => set({ fetchUrl: fetch })
}))