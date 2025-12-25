// components/DashboardTitle.tsx
export default function DashboardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{children}</h1>
    </div>
  );
}