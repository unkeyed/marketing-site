import { StarIcon } from 'lucide-react';

import { type ICategory } from '@/types/blog';
import { cn } from '@/lib/utils';
import { Link } from '@/components/ui/link';

interface ICategoryProps {
  className?: string;
  category: ICategory;
  isFeatured?: boolean;
}

function Category({ className, category, isFeatured = false }: ICategoryProps) {
  return (
    <Link
      className={cn(
        'flex w-fit gap-x-1 text-[0.8125rem] leading-none font-medium',
        isFeatured &&
          'h-5 rounded-full bg-muted-foreground pr-2 pl-1.5 text-secondary md:h-6 [&_svg]:size-3',
        className,
      )}
      variant="foreground"
      href={category ? `/blog/category/${category.slug.current}` : '/blog'}
    >
      {isFeatured && <StarIcon fill="currentColor" size={12} />}
      {category ? category.title : 'General'}
    </Link>
  );
}

export default Category;
