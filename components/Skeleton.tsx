export function Skeleton({
  className = '',
  height = 16,
  width,
}: {
  className?: string;
  height?: number;
  width?: number | string;
}) {
  return (
    <div
      className={`skeleton rounded-md ${className}`}
      style={{ height, width: width ?? '100%' }}
    />
  );
}
