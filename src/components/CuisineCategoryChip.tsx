import React from 'react';
import { Badge } from '@/components/ui/badge'; // Using Badge for chip-like appearance
import { cn } from '@/lib/utils';

interface CuisineCategoryChipProps {
  cuisine: string;
  isSelected?: boolean;
  onClick: (cuisine: string) => void;
  className?: string;
}

const CuisineCategoryChip: React.FC<CuisineCategoryChipProps> = ({
  cuisine,
  isSelected = false,
  onClick,
  className,
}) => {
  console.log(`Rendering CuisineCategoryChip: ${cuisine}, selected: ${isSelected}`);

  return (
    <Badge
      variant={isSelected ? 'default' : 'outline'}
      onClick={() => onClick(cuisine)}
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground text-sm px-3 py-1",
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(cuisine);
        }
      }}
    >
      {cuisine}
    </Badge>
  );
};

export default CuisineCategoryChip;