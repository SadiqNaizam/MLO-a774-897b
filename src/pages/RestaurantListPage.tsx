import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import CuisineCategoryChip from '@/components/CuisineCategoryChip';
import RestaurantCard from '@/components/RestaurantCard';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link as RouterLink } from "react-router-dom";
import { Search, ShoppingCart, User } from 'lucide-react';

// Placeholder data
const cuisines = ['Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 'Vegan', 'Desserts', 'Pizza', 'Burgers', 'Thai'];
const initialRestaurants = [
  { id: '1', name: 'Pasta Paradise', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Italian', 'Pasta'], rating: 4.5, deliveryTime: '30-40 min' },
  { id: '2', name: 'Taco Fiesta', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Mexican', 'Tacos'], rating: 4.2, deliveryTime: '25-35 min' },
  { id: '3', name: 'Wok Wonders', imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Chinese', 'Noodles'], rating: 4.7, deliveryTime: '35-45 min' },
  { id: '4', name: 'Curry House', imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Indian', 'Curry'], rating: 4.8, deliveryTime: '40-50 min' },
];

const AppNavigationMenu = () => (
  <NavigationMenu className="py-2 border-b mb-4">
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


const RestaurantListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<typeof initialRestaurants>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('RestaurantListPage loaded');
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filtered = initialRestaurants;
      if (selectedCuisine) {
        filtered = filtered.filter(r => r.cuisineTypes.includes(selectedCuisine));
      }
      if (searchTerm) {
        filtered = filtered.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      setRestaurants(filtered);
      setLoading(false);
    }, 1000);
  }, [selectedCuisine, searchTerm]);

  const handleCuisineClick = (cuisine: string) => {
    setSelectedCuisine(prev => (prev === cuisine ? null : cuisine));
  };

  const handleRestaurantClick = (id: string | number) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigationMenu />
      <main className="container mx-auto px-4 py-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Next Meal</h1>
          <p className="text-lg text-gray-600">Discover amazing restaurants near you.</p>
        </header>

        <div className="mb-6 sticky top-20 bg-gray-50/90 py-4 z-10 backdrop-blur-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search restaurants..."
              className="w-full pl-10 pr-4 py-3 text-base rounded-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Filter by Cuisine</h2>
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-3 pb-3">
              {cuisines.map((cuisine) => (
                <CuisineCategoryChip
                  key={cuisine}
                  cuisine={cuisine}
                  isSelected={selectedCuisine === cuisine}
                  onClick={handleCuisineClick}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            {selectedCuisine ? `${selectedCuisine} Restaurants` : 'All Restaurants'}
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[180px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            restaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    {...restaurant}
                    onClick={handleRestaurantClick}
                  />
                ))}
              </div>
            ) : (
               <div className="text-center py-10">
                  <p className="text-xl text-gray-500">No restaurants found matching your criteria.</p>
                  <img src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" alt="No results" className="mx-auto mt-4 h-32 w-32" />
               </div>
            )
          )}
        </section>
        
        {/* Placeholder for pagination or "Load More" button */}
        {!loading && restaurants.length > 5 && ( /* Example condition */
            <div className="mt-12 flex justify-center">
                <Button variant="outline">Load More Restaurants</Button>
            </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 border-t mt-12">
        © {new Date().getFullYear()} FoodFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default RestaurantListPage;