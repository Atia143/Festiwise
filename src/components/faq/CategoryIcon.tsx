import React from 'react';
import { FiMusic, FiCalendar, FiDollarSign, FiMapPin, FiPackage, FiShield } from 'react-icons/fi';

interface CategoryIconProps {
  category: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
  const iconMap: Record<string, React.ReactElement> = {
    "Festival Basics": <FiMusic className="w-5 h-5" />,
    "Planning": <FiCalendar className="w-5 h-5" />,
    "Budget": <FiDollarSign className="w-5 h-5" />,
    "Location": <FiMapPin className="w-5 h-5" />,
    "Packing": <FiPackage className="w-5 h-5" />,
    "Safety": <FiShield className="w-5 h-5" />,
  };

  return (
    <span className="text-purple-500">
      {iconMap[category] || <FiMusic className="w-5 h-5" />}
    </span>
  );
};

export default CategoryIcon;
