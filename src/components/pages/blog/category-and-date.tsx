import { type ICategory } from '@/types/blog';
import { cn } from '@/lib/utils';
import Category from '@/components/pages/blog/category';
import Date from '@/components/pages/date';

interface ICategoryAndDateProps {
  className?: string;
  category: ICategory;
  publishedAt: string;
  isFeatured?: boolean;
}

function CategoryAndDate({
  className,
  category,
  publishedAt,
  isFeatured = false,
}: ICategoryAndDateProps) {
  return (
    <div className={cn('flex items-center gap-x-2', className)}>
      <Category category={category} isFeatured={isFeatured} />
      <div className="size-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
      <Date publishedAt={publishedAt} />
    </div>
  );
}

export default CategoryAndDate;
