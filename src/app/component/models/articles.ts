export interface Article {
    title: string;
    thumbnail: string;
    description: string;
    author: string;
    publishDate: any; // Use `any` if Firestore timestamp, otherwise `string` or `Date`
    isFeatured?: boolean;
    views?: number;
  }