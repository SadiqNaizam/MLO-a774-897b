import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { MinusCircle, PlusCircle, Trash2, ShoppingCart, User, CreditCard, Truck } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Placeholder cart items
const initialCartItems = [
  { id: 'm3', name: 'Spaghetti Carbonara', price: 14.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1588013273468-31508b965afd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhZ2hldHRpJTIwY2FyYm9uYXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60' },
  { id: 'm5', name: 'Tiramisu', price: 8.00, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1571877276122-99a100c277e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGlyYW1pc3V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60' },
];

const deliveryAddressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  addressLine1: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  postalCode: z.string().min(5, { message: "Valid postal code is required." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Valid phone number is required." }),
});

const paymentSchema = z.object({
    paymentMethod: z.enum(["creditCard", "paypal", "cod"], { required_error: "Please select a payment method."}),
    cardNumber: z.string().optional(), // Make optional and add conditional validation if needed
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
});

const checkoutSchema = deliveryAddressSchema.merge(paymentSchema).extend({
    promoCode: z.string().optional(),
});

type CartItem = typeof initialCartItems[0];

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
              <ShoppingCart className="h-5 w-5 text-primary" /> {/* Highlight current page */}
            </Button>
          </RouterLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <RouterLink to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </RouterLink>
        </NavigationMenuItem>
      </div>
    </NavigationMenuList>
  </NavigationMenu>
);

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [currentStep, setCurrentStep] = useState(1); // 1: Cart Review, 2: Delivery, 3: Payment
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      addressLine1: "",
      city: "",
      postalCode: "",
      phone: "",
      paymentMethod: "creditCard",
      promoCode: "",
    },
  });

  useEffect(() => {
    console.log('CheckoutPage loaded');
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({ title: "Item Removed", description: "The item has been removed from your cart."});
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.08; // 8%
  const taxes = subtotal * taxRate;
  const deliveryFee = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + taxes + deliveryFee;

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    console.log("Checkout values:", values);
    // Simulate order placement
    toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed. You will be redirected to tracking.",
    });
    // Generate a mock order ID
    const mockOrderId = `FF${Date.now().toString().slice(-6)}`;
    setTimeout(() => navigate(`/order-tracking/${mockOrderId}`), 2000);
  };

  const handleNextStep = async () => {
      if (currentStep === 1 && cartItems.length === 0) {
        toast({ variant: "destructive", title: "Empty Cart", description: "Please add items to your cart before proceeding." });
        return;
      }
      if (currentStep === 2) { // Validate delivery address
        const isValid = await form.trigger(["fullName", "addressLine1", "city", "postalCode", "phone"]);
        if (!isValid) {
            toast({ variant: "destructive", title: "Invalid Address", description: "Please fill in all required address fields." });
            return;
        }
      }
      setCurrentStep(s => s + 1);
  };
  const handlePrevStep = () => setCurrentStep(s => s - 1);


  return (
    <div className="min-h-screen bg-gray-100">
        <AppNavigationMenu />
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>

            {/* Progress Indicator (Simple) */}
            <div className="w-full max-w-2xl mx-auto mb-8 flex justify-between items-center">
                {['Cart', 'Delivery', 'Payment', 'Confirm'].map((stepName, index) => (
                    <React.Fragment key={stepName}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep > index + 1 || (currentStep === index+1 && currentStep <=3) ? 'bg-primary border-primary text-white' : 'bg-gray-200 border-gray-300 text-gray-500'}`}>
                               {currentStep > index + 1 ? <Check className="h-5 w-5"/> : index + 1}
                            </div>
                            <p className={`mt-1 text-xs ${currentStep >= index + 1 ? 'text-primary font-semibold' : 'text-gray-500'}`}>{stepName}</p>
                        </div>
                        {index < 3 && <div className={`flex-1 h-0.5 mx-2 ${currentStep > index + 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>}
                    </React.Fragment>
                ))}
            </div>


            {/* Step 1: Cart Review */}
            {currentStep === 1 && (
                <Card className="mb-8 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Review Your Cart</CardTitle>
                        <CardDescription>Check your items before proceeding.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {cartItems.length === 0 ? (
                            <div className="text-center py-10">
                                <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                <p className="text-xl text-gray-500">Your cart is empty.</p>
                                <Button asChild variant="link" className="mt-2">
                                    <RouterLink to="/">Continue Shopping</RouterLink>
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="hidden md:table-cell">
                                                <img src={item.imageUrl} alt={item.name} className="h-16 w-16 object-cover rounded-md"/>
                                            </TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}><MinusCircle className="h-4 w-4"/></Button>
                                                    <span>{item.quantity}</span>
                                                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}><PlusCircle className="h-4 w-4"/></Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4"/></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>This action cannot be undone. This will permanently remove "{item.name}" from your cart.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => removeItem(item.id)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                    {cartItems.length > 0 && (
                        <CardFooter className="flex flex-col items-end space-y-2 pt-6 border-t">
                            <div className="text-right">
                                <p>Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></p>
                                <p>Taxes ({(taxRate * 100).toFixed(0)}%): <span className="font-semibold">${taxes.toFixed(2)}</span></p>
                                <p>Delivery Fee: <span className="font-semibold">${deliveryFee.toFixed(2)}</span></p>
                                <p className="text-xl font-bold mt-1">Total: <span className="text-primary">${total.toFixed(2)}</span></p>
                            </div>
                            <Button size="lg" onClick={handleNextStep} className="w-full sm:w-auto mt-4">
                                Proceed to Delivery <Truck className="ml-2 h-5 w-5"/>
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            )}
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Step 2: Delivery Address */}
                    {currentStep === 2 && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Delivery Address</CardTitle>
                                <CardDescription>Where should we send your order?</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="addressLine1" render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Address Line 1</FormLabel>
                                        <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="city" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="postalCode" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl><Input placeholder="12345" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl><Input type="tel" placeholder="+1 (555) 123-4567" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-6 border-t">
                                <Button variant="outline" onClick={handlePrevStep}>Back to Cart</Button>
                                <Button onClick={handleNextStep}>Proceed to Payment <CreditCard className="ml-2 h-5 w-5"/></Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Step 3: Payment Method */}
                    {currentStep === 3 && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Payment Method</CardTitle>
                                <CardDescription>Choose how you'd like to pay.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Select Payment Method</FormLabel>
                                        <FormControl>
                                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                                <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent">
                                                    <FormControl><RadioGroupItem value="creditCard" /></FormControl>
                                                    <FormLabel className="font-normal flex-1 cursor-pointer">Credit/Debit Card</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent">
                                                    <FormControl><RadioGroupItem value="paypal" /></FormControl>
                                                    <FormLabel className="font-normal flex-1 cursor-pointer">PayPal</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent">
                                                    <FormControl><RadioGroupItem value="cod" /></FormControl>
                                                    <FormLabel className="font-normal flex-1 cursor-pointer">Cash on Delivery (COD)</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                {form.watch("paymentMethod") === "creditCard" && (
                                    <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                                        <h3 className="font-medium">Enter Card Details</h3>
                                        <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Card Number</FormLabel>
                                                <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Expiry Date</FormLabel>
                                                    <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}/>
                                            <FormField control={form.control} name="cvv" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CVV</FormLabel>
                                                    <FormControl><Input placeholder="•••" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}/>
                                        </div>
                                    </div>
                                )}
                                 <FormField control={form.control} name="promoCode" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Promo Code (Optional)</FormLabel>
                                        <div className="flex space-x-2">
                                        <FormControl><Input placeholder="Enter code" {...field} /></FormControl>
                                        <Button type="button" variant="outline">Apply</Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-6 border-t">
                                <Button variant="outline" onClick={handlePrevStep}>Back to Delivery</Button>
                                <Button onClick={handleNextStep}>Review Order</Button>
                            </CardFooter>
                        </Card>
                    )}

                     {/* Step 4: Order Summary & Confirmation */}
                    {currentStep === 4 && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl">Confirm Your Order</CardTitle>
                                <CardDescription>Please review all details before placing your order.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Items:</h3>
                                    <ul className="list-disc list-inside pl-4 space-y-1 text-gray-700">
                                        {cartItems.map(item => (
                                            <li key={item.id}>{item.name} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Delivery Address:</h3>
                                    <p className="text-gray-700">{form.getValues("fullName")}</p>
                                    <p className="text-gray-700">{form.getValues("addressLine1")}</p>
                                    <p className="text-gray-700">{form.getValues("city")}, {form.getValues("postalCode")}</p>
                                    <p className="text-gray-700">Phone: {form.getValues("phone")}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Payment Method:</h3>
                                    <p className="text-gray-700 capitalize">{form.getValues("paymentMethod")?.replace('creditCard', 'Credit Card')}</p>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-xl font-bold">Total: <span className="text-primary">${total.toFixed(2)}</span></p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-6 border-t">
                                <Button variant="outline" onClick={handlePrevStep}>Back to Payment</Button>
                                <Button size="lg" type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Placing Order..." : "Place Order"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </form>
            </Form>
        </div>
        <footer className="py-6 text-center text-sm text-gray-500 border-t mt-12 bg-white">
            © {new Date().getFullYear()} FoodFleet. All rights reserved.
        </footer>
    </div>
  );
};

export default CheckoutPage;