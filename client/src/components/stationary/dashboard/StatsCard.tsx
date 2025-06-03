import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  }
  footer?: React.ReactNode;
}

export function StatsCard({ 
  title, 
  value, 
  description,
  icon: Icon,
  iconColor = "text-muted-foreground",
  trend,
  footer
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-1 rounded-md bg-opacity-20 ${iconColor.includes('destructive') ? 'bg-destructive/10' : iconColor.includes('blue') ? 'bg-blue-100' : 'bg-primary/10'}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {trend && (
          <div className="flex items-center mt-2 bg-muted/20 rounded-md px-2 py-1">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'} font-medium`}>
              {trend.value}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
      
      {footer && (
        <CardFooter className="px-4 py-2 bg-muted/5 border-t text-xs">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
