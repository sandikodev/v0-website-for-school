import { z } from "zod";
import type {
  InterviewChoiceField,
  InterviewConfig,
  InterviewField,
  InterviewValues,
} from "./config";
export type { InterviewValues } from "./config";

type InterviewValue = string | string[] | null;

const emptyStringSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((value) => value ?? "");

function buildFieldSchema(field: InterviewField) {
  const label = field.label;

  if (field.type === "text" || field.type === "textarea") {
    const schema = field.required
      ? z.string().trim().min(1, `${label} wajib diisi`)
      : z.string().trim().optional().or(z.literal(""));
    return schema;
  }

  if (field.type === "radio") {
    const base = z.string().trim();
    return field.required
      ? base.min(1, `${label} wajib dipilih`)
      : base.optional().or(z.literal(""));
  }

  if (field.type === "checkbox") {
    const base = z.array(z.string());
    return field.required ? base.min(1, `${label} minimal pilih satu`) : base;
  }

  return z.any();
}

function buildOtherFieldSchema(field: InterviewChoiceField) {
  return field.allowOther && field.otherFieldId
    ? emptyStringSchema
    : null;
}

export function buildInterviewSchema(config: InterviewConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const step of config.steps) {
    for (const field of step.fields) {
      shape[field.id] = buildFieldSchema(field);

      if (
        (field.type === "radio" || field.type === "checkbox") &&
        (field as InterviewChoiceField).allowOther &&
        (field as InterviewChoiceField).otherFieldId
      ) {
        const otherSchema = buildOtherFieldSchema(
          field as InterviewChoiceField,
        );
        if (otherSchema) {
          shape[(field as InterviewChoiceField).otherFieldId!] = otherSchema;
        }
      }
    }
  }

  return z.object(shape);
}

function defaultValueForField(field: InterviewField): InterviewValue {
  if (field.type === "checkbox") {
    return [];
  }
  return "";
}

export function createInitialInterviewValues(
  config: InterviewConfig,
): InterviewValues {
  const values: InterviewValues = {};

  for (const step of config.steps) {
    for (const field of step.fields) {
      values[field.id] = defaultValueForField(field);

      if (
        (field.type === "radio" || field.type === "checkbox") &&
        (field as InterviewChoiceField).allowOther &&
        (field as InterviewChoiceField).otherFieldId
      ) {
        values[(field as InterviewChoiceField).otherFieldId!] = "";
      }
    }
  }

  return values;
}

export function normalizeInterviewValues(
  config: InterviewConfig,
  raw: InterviewValues | null | undefined,
): InterviewValues {
  const base = createInitialInterviewValues(config);
  if (!raw) return base;

  for (const key of Object.keys(base)) {
    const value = raw[key];
    if (Array.isArray(base[key])) {
      base[key] = Array.isArray(value) ? value : [];
    } else if (typeof base[key] === "string") {
      base[key] = typeof value === "string" ? value : "";
    } else {
      base[key] = value ?? base[key];
    }
  }

  return base;
}


