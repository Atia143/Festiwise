export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  lastUpdated: Date;
  helpfulCount: number;
  relatedQuestions: string[];
  relatedGuides: {
    title: string;
    url: string;
  }[];
}
