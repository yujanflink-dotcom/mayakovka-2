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
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-1 min-w-max">
        <button
          onClick={() => onSelect('all')}
          className="px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap relative"
          style={{
            backgroundColor: selected === 'all' ? 'rgba(59,130,246,0.15)' : 'rgb(31,41,55)',
            color: selected === 'all' ? '#3B82F6' : 'rgb(156,163,175)',
          }}
        >
          Todo
          {selected === 'all' && (
            <span
              className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
              style={{ backgroundColor: '#3B82F6' }}
            />
          )}
        </button>
        {categories.map((cat) => {
          const isSelected = selected === cat.id;
          const color = CATEGORY_COLORS[cat.id] || '#3B82F6';
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap relative"
              style={{
                backgroundColor: isSelected
                  ? `${color}20`
                  : 'rgb(31,41,55)',
                color: isSelected ? color : 'rgb(156,163,175)',
              }}
            >
              {cat.name}
              {isSelected && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
