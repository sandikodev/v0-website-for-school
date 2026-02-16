import type { InterviewFormInput } from "@/lib/interview/types";
import {
  TEMPLATE_REGISTRY,
  type TemplateRegistryItem,
} from "@/lib/interview/templateRegistry";

const BASE_PRODUCTS = TEMPLATE_REGISTRY.filter(
  (
    item,
  ): item is TemplateRegistryItem & {
    marketplace: NonNullable<TemplateRegistryItem["marketplace"]>;
  } => Boolean(item.marketplace),
).map((item) => ({
  id: item.id,
  title: item.label,
  summary: item.marketplace.summary,
  category: item.marketplace.category,
  level: item.marketplace.level,
  persona: item.marketplace.persona,
  price: item.marketplace.price,
  status: item.marketplace.status,
  highlights: item.marketplace.highlights,
  template: item.form,
}));

export type InterviewTemplateProduct = ReturnType<
  typeof enrichProductWithStats
>;

function enrichProductWithStats<
  T extends {
    template: InterviewFormInput;
  },
>(product: T) {
  const sections = product.template.sections.length;
  const questions = product.template.sections.reduce((total, section) => {
    return total + section.questions.length;
  }, 0);

  return {
    ...product,
    sections,
    questions,
  };
}

export function getInterviewTemplateProducts(): InterviewTemplateProduct[] {
  return BASE_PRODUCTS.map((product) => enrichProductWithStats(product));
}
