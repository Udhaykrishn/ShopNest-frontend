import { useState } from 'react';
import { TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Shield, ShieldOff } from 'lucide-react';
import { Vendor } from '@/types/vendor';

interface VendorListProps {
  vendors: Vendor[];
  openDialog: (vendor: Vendor, type: 'block' | 'unblock') => void;
  page: number;
  pageSize: number;
}

export const VendorList: React.FC<VendorListProps> = ({
  vendors,
  openDialog,
  page,
  pageSize,
}) => {
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const handleBlockClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsBlockModalOpen(true);
  };

  const handleConfirmBlock = () => {
    if (selectedVendor) {
      openDialog(selectedVendor, 'block');
    }
    setIsBlockModalOpen(false);
    setSelectedVendor(null);
  };

  const handleCancelBlock = () => {
    setIsBlockModalOpen(false);
    setSelectedVendor(null);
  };

  return (
    <>
      <TableBody>
        {vendors.length > 0 ? (
          vendors.map((vendor, index) => (
            <TableRow key={vendor._id} className="hover:bg-muted/30">
              <TableCell className="text-center text-muted-foreground w-[50px]">
                {(page - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell className="text-center">
                {vendor.username}
                {vendor.isBlocked && (
                  <Badge variant="outline" className="ml-2 bg-red-50 text-red-800 border-red-200">
                    Blocked
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-center">{vendor.phone || 'N/A'}</TableCell>
              <TableCell className="text-center">{vendor.email}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={`capitalize ${
                    vendor.isBlocked
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {vendor.isBlocked ? 'Blocked' : 'Active'}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant={vendor.isBlocked ? 'outline' : 'destructive'}
                  size="sm"
                  onClick={() =>
                    vendor.isBlocked
                      ? openDialog(vendor, 'unblock')
                      : handleBlockClick(vendor)
                  }
                  className="flex items-center gap-1 mx-auto"
                >
                  {vendor.isBlocked ? (
                    <Shield className="h-3 w-3" />
                  ) : (
                    <ShieldOff className="h-3 w-3" />
                  )}
                  {vendor.isBlocked ? 'Unblock' : 'Block'}
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No vendors found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      {/* Confirmation Modal for Block Action */}
      <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Block Vendor</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to block the vendor "{selectedVendor?.username}"? This action will
              restrict their access.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelBlock}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBlock}
              className="flex items-center gap-1"
            >
              <ShieldOff className="h-4 w-4" />
              Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};