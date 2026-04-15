import { Card, CardContent } from "@/components/ui/card";
import { elearningFaqs } from "@/data";

export default function ElearningFaqPage() {
  return (
    <section className="section-padding pt-10 sm:pt-14">
      <div className="container-width">
        <span className="eyebrow">FAQ</span>
        <h1 className="font-heading mt-5 text-5xl font-bold text-[var(--color-ink)]">
          Frequently asked questions about Ruguna eLearning
        </h1>
        <div className="mt-8 grid gap-4">
          {elearningFaqs.map((item) => (
            <Card key={item.question}>
              <CardContent>
                <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                  {item.question}
                </h2>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--color-muted)]">
                  {item.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
