import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // For a "View Menu" or similar action
import { Star } from 'lucide-react'; // Example icon for ratings

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating?: number; // e.g., 4.5
  deliveryTime?: string; // e.g., "25-35 min"
  onClick: (id: string | number) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  onClick,
}) => {
  console.log(`Rendering RestaurantCard: ${name}`);

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-shadow duration-300 hover:shadow-lg cursor-pointer" onClick={() => onClick(id)}>
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        {cuisineTypes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {cuisineTypes.slice(0, 3).map((cuisine) => ( // Show up to 3 cuisine types
              <Badge key={cuisine} variant="secondary" className="text-xs">{cuisine}</Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {deliveryTime && <span>{deliveryTime}</span>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {/* Example action button, could be conditional or passed as prop */}
        {/* <Button variant="outline" className="w-full" onClick={(e) => { e.stopPropagation(); onClick(id); }}>View Menu</Button> */}
      </CardFooter>
    </Card>
  );
};

export default RestaurantCard;