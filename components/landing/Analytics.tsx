export default function AnalyticsSection() {
  return (
    <section className="border-t">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-2xl font-bold">250+</div>
          <div className="text-sm text-muted-foreground">Enterprises</div>
        </div>
        <div>
          <div className="text-2xl font-bold">250K+</div>
          <div className="text-sm text-muted-foreground">Users</div>
        </div>
        <div>
          <div className="text-2xl font-bold">100+</div>
          <div className="text-sm text-muted-foreground">Countries</div>
        </div>
      </div>
    </section>
  );
}
