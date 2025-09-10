import PageHeader from "@/components/layout/page-header";
import { NutritionClient } from "./nutrition-client";

export default function NutritionPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Nutrition Analyzer"
        description="Take a picture of your meal to get instant nutritional information."
      />
      <NutritionClient />
    </div>
  );
}
