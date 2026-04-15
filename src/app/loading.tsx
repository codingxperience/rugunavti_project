export default function Loading() {
  return (
    <section className="section-padding">
      <div className="container-width grid gap-4">
        <div className="h-24 rounded-[28px] bg-white/80" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-56 rounded-[28px] bg-white/80" />
          <div className="h-56 rounded-[28px] bg-white/80" />
        </div>
      </div>
    </section>
  );
}
