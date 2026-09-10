export default function CampusLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-40 rounded-md bg-border" />
      <div className="h-40 rounded-xl border border-border bg-surface" />
      <div className="h-40 rounded-xl border border-border bg-surface" />
    </div>
  );
}
