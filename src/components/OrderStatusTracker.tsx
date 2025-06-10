import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Loader2, Truck, PackageCheck } from 'lucide-react'; // Example icons

interface OrderStatus {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface OrderStatusTrackerProps {
  statuses: OrderStatus[]; // Array of all possible statuses in order
  currentStatusId: string; // ID of the current status
  className?: string;
}

const defaultStatuses: OrderStatus[] = [
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { id: 'preparing', label: 'Preparing', icon: Loader2 },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: PackageCheck },
];

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  statuses = defaultStatuses,
  currentStatusId,
  className,
}) => {
  console.log(`Rendering OrderStatusTracker, current status: ${currentStatusId}`);
  const currentIndex = statuses.findIndex(status => status.id === currentStatusId);

  return (
    <div className={cn("flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-2", className)}>
      {statuses.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const IconComponent = status.icon || Circle;

        return (
          <React.Fragment key={status.id}>
            <div className="flex flex-col items-center text-center sm:flex-1">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 mb-1",
                  isActive ? "bg-primary border-primary text-primary-foreground animate-pulse" :
                  isCompleted ? "bg-green-500 border-green-500 text-white" :
                  "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                <IconComponent className={cn("h-5 w-5", isActive && status.icon === Loader2 && "animate-spin")} />
              </div>
              <p
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-primary" :
                  isCompleted ? "text-green-600" :
                  "text-muted-foreground"
                )}
              >
                {status.label}
              </p>
            </div>
            {index < statuses.length - 1 && (
              <div className={cn(
                "h-1 w-full sm:w-full sm:flex-1 sm:h-1 mt-0 sm:mt-[-1.25rem] mx-auto sm:mx-0", // Position line between items
                "bg-muted-foreground/30 relative",
                (isCompleted || isActive) && index < currentIndex ? "bg-green-500" : "bg-muted-foreground/30"
              )}>
                 {/* Optional: Add animation for line fill */}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;