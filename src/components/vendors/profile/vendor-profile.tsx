import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneIcon, MailIcon, UserIcon, CalendarIcon, Loader2, User } from 'lucide-react';
import { useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { uploadToSupabase } from '@/utils/file-upload';
import { useUserMutation } from '@/hooks/user/useUserProfile';
import { useVendorAuthStore } from '@/stores/vendor/vendorAuthStore';



// function extractUserData(data: any): UserData {
//   return {
//     username: data.username,
//     phone:  data.phone,
//     avatar:data.avatar
//   };
// }

export function VendorProfile() {

    const {vendor} = useVendorAuthStore()

    console.log("vendor is: ",vendor)
  
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<typeof vendor>>({
    username: "",
    phone: "",
    avatar: "",
  });
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null); // State for image preview
  const navigate = useNavigate();
  const { updateProfile } = useUserMutation();



  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleChangePassword = () => {
    navigate({ to: "/vendor/forgot" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedFormData = { ...formData };

      if (selectedFile) {
        const { url } = await uploadToSupabase(selectedFile);
        updatedFormData.avatar = url;
      }
      await updateProfile.mutateAsync(updatedFormData);
      setOpen(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">My Profile</h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Avatar>
                <AvatarImage src={vendor?.avatar} />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground">{}</h2>
              <p className="text-muted-foreground">Vendor Profile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <div className="mb-4">
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Username
                </div>
                <div className="text-foreground">{vendor?.username}</div>
              </div>

              <div>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <PhoneIcon className="mr-2 h-4 w-4" />
                  Phone
                </div>
                <div className="text-foreground">{vendor?.phone}</div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <MailIcon className="mr-2 h-4 w-4" />
                  Email
                </div>
                <div className="text-foreground">{vendor?.email}</div>
              </div>

              <div>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Join Date
                </div>
                <div className="text-foreground">{formatJoinDate(vendor?.createdAt as string)}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background text-foreground">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar" className="text-foreground">Profile Picture</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border-border bg-background text-foreground"
                    />
                    {previewUrl && (
                      <div className="mt-2">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={previewUrl} alt="Preview" />
                          <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-foreground">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={vendor?.username}
                      onChange={handleInputChange}
                      className="border-border bg-background text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={vendor?.phone}
                      onChange={handleInputChange}
                      className="border-border bg-background text-foreground"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => {
                      setOpen(false);
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                      setSelectedFile(null);
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-500 hover:bg-green-600">
                      {updateProfile.isPending ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Save Changes
                        </>
                      ) : (
                        <>Save Changes</>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Security Settings</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your account security</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Password</h3>
              <p className="text-sm text-muted-foreground">Change your account password</p>
            </div>
            <Button
              onClick={handleChangePassword}
              className="bg-green-500 hover:bg-green-600"
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}