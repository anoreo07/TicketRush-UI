import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CATEGORY_MAP: Record<string, string> = {
  music: 'Âm nhạc',
  arts: 'Nghệ thuật',
  sports: 'Thể thao',
  technology: 'Công nghệ',
};

export const getCategoryLabel = (category: string | undefined | null) => {
  if (!category) return 'Khác';
  return CATEGORY_MAP[category.toLowerCase()] || category;
};
