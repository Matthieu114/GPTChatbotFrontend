import { Skeleton } from '../shadcn/ui/skeleton';

export function SkeletonLoader() {
  return (
    <div className='flex items-center space-x-4 mb-4 p-2 rounded-md bg-gray-100 text-gray-800'>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[300px] max-w-fit' />
        <Skeleton className='h-4 w-[400px] max-w-fit' />
      </div>
    </div>
  );
}
