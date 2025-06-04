import { Users, ClipboardCheck } from 'lucide-react';
import { ApprovalManagement } from "@/components/admin/vendors/approval-mangement";
import  VendorMangement  from './vendor-mangement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export const VendorTable = () => {
    return (
        <Tabs defaultValue="vendor" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
                <TabsTrigger value="vendor" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Vendors 
                </TabsTrigger>
                <TabsTrigger value="approvals" className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    Approvals 
                </TabsTrigger>
            </TabsList>

            <TabsContent value="vendor">
                <VendorMangement />
            </TabsContent>

            <TabsContent value="approvals">
                <ApprovalManagement />
            </TabsContent>
        </Tabs>
    );
};

