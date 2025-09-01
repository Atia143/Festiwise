'use client';

import { useState, useMemo } from 'react';
import { FAQItem } from '@/types/faq';

interface UseFAQOptions {
  showSearch?: boolean;
  showCategories?: boolean;
  showQuickAnswers?: boolean;
}

export function useFAQ(items: FAQItem[], options: UseFAQOptions = {}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quickAnswers, setQuickAnswers] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [wasHelpful, setWasHelpful] = useState<Record<string, boolean>>({});

  const filteredItems = useMemo(() => {
    let result = items;

    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        item =>
          item.question.toLowerCase().includes(searchLower) ||
          item.answer.toLowerCase().includes(searchLower)
      );
    }

    if (quickAnswers) {
      result = result.filter(item => item.tags.includes('quick'));
    }

    return result;
  }, [items, search, selectedCategory, quickAnswers]);

  const categories = useMemo(() => {
    return Array.from(new Set(items.map(item => item.category)));
  }, [items]);

  const toggleItem = (id: string) => {
    setExpanded(current => current === id ? null : id);
  };

  const markHelpful = (id: string, value: boolean) => {
    setWasHelpful(current => ({
      ...current,
      [id]: value
    }));
  };

  return {
    filteredItems,
    categories,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    quickAnswers,
    setQuickAnswers,
    expanded,
    toggleItem,
    wasHelpful,
    markHelpful
  };
}
