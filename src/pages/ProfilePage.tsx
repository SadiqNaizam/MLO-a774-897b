import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ShoppingCart, User, Edit3, Save, PlusCircle, Trash2, MapPin, CreditCard, History, LogOut } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});

const addressSchema = z.object({
    id: z.string().optional(),
    label: z.string().min(2, "Label is required (e.g., Home, Work)"),
    addressLine1: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(5, "Postal code is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

const mockUser = {
  fullName: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+15551234567",
};

const mockAddresses: AddressFormData[] = [
  { id: 'addr1', label: 'Home', addressLine1: '123 Willow Creek Rd', city: 'Springfield', postalCode: '62704' },
  { id: 'addr2', label: 'Work', addressLine1: '456 Business Park Ave', city: 'Springfield', postalCode: '62701' },
];

const mockOrderHistory = [
  { id: 'ORD789', date: '2024-07-10', total: 45.50, status: 'Delivered', restaurant: 'Pizza Place', items: [{name: 'Pepperoni Pizza', qty: 1}, {name: 'Coke', qty:4}] },
  { id: 'ORD456', date: '2024-06-25', total: 22.00, status: 'Delivered', restaurant: 'Sushi Spot', items: [{name: 'California Roll', qty: 2}] },
  { id: 'ORD123', date: '2024-06-15', total: 35.75, status: 'Cancelled', restaurant: 'Burger Joint', items: [{name: 'Cheeseburger', qty: 1}, {name: 'Fries', qty:1}] },
];

const AppNavigationMenu = () => (
  <NavigationMenu className="py-2 border-b mb-4 sticky top-0 bg-white z-50">
    <NavigationMenuList className="container mx-auto flex justify-between items-center px-4">
      <NavigationMenuItem>
        <RouterLink to="/">
          <div className="font-bold text-xl text-primary">FoodFleet</div>
        </RouterLink>
      </NavigationMenuItem>
      <div className="flex items-center space-x-2">
        <NavigationMenuItem>
          <RouterLink to="/checkout">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <RouterLink to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5 text-primary" /> {/* Highlight current page */}
            </Button>
          </RouterLink>
        </NavigationMenuItem>
      </div>
    </NavigationMenuList>
  </NavigationMenu>
);


const ProfilePage: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressFormData[]>(mockAddresses);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressFormData | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile-settings");

  useEffect(() => {
    console.log('ProfilePage/OrderHistoryPage loaded');
    if (location.hash === "#order-history") {
      setActiveTab("order-history");
    }
  }, [location]);


  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: mockUser,
  });

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: '', addressLine1: '', city: '', postalCode: ''}
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log("Profile updated:", data);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  const handleEditAddress = (address: AddressFormData) => {
    setEditingAddress(address);
    addressForm.reset(address);
    setIsAddressModalOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    addressForm.reset({ label: '', addressLine1: '', city: '', postalCode: ''});
    setIsAddressModalOpen(true);
  };
  
  const onAddressSubmit = (data: AddressFormData) => {
    if (editingAddress && editingAddress.id) {
      setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? {...data, id: editingAddress.id } : addr));
      toast({ title: "Address Updated", description: `Address "${data.label}" has been saved.` });
    } else {
      setAddresses(prev => [...prev, { ...data, id: `addr${Date.now()}` }]);
      toast({ title: "Address Added", description: `New address "${data.label}" has been added.` });
    }
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast({ title: "Address Removed", variant: "destructive" });
  };
  
  const handleLogout = () => {
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    // Add actual logout logic here (e.g., clear token, redirect to login)
    navigate('/'); // Redirect to homepage after logout
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <AppNavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                        <AlertDialogDescription>You will be returned to the homepage.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">Logout</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6">
            <TabsTrigger value="profile-settings" className="flex items-center gap-2"><User className="h-4 w-4" /> Profile Settings</TabsTrigger>
            <TabsTrigger value="order-history" className="flex items-center gap-2"><History className="h-4 w-4" /> Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile-settings">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Information Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Manage your personal details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <FormField control={profileForm.control} name="fullName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={profileForm.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl><Input type="email" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={profileForm.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl><Input type="tel" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Saved Addresses Card */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Saved Addresses</CardTitle>
                            <CardDescription>Manage your delivery locations.</CardDescription>
                        </div>
                        <Button size="sm" onClick={handleAddNewAddress}><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {addresses.length > 0 ? addresses.map(addr => (
                            <Card key={addr.id} className="p-4 bg-muted/30">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold">{addr.label}</h4>
                                        <p className="text-sm text-gray-600">{addr.addressLine1}</p>
                                        <p className="text-sm text-gray-600">{addr.city}, {addr.postalCode}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditAddress(addr)}><Edit3 className="h-4 w-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Delete Address?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete the address "{addr.label}"?</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteAddress(addr.id!)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </Card>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No saved addresses yet.</p>
                        )}
                    </CardContent>
                </Card>
                 {/* Saved Payment Methods Card (Placeholder) */}
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Saved Payment Methods</CardTitle>
                            <CardDescription>Manage your payment options.</CardDescription>
                        </div>
                         <Button size="sm" variant="outline" disabled><CreditCard className="mr-2 h-4 w-4" /> Add New (Soon)</Button>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500 text-center py-4">Feature coming soon! You'll be able to save payment methods here.</p>
                    </CardContent>
                </Card>
            </div>
          </TabsContent>

          <TabsContent value="order-history">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Your Order History</CardTitle>
                <CardDescription>Review your past orders.</CardDescription>
              </CardHeader>
              <CardContent>
                {mockOrderHistory.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {mockOrderHistory.map(order => (
                      <AccordionItem value={`order-${order.id}`} key={order.id}>
                        <AccordionTrigger>
                          <div className="flex justify-between items-center w-full pr-4">
                            <span className="font-medium">Order ID: {order.id} ({order.restaurant})</span>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">{order.date}</span>
                                <Badge variant={order.status === 'Delivered' ? 'default' : (order.status === 'Cancelled' ? 'destructive' : 'secondary')}>{order.status}</Badge>
                                <span className="font-semibold">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="font-medium">Items:</p>
                          <ul className="list-disc list-inside pl-4 text-sm text-gray-600">
                            {order.items.map(item => <li key={item.name}>{item.name} (x{item.qty})</li>)}
                          </ul>
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/order-tracking/${order.id}`)}>Track Order</Button>
                            <Button size="sm" variant="outline" disabled={order.status !== 'Delivered'}>Reorder (Soon)</Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-gray-500 text-center py-10">You have no past orders.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Address Modal/Dialog */}
        <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                    <DialogDescription>
                        {editingAddress ? 'Update the details for this address.' : 'Enter the details for your new address.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...addressForm}>
                    <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4 py-4">
                        <FormField control={addressForm.control} name="label" render={({ field }) => (
                            <FormItem><FormLabel>Label (e.g., Home, Work)</FormLabel><FormControl><Input placeholder="Home" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={addressForm.control} name="addressLine1" render={({ field }) => (
                            <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={addressForm.control} name="city" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={addressForm.control} name="postalCode" render={({ field }) => (
                                <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input placeholder="12345" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsAddressModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Address</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

      </div>
      <footer className="py-6 text-center text-sm text-gray-500 border-t mt-12 bg-white">
            © {new Date().getFullYear()} FoodFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default ProfilePage;