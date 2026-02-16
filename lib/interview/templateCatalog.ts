import type { InterviewFormInput } from "@/lib/interview/types";
import {
  TEMPLATE_REGISTRY,
  type TemplateRegistryItem,
} from "@/lib/interview/templateRegistry";

export type TemplateCatalogItem = {
  id: string;
  label: string;
  form: InterviewFormInput;
  aliases?: string[];
};

export type TemplateResolvedItem = TemplateRegistryItem & {
  form: InterviewFormInput;
};

export const TEMPLATE_CATALOG: TemplateCatalogItem[] = TEMPLATE_REGISTRY.map(
  ({ id, label, form, aliases }) => ({
    id,
    label,
    form,
    aliases,
  }),
);

const TEMPLATE_MAP = TEMPLATE_CATALOG.reduce<Map<string, TemplateResolvedItem>>(
  (map, item) => {
    const keys = [item.id, ...(item.aliases ?? [])];
    keys.forEach((key) => {
      map.set(key, {
        id: item.id,
        label: item.label,
        form: item.form,
      });
    });
    return map;
  },
  new Map(),
);

export function resolveTemplateByKey(
  templateKey: string,
): TemplateResolvedItem | undefined {
  return TEMPLATE_MAP.get(templateKey);
}

export function getTemplateOptions() {
  return TEMPLATE_CATALOG.map(({ id, label }) => ({ id, label }));
}

