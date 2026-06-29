'use client';

import { CategoryConfig } from '@/types';
import { CATEGORY_COLORS } from '@/lib/colors';

interface CategoryTabsProps {
  categories: CategoryConfig[];
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
      <div className="flex gap-2 pb-1 min-w-max">
        <button
          onClick={() => onSelect('all')}
          className="snap-start px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                     min-h-[44px] flex items-center active:scale-[0.96]"
          style={{
            backgroundColor: selected === 'all' ? 'rgba(59,130,246,0.2)' : 'rgb(31,41,55)',
            color: selected === 'all' ? '#3B82F6' : 'rgb(156,163,175)',
          }}
        >
          Todo
        </button>
        {categories.map((cat) => {
          const isSelected = selected === cat.id;
          const color = CATEGORY_COLORS[cat.id] || '#3B82F6';
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="snap-start px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                         min-h-[44px] flex items-center active:scale-[0.96]"
              style={{
                backgroundColor: isSelected ? `${color}25` : 'rgb(31,41,55)',
                color: isSelected ? color : 'rgb(156,163,175)',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
