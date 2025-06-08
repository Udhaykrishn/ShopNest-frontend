import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { productForm } from "@/types/product";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/types";
import { toast } from "@/hooks";

export const DescriptionInputWithModal: React.FC<{
    form: UseFormReturn<productForm>;
    onClear: () => void;
}> = ({ form, onClear }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: (prompt: string) => api.post("http://shopnest.zapto.org/api/categorys/gemini", { prompt }).then((res) => res.data),
        onSuccess: (data: any) => {
            form.setValue("description", data.data, { shouldValidate: true });
            toast({ title: "Success", description: "Description generated successfully!" });
        },
        onError: () => toast({ title: "Error", description: "Failed to generate description.", variant: "destructive" }),
    });

    const handleGenerate = () => {
        const name = form.getValues("name") || "Unnamed Product";
        const brand = form.getValues("brand") || "Generic Brand";
        mutate(`
            Generate a 10-point product description for ${name} by ${brand}. 
            Format it as a numbered list (1-10) with each point highlighting a unique feature or benefit for an e-commerce listing. 
            Use plain text only, without bold markers like **, asterisks, or other formatting symbols.
        `);
    };

    return (
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Enter product description" className="min-h-32" {...field} />
                    </FormControl>
                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Generate"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={onClear}>Clear</Button>
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">Open</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Manage Description</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <Textarea placeholder="Generated description" className="min-h-32" value={form.getValues("description")} readOnly />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={handleGenerate} disabled={isPending}>
                                            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Generate"}
                                        </Button>
                                        <Button variant="outline" onClick={onClear}>Clear</Button>
                                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};