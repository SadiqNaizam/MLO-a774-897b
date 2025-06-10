import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlusCircle } from 'lucide-react'; // Icon for "Add to cart"

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (itemId: string | number) => void;
  // Could add props for customization options, e.g., onCustomize: (itemId: string | number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
}) => {
  console.log(`Rendering MenuItemCard: ${name}`);

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click if card itself is clickable
    onAddToCart(id);
    // Consider using useToast() here for feedback: toast({ title: `${name} added to cart!` })
  };

  return (
    <Card className="w-full flex flex-col sm:flex-row overflow-hidden transition-shadow duration-300 hover:shadow-md">
      {imageUrl && (
        <div className="sm:w-1/3 flex-shrink-0">
          <AspectRatio ratio={1} className="sm:h-full"> {/* Square aspect ratio for menu item image */}
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
        </div>
      )}
      <div className="flex flex-col justify-between flex-grow p-4">
        <div>
          <CardTitle className="text-md font-semibold">{name}</CardTitle>
          {description && (
            <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {description}
            </CardDescription>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
          <Button size="sm" variant="outline" onClick={handleAddToCartClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MenuItemCard;