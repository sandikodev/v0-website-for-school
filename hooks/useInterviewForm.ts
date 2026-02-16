"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import type {
  InterviewChoiceField,
  InterviewConfig,
  InterviewField,
  InterviewStep,
  InterviewValues,
} from "@/lib/interview/config";
import { normalizeInterviewValues } from "@/lib/interview/schema";
import { submitInterviewForm } from "@/lib/interview/submit";

type InterviewPhase = "idle" | "success";

interface UseInterviewFormOptions {
  sessionId: string;
  config: InterviewConfig;
  initialValues?: InterviewValues | null;
}

interface InterviewStatus {
  pending: boolean;
  phase: InterviewPhase;
  error: string | null;
  message?: string | null;
}

interface StepSummary {
  title: string;
  description?: string;
  allowNext: boolean;
  completedFields: number;
  totalFields: number;
}

interface InterviewHandlers {
  updateField: (fieldId: string, value: string) => void;
  updateTextarea: (fieldId: string, value: string) => void;
  selectOption: (fieldId: string, value: string) => void;
  toggleCheckbox: (fieldId: string, optionValue: string, checked: boolean) => void;
  updateOtherField: (fieldId: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  submit: () => void;
  reset: () => void;
}

interface UseInterviewFormResult {
  step: number;
  totalSteps: number;
  steps: InterviewStep[];
  values: InterviewValues;
  status: InterviewStatus;
  summary: StepSummary;
  handlers: InterviewHandlers;
}

function storageKey(config: InterviewConfig, sessionId: string) {
  const normalizedSession = sessionId || "new";
  return `interview-form/${config.slug}/${normalizedSession}/${config.storageVersion}`;
}

function isChoiceField(field: InterviewField): field is InterviewChoiceField {
  return field.type === "radio" || field.type === "checkbox";
}

function ensureArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  return [];
}

function calculateFieldCompletion(
  field: InterviewField,
  values: InterviewValues,
): boolean {
  const value = values[field.id];

  if (!field.required) {
    return true;
  }

  if (field.type === "text" || field.type === "textarea" || field.type === "radio") {
    const strValue = typeof value === "string" ? value.trim() : "";
    if (!strValue) {
      return false;
    }

    if (
      isChoiceField(field) &&
      field.allowOther &&
      field.otherFieldId &&
      strValue === "__other__"
    ) {
      const otherValue = values[field.otherFieldId];
      return typeof otherValue === "string" && otherValue.trim().length > 0;
    }

    return true;
  }

  if (field.type === "checkbox") {
    const list = ensureArray(value);
    if (!list.length) {
      return false;
    }

    if (
      field.allowOther &&
      field.otherFieldId &&
      list.includes("__other__")
    ) {
      const otherValue = values[field.otherFieldId];
      return typeof otherValue === "string" && otherValue.trim().length > 0;
    }

    return true;
  }

  return true;
}

function countCompletedFields(step: InterviewStep, values: InterviewValues) {
  let completed = 0;
  let total = 0;

  for (const field of step.fields) {
    total += 1;
    if (calculateFieldCompletion(field, values)) {
      completed += 1;
    }
  }

  return { completed, total };
}

export function useInterviewForm({
  sessionId,
  config,
  initialValues,
}: UseInterviewFormOptions): UseInterviewFormResult {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<InterviewValues>(() =>
    normalizeInterviewValues(config, initialValues),
  );
  const [status, setStatus] = useState<InterviewStatus>({
    pending: false,
    phase: "idle",
    error: null,
  });
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();

  const key = useMemo(() => storageKey(config, sessionId), [config, sessionId]);

  const fieldMap = useMemo(() => {
    const map = new Map<string, InterviewField | InterviewChoiceField>();
    for (const step of config.steps) {
      for (const field of step.fields) {
        map.set(field.id, field);
        if (
          isChoiceField(field) &&
          field.allowOther &&
          field.otherFieldId
        ) {
          map.set(field.otherFieldId, field);
        }
      }
    }
    return map;
  }, [config]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as InterviewValues;
        setValues(normalizeInterviewValues(config, parsed));
      }
    } catch (error) {
      console.error("Failed to restore interview form state:", error);
    } finally {
      setHasHydrated(true);
    }
  }, [config, key]);

  useEffect(() => {
    if (!hasHydrated || status.phase === "success") return;
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(values));
    } catch (error) {
      console.error("Failed to persist interview form state:", error);
    }
  }, [hasHydrated, key, status.phase, values]);

  const steps = config.steps;
  const totalSteps = steps.length;

  const summary = useMemo<StepSummary>(() => {
    const currentStep = steps[step - 1];
    const { completed, total } = countCompletedFields(currentStep, values);

    const allowNext =
      completed === total &&
      currentStep.fields.every((field) => calculateFieldCompletion(field, values));

    return {
      title: currentStep.title,
      description: currentStep.description,
      allowNext,
      completedFields: completed,
      totalFields: total,
    };
  }, [step, steps, values]);

  const updateField = useCallback((fieldId: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  const updateTextarea = useCallback((fieldId: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  const selectOption = useCallback(
    (fieldId: string, value: string) => {
      setValues((prev) => {
        const next: InterviewValues = { ...prev, [fieldId]: value };

        const field = fieldMap.get(fieldId);
        if (
          field &&
          isChoiceField(field) &&
          field.allowOther &&
          field.otherFieldId &&
          value !== "__other__"
        ) {
          next[field.otherFieldId] = "";
        }

        return next;
      });
    },
    [fieldMap],
  );

  const toggleCheckbox = useCallback(
    (fieldId: string, optionValue: string, checked: boolean) => {
      setValues((prev) => {
        const currentValue = ensureArray(prev[fieldId]);
        let nextValues = currentValue;

        if (checked) {
          nextValues = Array.from(new Set([...currentValue, optionValue]));
        } else {
          nextValues = currentValue.filter((item) => item !== optionValue);
        }

        const updated: InterviewValues = {
          ...prev,
          [fieldId]: nextValues,
        };

        if (
          optionValue === "__other__" &&
          !checked
        ) {
          const field = fieldMap.get(fieldId);
          if (
            field &&
            isChoiceField(field) &&
            field.otherFieldId
          ) {
            updated[field.otherFieldId] = "";
          }
        }

        return updated;
      });
    },
    [fieldMap],
  );

  const updateOtherField = useCallback((fieldId: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  const nextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const submit = useCallback(() => {
    startTransition(async () => {
      setStatus({ pending: true, phase: "idle", error: null });
      try {
        await submitInterviewForm({ sessionId, config, values });

        if (typeof window !== "undefined") {
          localStorage.removeItem(key);
        }

        setStatus({
          pending: false,
          phase: "success",
          error: null,
        });
      } catch (error) {
        setStatus({
          pending: false,
          phase: "idle",
          error:
            error instanceof Error
              ? error.message
              : "Gagal menyimpan hasil interview.",
        });
      }
    });
  }, [config, key, sessionId, startTransition, values]);

  const reset = useCallback(() => {
    setValues(normalizeInterviewValues(config, initialValues));
    setStep(1);
    setStatus({ pending: false, phase: "idle", error: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }, [config, initialValues, key]);

  return {
    step,
    totalSteps,
    steps,
    values,
    status: {
      ...status,
      pending: status.pending || isPending,
    },
    summary,
    handlers: {
      updateField,
      updateTextarea,
      selectOption,
      toggleCheckbox,
      updateOtherField,
      nextStep,
      prevStep,
      submit,
      reset,
    },
  };
}


