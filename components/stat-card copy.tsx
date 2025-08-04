// 'use client'

// import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

// interface StatCardProps {
//   title: string;
//   value: string;
// }

// export function StatCard({ title, value }: StatCardProps) {
//   return (
//     <Card className="rounded-2xl border shadow-sm dark:border-gray-700 dark:bg-gray-800">
//       <CardHeader>
//         <CardTitle className="text-muted-foreground text-sm dark:text-gray-400">
//           {title}
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold dark:text-gray-100">{value}</div>
//       </CardContent>
//     </Card>
//   );
// }

// components/stat-card.tsx
'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatCardVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface StatCardProps {
  title: string;
  value: string;
  variant?: StatCardVariant;
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

export function StatCard({ title, value, variant = 'default' }: StatCardProps) {
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