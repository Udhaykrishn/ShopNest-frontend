import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

interface FormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    field: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

export const FormDialog: React.FC<FormDialogProps> = ({
    open,
    onOpenChange,
    title,
    description,
    field,
    value,
    onChange,
    onSave,
    onCancel,
    isLoading
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Input
                    className="mb-4"
                    placeholder={`${field} Name`}
                    value={value}
                    onChange={onChange}
                    disabled={isLoading}
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button onClick={onSave} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog >
);
