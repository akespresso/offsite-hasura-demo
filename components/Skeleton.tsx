export const Skeleton = () => (
  <div className="grid lg:grid-cols-4 grid-cols-1 gap-16 animate-pulse">
    <div>
      <div className="w-full h-12 bg-gray-100 mb-2 rounded"></div>
      <div className="w-full aspect-square bg-gray-100 rounded-lg"></div>
    </div>
    <div>
      <div className="w-full h-12 bg-gray-100 mb-2 rounded"></div>
      <div className="w-full aspect-square bg-gray-100 rounded-lg"></div>
    </div>
    <div>
      <div className="w-full h-12 bg-gray-100 mb-2 rounded"></div>
      <div className="w-full aspect-square bg-gray-100 rounded-lg"></div>
    </div>
    <div>
      <div className="w-full h-12 bg-gray-100 mb-2 rounded"></div>
      <div className="w-full aspect-square bg-gray-100 rounded-lg"></div>
    </div>
  </div>
);
