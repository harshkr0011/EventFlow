
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type EventFiltersProps = {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  isMobile?: boolean;
};

export function EventFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  isMobile
}: EventFiltersProps) {
  return (
    <Card className="bg-card/60 backdrop-blur-lg border border-border/10 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>Filter Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-semibold">Categories</h3>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'}`}>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => onCategoryChange(category)}
                />
                <Label
                  htmlFor={category}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
