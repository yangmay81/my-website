export default function PostLoading() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-6" />
        <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
          <div className="h-64 bg-gray-200" />
          <div className="p-6 md:p-8 space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
