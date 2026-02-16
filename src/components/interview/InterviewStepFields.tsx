"use client";

import { Fragment } from "react";
import type {
  InterviewChoiceField,
  InterviewField,
  InterviewStep,
  InterviewValues,
} from "@/lib/interview/config";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface InterviewStepFieldsProps {
  step: InterviewStep;
  values: InterviewValues;
  onChange: {
    updateField: (fieldId: string, value: string) => void;
    updateTextarea: (fieldId: string, value: string) => void;
    selectOption: (fieldId: string, value: string) => void;
    toggleCheckbox: (fieldId: string, optionValue: string, checked: boolean) => void;
    updateOtherField: (fieldId: string, value: string) => void;
  };
  disabled?: boolean;
}

function isChoiceField(field: InterviewField): field is InterviewChoiceField {
  return field.type === "radio" || field.type === "checkbox";
}

function toArray(value: unknown): string[] {
  return Array.isArray(value) ? value : [];
}

export function InterviewStepFields({
  step,
  values,
  onChange,
  disabled,
}: InterviewStepFieldsProps) {
  return (
    <div className="space-y-6">
      {step.fields.map((field) => {
        const baseValue = values[field.id];
        const otherFieldId =
          isChoiceField(field) && field.allowOther ? field.otherFieldId : null;
        const otherValue =
          (otherFieldId && typeof values[otherFieldId] === "string"
            ? (values[otherFieldId] as string)
            : "") ?? "";

        if (field.type === "text") {
          return (
            <Card key={field.id} className="border-slate-200">
              <CardContent className="space-y-3 p-6">
                <div className="space-y-1">
                  <Label htmlFor={field.id} className="text-base font-semibold">
                    {field.label}
                    {field.required && <span className="ml-1 text-rose-600">*</span>}
                  </Label>
                  {field.description && (
                    <p className="text-sm text-slate-500">{field.description}</p>
                  )}
                </div>
                <Input
                  id={field.id}
                  disabled={disabled}
                  value={typeof baseValue === "string" ? baseValue : ""}
                  onChange={(event) => onChange.updateField(field.id, event.target.value)}
                  placeholder={field.helperText}
                />
                {field.helperText && (
                  <p className="text-xs text-slate-500">{field.helperText}</p>
                )}
              </CardContent>
            </Card>
          );
        }

        if (field.type === "textarea") {
          return (
            <Card key={field.id} className="border-slate-200">
              <CardContent className="space-y-3 p-6">
                <div className="space-y-1">
                  <Label htmlFor={field.id} className="text-base font-semibold">
                    {field.label}
                    {field.required && <span className="ml-1 text-rose-600">*</span>}
                  </Label>
                  {field.description && (
                    <p className="text-sm text-slate-500">{field.description}</p>
                  )}
                </div>
                <Textarea
                  id={field.id}
                  disabled={disabled}
                  value={typeof baseValue === "string" ? baseValue : ""}
                  onChange={(event) => onChange.updateTextarea(field.id, event.target.value)}
                  rows={5}
                  placeholder={field.helperText}
                />
                {field.helperText && (
                  <p className="text-xs text-slate-500">{field.helperText}</p>
                )}
              </CardContent>
            </Card>
          );
        }

        if (field.type === "radio") {
          const selectedValue =
            typeof baseValue === "string" && baseValue.length ? baseValue : "";

          return (
            <Card key={field.id} className="border-slate-200">
              <CardContent className="space-y-4 p-6">
                <div className="space-y-1">
                  <p className="text-base font-semibold">
                    {field.label}
                    {field.required && <span className="ml-1 text-rose-600">*</span>}
                  </p>
                  {field.description && (
                    <p className="text-sm text-slate-500">{field.description}</p>
                  )}
                  {field.helperText && (
                    <p className="text-xs text-slate-500">{field.helperText}</p>
                  )}
                </div>
                <RadioGroup
                  value={selectedValue}
                  onValueChange={(value) => onChange.selectOption(field.id, value)}
                  className="grid gap-2"
                  disabled={disabled}
                >
                  {field.options.map((option) => (
                    <Label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm transition-colors hover:border-emerald-400",
                        selectedValue === option.value && "border-emerald-500 bg-emerald-50",
                      )}
                    >
                      <RadioGroupItem value={option.value} />
                      <span className="font-medium text-slate-700">
                        {option.label}
                      </span>
                    </Label>
                  ))}

                  {field.allowOther && field.otherLabel && (
                    <div className="space-y-2 rounded-lg border border-dashed border-slate-300 bg-white p-3">
                      <Label className="flex items-center gap-3 text-sm font-medium text-slate-600">
                        <RadioGroupItem value="__other__" />
                        {field.otherLabel}
                      </Label>
                      {selectedValue === "__other__" && (
                        <Input
                          disabled={disabled}
                          value={otherValue}
                          onChange={(event) =>
                            field.otherFieldId &&
                            onChange.updateOtherField(field.otherFieldId, event.target.value)
                          }
                          placeholder="Tuliskan pilihan lain"
                        />
                      )}
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>
          );
        }

        if (field.type === "checkbox") {
          const selected = toArray(baseValue);

          return (
            <Card key={field.id} className="border-slate-200">
              <CardContent className="space-y-4 p-6">
                <div className="space-y-1">
                  <p className="text-base font-semibold">
                    {field.label}
                    {field.required && <span className="ml-1 text-rose-600">*</span>}
                  </p>
                  {field.description && (
                    <p className="text-sm text-slate-500">{field.description}</p>
                  )}
                  {field.helperText && (
                    <p className="text-xs text-slate-500">{field.helperText}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  {field.options.map((option) => {
                    const isChecked = selected.includes(option.value);
                    return (
                      <Label
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm transition-colors hover:border-emerald-400",
                          isChecked && "border-emerald-500 bg-emerald-50",
                        )}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            onChange.toggleCheckbox(
                              field.id,
                              option.value,
                              Boolean(checked),
                            )
                          }
                          disabled={disabled}
                        />
                        <span className="font-medium text-slate-700">
                          {option.label}
                        </span>
                      </Label>
                    );
                  })}

                  {field.allowOther && field.otherLabel && (
                    <div className="space-y-2 rounded-lg border border-dashed border-slate-300 bg-white p-3">
                      <Label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-600">
                        <Checkbox
                          checked={selected.includes("__other__")}
                          onCheckedChange={(checked) =>
                            onChange.toggleCheckbox(
                              field.id,
                              "__other__",
                              Boolean(checked),
                            )
                          }
                          disabled={disabled}
                        />
                        {field.otherLabel}
                      </Label>
                      {selected.includes("__other__") && (
                        <Input
                          disabled={disabled}
                          value={otherValue}
                          onChange={(event) =>
                            field.otherFieldId &&
                            onChange.updateOtherField(field.otherFieldId, event.target.value)
                          }
                          placeholder="Tuliskan pilihan lain"
                        />
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        }

        return <Fragment key={field.id} />;
      })}
    </div>
  );
}


