import { Card, CardContent } from "@/components/ui/card";
import { getAdminCategories } from "@/lib/platform/staff-records";

export const dynamic = "force-dynamic";

export default async function AdminElearningCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h1 className="font-heading text-3xl font-bold text-[var(--color-ink)]">
            Category management
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Maintain the eLearning categories through Ruguna schools and their published online
            courses.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
                {category.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {category.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-[var(--color-ink)]">
                {category.courseCount} online courses - {category.programCount} programmes
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
