
import { useForm } from 'react-hook-form';
import { Book, BookFormData } from '../types/book';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface BookFormProps {
  book?: Book;
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const genres = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Fantasy',
  'Science Fiction',
  'Dystopian',
  'Biography',
  'History',
  'Self-Help'
];

export function BookForm({ book, onSubmit, onCancel, isLoading }: BookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<BookFormData>({
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      genre: book?.genre || '',
      publishedYear: book?.publishedYear || new Date().getFullYear(),
      status: book?.status || 'Available',
      isbn: book?.isbn || '',
      description: book?.description || ''
    }
  });

  const currentYear = new Date().getFullYear();
  const watchedGenre = watch('genre');
  const watchedStatus = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
      <div className="grid grid-cols-1 border md:grid-cols-2 gap-4 ">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register('title', { 
              required: 'Title is required',
              minLength: { value: 2, message: 'Title must be at least 2 characters' }
            })}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Input
            id="author"
            {...register('author', { 
              required: 'Author is required',
              minLength: { value: 2, message: 'Author must be at least 2 characters' }
            })}
            className={errors.author ? 'border-destructive' : ''}
          />
          {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="genre">Genre *</Label>
          <Select 
            value={watchedGenre} 
            onValueChange={(value) => setValue('genre', value)}
          >
            <SelectTrigger className={errors.genre ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input 
            type="hidden" 
            {...register('genre', { required: 'Genre is required' })} 
          />
          {errors.genre && <p className="text-sm text-destructive">{errors.genre.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="publishedYear">Published Year *</Label>
          <Input
            id="publishedYear"
            type="number"
            {...register('publishedYear', { 
              required: 'Published year is required',
              min: { value: 1000, message: 'Year must be valid' },
              max: { value: currentYear, message: `Year cannot be greater than ${currentYear}` },
              valueAsNumber: true
            })}
            className={errors.publishedYear ? 'border-destructive' : ''}
          />
          {errors.publishedYear && <p className="text-sm text-destructive">{errors.publishedYear.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select 
            value={watchedStatus} 
            onValueChange={(value: 'Available' | 'Issued') => setValue('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Issued">Issued</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            {...register('isbn')}
            placeholder="978-0-123456-78-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Brief description of the book..."
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
        </Button>
      </div>
    </form>
  );
}
