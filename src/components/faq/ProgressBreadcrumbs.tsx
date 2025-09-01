import React from 'react';

interface ProgressBreadcrumbsProps {
  categories: string[];
  selected: string | null;
}

const ProgressBreadcrumbs: React.FC<ProgressBreadcrumbsProps> = ({ categories, selected }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span>Browse:</span>
      {categories.map((category, index) => (
        <React.Fragment key={category}>
          {index > 0 && <span>/</span>}
          <span className={selected === category ? "text-purple-600 font-medium" : ""}>
            {category}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressBreadcrumbs;
