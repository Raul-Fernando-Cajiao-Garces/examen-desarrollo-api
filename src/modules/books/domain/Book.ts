export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  copies: number;
}

export type NewBook = Omit<Book, 'id'>;
