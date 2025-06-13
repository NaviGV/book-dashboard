
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Book, BookFormData, BookFilters } from '../types/book';
import { bookApi } from '../services/bookApi';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

import { Plus, Search, Filter } from 'lucide-react';
import { BookTable } from '@/components/BookTable';
import { Pagination } from '@/components/Pagination';
import { BookForm } from '@/components/BookForm';

export function BookDashboard() {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BookFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  // Fetch books with React Query
  const { data: booksData, isLoading, error } = useQuery({
    queryKey: ['books', currentPage, filters],
    queryFn: () => bookApi.getBooks(currentPage, 10, filters),
    retry: 2,
  });

  // Fetch genres for filter
  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: bookApi.getGenres,
    retry: 2,
  });

  // Create book mutation
  const createBookMutation = useMutation({
    mutationFn: bookApi.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      setIsFormOpen(false);
      toast.success(
       
        'Book added successfully'
      );
    },
    onError: (error) => {
      console.error('Create book error:', error);
      toast.error(
        'Failed to add book. Please try again.'
      );
    },
  });

  // Update book mutation
  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BookFormData }) =>
      bookApi.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setIsFormOpen(false);
      setEditingBook(null);
      toast.success( 'Book updated successfully');
    },
    onError: (error) => {
      console.error('Update book error:', error);
      toast.error( 'Failed to update book. Please try again.');
    },
  });

  // Delete book mutation
  const deleteBookMutation = useMutation({
    mutationFn: bookApi.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setDeletingBook(null);
      toast.success( 'Book deleted successfully');
    },
    onError: (error) => {
      console.error('Delete book error:', error);
      toast.error( 'Failed to delete book. Please try again.');
    },
  });

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast.error('Failed to load books. Please check your internet connection.');
    }
  }, [error]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof BookFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? undefined : value }));
    setCurrentPage(1);
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteBook = (book: Book) => {
    setDeletingBook(book);
  };

  const handleFormSubmit = (data: BookFormData) => {
    if (editingBook) {
      const bookId = editingBook._id || editingBook.id;
      if (bookId) {
        updateBookMutation.mutate({ id: bookId, data });
      }
    } else {
      createBookMutation.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingBook(null);
  };

  const confirmDelete = () => {
    if (deletingBook) {
      const bookId = deletingBook._id || deletingBook.id;
      if (bookId) {
        deleteBookMutation.mutate(bookId);
      }
    }
  };

  const isFormLoading = createBookMutation.isPending || updateBookMutation.isPending;

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book Management</h1>
          <p className="text-muted-foreground">
            Manage your library's book collection
          </p>
        </div>
       
        <Button className='bg-black' onClick={handleAddBook} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2 " />
          Add Book
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className='bg-gray-100'>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{booksData?.total || 0}</div>
          </CardContent>
        </Card>
        <Card className='bg-gray-100'>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Genres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{genres.length}</div>
          </CardContent>
        </Card>
        <Card className='bg-gray-100'>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Available books in this page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {booksData?.data.filter(book => book.status === 'Available').length || 0}
            </div>
          </CardContent>
        </Card >
        <Card className='bg-gray-100' >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Issued books in this page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {booksData?.data.filter(book => book.status === 'Issued').length || 0}
            </div>
          </CardContent>
        </Card>
      
      </div>

      {/* Filters and Search */}
      <Card className='bg-gray-100'>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filters</CardTitle>
          <CardDescription>
            Find books by title, author, genre, or status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="sm:w-auto bg-black">
              Search
            </Button>
            <Select
              value={filters.genre || 'all'}
              onValueChange={(value) => handleFilterChange('genre', value)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Issued">Issued</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card className='bg-gray-100'>
        <CardHeader>
          <CardTitle>Books Collection</CardTitle>
          <CardDescription>
            {booksData?.total || 0} books total
          </CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? (
      <LoadingSkeleton type="table" rows={6} />
    ) : (
      <>
          <BookTable
            books={booksData?.data || []}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            isLoading={isLoading}
          />
          {booksData && booksData.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={booksData.totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
          </>
        )}
        </CardContent>
      </Card>

      {/* Add/Edit Book Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </DialogTitle>
          </DialogHeader>
          <BookForm
            book={editingBook || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isFormLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingBook} onOpenChange={() => setDeletingBook(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book
              "{deletingBook?.title}" from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBookMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteBookMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteBookMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}