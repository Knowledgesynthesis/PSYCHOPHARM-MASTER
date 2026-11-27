import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <EmptyState icon={Compass} title="Page not found">
      That page doesn't exist. <Link to="/" className="text-brand hover:underline">Go home</Link> or press <kbd className="rounded border border-line px-1">⌘K</kbd> to search.
    </EmptyState>
  );
}
