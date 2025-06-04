import { toast } from "@/hooks";


export const handleGenerateDescription = ({ form, generateDescriptionMutation }) => {
    const name = form.getValues("name");
    const brand = form.getValues("brand");
    if (!name || !brand) {
        toast({
            title: "Error",
            description: "Please enter both product name and brand first.",
            variant: "destructive",
        });
        return;
    }
    const prompt = `Write a point-based description for ${brand} ${name}. Include its capabilities and format the description like Amazon and Flipkart product descriptions with numbered points (e.g., 1., 2., etc.). Use the same font format without bold text, and do not include additional comments or notes. should be need more points`;
    generateDescriptionMutation.mutate(prompt);
};
