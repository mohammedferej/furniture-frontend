'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

type StatCardVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface StatCardProps {
  title: string;
  value: string;
  variant?: StatCardVariant;
  icon?: React.ReactElement<{ className?: string }>; // ✅ Ensure icon can have className
}

const variantClasses = {
  default: 'bg-white dark:bg-gray-800',
  primary: 'bg-blue-50 dark:bg-blue-900/30',
  success: 'bg-green-50 dark:bg-green-900/30',
  warning: 'bg-amber-50 dark:bg-amber-900/30',
  danger: 'bg-red-50 dark:bg-red-900/30',
};

const valueColors = {
  default: 'text-gray-900 dark:text-white',
  primary: 'text-blue-600 dark:text-blue-300',
  success: 'text-green-600 dark:text-green-300',
  warning: 'text-amber-600 dark:text-amber-300',
  danger: 'text-red-600 dark:text-red-300',
};

export function StatCard({ title, value, variant = 'default', icon }: StatCardProps) {
  return (
    <Card className={cn(
      "rounded-xl border shadow-sm",
      variantClasses[variant]
    )}>
      <CardHeader className="pb-2">
        <CardTitle className={cn(
          "text-sm font-medium text-muted-foreground",
          variant === 'default' ? 'dark:text-gray-400' : ''
        )}>
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "p-2 rounded-full",
            variant === 'primary' ? 'bg-blue-100 dark:bg-blue-800/50' :
            variant === 'success' ? 'bg-green-100 dark:bg-green-800/50' :
            variant === 'warning' ? 'bg-amber-100 dark:bg-amber-800/50' :
            variant === 'danger' ? 'bg-red-100 dark:bg-red-800/50' :
            'bg-gray-100 dark:bg-gray-700'
          )}>
            {React.cloneElement(icon, {
              className: cn(
                "w-4 h-4",
                variant === 'primary' ? 'text-blue-600 dark:text-blue-300' :
                variant === 'success' ? 'text-green-600 dark:text-green-300' :
                variant === 'warning' ? 'text-amber-600 dark:text-amber-300' :
                variant === 'danger' ? 'text-red-600 dark:text-red-300' :
                'text-gray-600 dark:text-gray-300'
              )
            })}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-2xl font-bold",
          valueColors[variant]
        )}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
