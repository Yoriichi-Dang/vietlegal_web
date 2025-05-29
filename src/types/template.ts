export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isFavorite: boolean;
  lastUsed: Date;
  tags: string[];
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}
