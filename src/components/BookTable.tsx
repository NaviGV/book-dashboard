
import { Book } from '../types/book';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { LoadingSkeleton } from './LoadingSkeleton';

interface BookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  isLoading?: boolean;
}

export function BookTable({ books, onEdit, onDelete, isLoading }: BookTableProps) {
  if (isLoading) {
    return <LoadingSkeleton rows={5} type="table" />;
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No books found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your search criteria or add a new book
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border ">
      <Table className="w-full border-collapse border border-white">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id || book._id} className="hover:bg-muted/50 border border-white">
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{book.publishedYear}</TableCell>
              <TableCell>
                <Badge variant={book.status === 'Available' ? 'default' : 'secondary'}>
                  {book.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(book)}
                    className="h-8 w-8 p-0 border-black"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(book)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-600 border-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
