// components/EmptyState.tsx
import Link from 'next/link';

type EmptyStateProps = {
  message: string;
  linkText: string;
  linkHref: string;
};

export default function EmptyState({ message, linkText, linkHref }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <Link
        href={linkHref}
        className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
      >
        {linkText}
      </Link>
    </div>
  );
}