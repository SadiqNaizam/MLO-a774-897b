import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import OrderStatusTracker from '@/components/OrderStatusTracker'; // Custom component
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress"; // Assuming this exists
import { ShoppingCart, User, Package, Clock, MapPin } from 'lucide-react';

interface OrderDetails {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  estimatedDelivery: string; // e.g., "4:30 PM" or "30-40 minutes"
  deliveryAddress: string;
  currentStatusId: string; // e.g., 'preparing'
  restaurantName: string;
}

const orderStatuses = [
  { id: 'confirmed', label: 'Confirmed', icon: Package },
  { id: 'preparing', label: 'Preparing Food', icon: Clock }, // Using Clock as placeholder
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin }, // Using MapPin as placeholder
  { id: 'delivered', label: 'Delivered', icon: Package }, // Using Package for delivered
];


const mockOrderData: { [key: string]: OrderDetails } = {
  'FF123456': {
    id: 'FF123456',
    items: [
      { name: 'Spaghetti Carbonara', quantity: 1, price: 14.99 },
      { name: 'Tiramisu', quantity: 2, price: 8.00 },
    ],
    totalAmount: 30.99, // 14.99 + 16.00 (before tax/delivery)
    estimatedDelivery: 'Approximately 35 minutes',
    deliveryAddress: '123 Main St, Anytown, 12345',
    currentStatusId: 'preparing',
    restaurantName: 'Pasta Paradise',
  },
   'FF654321': {
    id: 'FF654321',
    items: [
      { name: 'Large Pepperoni Pizza', quantity: 1, price: 18.50 },
      { name: 'Coke (2L)', quantity: 1, price: 3.00 },
    ],
    totalAmount: 21.50,
    estimatedDelivery: 'Delivered at 7:15 PM',
    deliveryAddress: '456 Oak Ave, Anytown, 12345',
    currentStatusId: 'delivered',
    restaurantName: 'Pizza Planet',
  }
};


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
              <User className="h-5 w-5" />
            </Button>
          </RouterLink>
        </NavigationMenuItem>
      </div>
    </NavigationMenuList>
  </NavigationMenu>
);

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`OrderTrackingPage loaded for order ID: ${orderId}`);
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (orderId && mockOrderData[orderId]) {
        setOrder(mockOrderData[orderId]);
      } else {
        setOrder(null); // Order not found
      }
      setLoading(false);
    }, 1000);
  }, [orderId]);

  const progressValue = order ? (orderStatuses.findIndex(s => s.id === order.currentStatusId) + 1) / orderStatuses.length * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AppNavigationMenu />
        <div className="container mx-auto px-4 py-8 text-center">
          <Card className="max-w-lg mx-auto p-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-destructive">Order Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">We couldn't find an order with ID: {orderId}. Please check the ID and try again.</p>
              <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="Order not found" className="mx-auto mt-6 h-32 w-32 opacity-50" />
            </CardContent>
            <CardFooter className="justify-center">
                <Button asChild>
                    <RouterLink to="/">Go to Homepage</RouterLink>
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AppNavigationMenu />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Track Your Order</h1>
          <p className="text-lg text-gray-600">Order ID: <span className="font-semibold text-primary">{order.id}</span></p>
        </header>

        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-2xl">Order Status: {orderStatuses.find(s => s.id === order.currentStatusId)?.label}</CardTitle>
            <CardDescription>From: {order.restaurantName}</CardDescription>
          </CardHeader>
          <CardContent className="py-6 space-y-6">
            <div className="mb-8">
              <OrderStatusTracker statuses={orderStatuses} currentStatusId={order.currentStatusId} />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Estimated Delivery:</h3>
              <p className="text-primary font-bold text-xl">{order.estimatedDelivery}</p>
              {order.currentStatusId !== 'delivered' && (
                <Progress value={progressValue} className="w-full h-2 mt-2" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Delivery Address:</h3>
              <p className="text-gray-700">{order.deliveryAddress}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Order Summary:</h3>
              <ul className="list-disc list-inside pl-4 space-y-1 text-gray-700">
                {order.items.map(item => (
                  <li key={item.name}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)}</li>
                ))}
              </ul>
              <p className="font-bold mt-2 text-right">Total: ${order.totalAmount.toFixed(2)} (Excludes tax & delivery)</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
            <Button variant="outline" asChild>
                <RouterLink to="/profile#order-history">View Order History</RouterLink>
            </Button>
            <Button asChild>
                <RouterLink to="/">Continue Shopping</RouterLink>
            </Button>
          </CardFooter>
        </Card>
      </div>
       <footer className="py-6 text-center text-sm text-gray-500 border-t mt-12 bg-white">
            © {new Date().getFullYear()} FoodFleet. All rights reserved.
        </footer>
    </div>
  );
};

export default OrderTrackingPage;