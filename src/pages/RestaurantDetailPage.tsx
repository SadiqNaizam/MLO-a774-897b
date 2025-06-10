import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuItemCard from '@/components/MenuItemCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Star, Clock, MapPin, Utensils, ShoppingCart, User, MessageCircle, Info } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // Assuming useToast is available from shadcn

// Placeholder data structures
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  logoUrl: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string;
  address: string;
  operatingHours: string;
  menu: { [category: string]: MenuItem[] };
  reviews: { id: string, user: string, rating: number, comment: string, date: string }[];
}

const placeholderRestaurant: Restaurant = {
  id: '1',
  name: 'Pasta Paradise',
  imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  logoUrl: 'https://via.placeholder.com/100x100.png?text=PP',
  cuisineTypes: ['Italian', 'Pasta', 'Pizza'],
  rating: 4.5,
  deliveryTime: '30-40 min',
  address: '123 Pasta Lane, Food City',
  operatingHours: '11:00 AM - 10:00 PM',
  menu: {
    'Appetizers': [
      { id: 'm1', name: 'Garlic Bread', description: 'Crusty bread with garlic butter and herbs.', price: 5.99, imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', category: 'Appetizers' },
      { id: 'm2', name: 'Bruschetta', description: 'Grilled bread rubbed with garlic and topped with tomato, basil, and olive oil.', price: 7.50, imageUrl: 'https://images.unsplash.com/photo-1505253716362-af78f6c37690?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJ1c2NoZXR0YXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', category: 'Appetizers' },
    ],
    'Main Courses': [
      { id: 'm3', name: 'Spaghetti Carbonara', description: 'Classic Roman pasta dish with eggs, cheese, pancetta, and pepper.', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1588013273468-31508b965afd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhZ2hldHRpJTIwY2FyYm9uYXJhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', category: 'Main Courses' },
      { id: 'm4', name: 'Margherita Pizza', description: 'Simple and delicious pizza with tomatoes, mozzarella, basil, salt, and olive oil.', price: 12.00, imageUrl: 'https://images.unsplash.com/photo-1595854360779-798041122b8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', category: 'Main Courses' },
    ],
    'Desserts': [
        { id: 'm5', name: 'Tiramisu', description: 'Coffee-flavoured Italian dessert. Ladyfingers dipped in coffee, layered with a whipped mixture of eggs, sugar, and mascarpone cheese.', price: 8.00, imageUrl: 'https://images.unsplash.com/photo-1571877276122-99a100c277e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGlyYW1pc3V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', category: 'Desserts'}
    ]
  },
  reviews: [
    { id: 'r1', user: 'Alice', rating: 5, comment: 'Amazing carbonara! Best I have had.', date: '2024-07-15'},
    { id: 'r2', user: 'Bob', rating: 4, comment: 'Good food, quick delivery.', date: '2024-07-10'},
  ]
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

const RestaurantDetailPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`RestaurantDetailPage loaded for ID: ${restaurantId}`);
    // Simulate API call
    // In a real app, fetch restaurant data based on restaurantId
    setRestaurant(placeholderRestaurant); // Using placeholder for now
  }, [restaurantId]);

  const handleAddToCart = (itemId: string | number) => {
    const item = Object.values(restaurant?.menu || {}).flat().find(i => i.id === itemId);
    console.log(`Added ${item?.name} to cart`);
    toast({
      title: "Item Added to Cart",
      description: `${item?.name} has been successfully added to your cart.`,
    });
    // Here you would typically update a global cart state
  };
  
  const handleCustomizeAndAddToCart = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsCustomizationDialogOpen(true);
  };

  const handleConfirmCustomization = () => {
      if (selectedMenuItem) {
          handleAddToCart(selectedMenuItem.id);
          setIsCustomizationDialogOpen(false);
          setSelectedMenuItem(null);
      }
  };


  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Loading restaurant details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigationMenu />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <RouterLink to="/">Home</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{restaurant.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-primary">
                    <AvatarImage src={restaurant.logoUrl} alt={restaurant.name} />
                    <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{restaurant.name}</h1>
                    <div className="flex flex-wrap gap-2 my-2">
                        {restaurant.cuisineTypes.map(cuisine => (
                            <Badge key={cuisine} variant="secondary">{cuisine}</Badge>
                        ))}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center"><Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" /> {restaurant.rating.toFixed(1)}</span>
                        <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {restaurant.deliveryTime}</span>
                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {restaurant.address.split(',')[0]}</span>
                    </div>
                </div>
                <Button onClick={() => navigate('/checkout')} className="mt-4 md:mt-0">
                    View Cart <ShoppingCart className="ml-2 h-4 w-4" />
                </Button>
            </div>
             {/* Optional: Banner Image */}
            <div className="mt-6 h-48 md:h-64 w-full rounded-lg overflow-hidden">
                <img src={restaurant.imageUrl} alt={`${restaurant.name} interior or signature dish`} className="w-full h-full object-cover" />
            </div>
        </header>

        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-6">
            <TabsTrigger value="menu" className="flex items-center gap-2"><Utensils className="h-4 w-4" /> Menu</TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Reviews</TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2"><Info className="h-4 w-4" /> Info</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <ScrollArea className="h-auto"> {/* Adjust height as needed, e.g., h-[calc(100vh-400px)] */}
              {Object.entries(restaurant.menu).map(([category, items]) => (
                <section key={category} className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-primary">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                      <MenuItemCard 
                        key={item.id} 
                        {...item} 
                        onAddToCart={() => handleCustomizeAndAddToCart(item)} 
                      />
                    ))}
                  </div>
                </section>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Customer Reviews</h2>
              {restaurant.reviews.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {restaurant.reviews.map(review => (
                    <AccordionItem key={review.id} value={`review-${review.id}`}>
                      <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4">
                            <span>{review.user} - Rated {review.rating}/5</span>
                            <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {review.comment}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-gray-500">No reviews yet for this restaurant.</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Restaurant Information</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong className="font-medium">Address:</strong> {restaurant.address}</p>
                <p><strong className="font-medium">Operating Hours:</strong> {restaurant.operatingHours}</p>
                <p><strong className="font-medium">Cuisines:</strong> {restaurant.cuisineTypes.join(', ')}</p>
                {/* Add more info like contact, etc. */}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedMenuItem && (
            <Dialog open={isCustomizationDialogOpen} onOpenChange={setIsCustomizationDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Customize {selectedMenuItem.name}</DialogTitle>
                <DialogDescription>
                    Make changes to your item here. Click confirm when you're done.
                    (Placeholder for customization options)
                </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-gray-500">Customization options for {selectedMenuItem.name} would go here.</p>
                    <p className="mt-2 font-semibold">Price: ${selectedMenuItem.price.toFixed(2)}</p>
                </div>
                <DialogFooter>
                <Button variant="outline" onClick={() => setIsCustomizationDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmCustomization}>Confirm & Add to Cart</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        )}

      </div>
      <footer className="py-6 text-center text-sm text-gray-500 border-t mt-12">
        © {new Date().getFullYear()} FoodFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default RestaurantDetailPage;