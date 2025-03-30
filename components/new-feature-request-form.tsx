'use client'

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react'; // Loading spinner icon

interface NewFeatureRequestFormProps {
  userId: string;
  onSuccess: () => void; // Callback after successful submission
}

export default function NewFeatureRequestForm({ userId, onSuccess }: NewFeatureRequestFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }
    if (!userId) {
        setError('You must be logged in to submit a request.');
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('feature_requests')
        .insert({
          user_id: userId,
          title: title.trim(),
          description: description.trim(),
          // status: 'Open' // Default is set in SQL, but can be explicit
        });

      if (insertError) throw insertError;

      // Reset form and call success callback
      setTitle('');
      setDescription('');
      onSuccess();

    } catch (err) {
      console.error('Error submitting feature request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
       <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Submit a New Feature Request</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A short, descriptive title"
          required
          className="w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          maxLength={150} // Optional: add a max length
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the feature in detail..."
          required
          rows={4}
          className="w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit" disabled={loading || !title.trim() || !description.trim()} className="w-full sm:w-auto">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
          </>
        ) : (
          'Submit Request'
        )}
      </Button>
    </form>
  );
}