export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  lastUpdated: string | Date; // Allow both string and Date for flexibility
  helpfulCount: number;
  relatedQuestions: string[];
  relatedGuides: {
    title: string;
    url: string;
  }[];
}
