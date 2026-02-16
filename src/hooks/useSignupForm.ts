"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
  SignupFormSchema,
  SignupStep,
  SignupUploadedFilePayload,
  SignupValues,
  defaultFormSchema,
  loadDynamicFormSchema,
} from "@/lib/signup/schema";
import { uploadFiles } from "@/lib/signup/upload";
import { submitForm } from "@/lib/signup/submit";

export type SignupUploadedFile = SignupUploadedFilePayload;

function createInitialValues(): SignupValues {
  return {
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamatLengkap: "",
    noHP: "",
    email: "",
    namaAyah: "",
    pekerjaanAyah: "",
    namaIbu: "",
    pekerjaanIbu: "",
    noHPOrangtua: "",
    asalSekolah: "",
    alamatSekolah: "",
    jalurPendaftaran: "",
    gelombangPendaftaran: "",
    prestasi: "",
    persetujuan: false,
  };
}

const STORAGE_KEY = "signup-form-state/v1";

interface PersistedState {
  step: SignupStep;
  values: SignupValues;
  uploadedFiles: SignupUploadedFile[];
}

function loadPersistedState(): PersistedState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const step = [1, 2, 3, 4].includes(Number(parsed.step))
      ? (Number(parsed.step) as SignupStep)
      : 1;

    return {
      step,
      values: {
        ...createInitialValues(),
        ...(parsed.values ?? {}),
      },
      uploadedFiles: Array.isArray(parsed.uploadedFiles)
        ? (parsed.uploadedFiles as SignupUploadedFile[])
        : [],
    };
  } catch {
    return null;
  }
}

function persistState(state: PersistedState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Abaikan error penulisan (misal storage penuh)
  }
}

function clearPersistedState() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Abaikan error penghapusan
  }
}

interface UploadState {
  isUploading: boolean;
  error: string | null;
}

interface SignupStatus {
  pending: boolean;
  phase: "idle" | "success";
  error?: string | null;
  registrationNumber?: string;
}

interface UseSignupFormResult {
  step: SignupStep;
  totalSteps: number;
  schema: SignupFormSchema;
  state: {
    values: SignupValues;
    uploadedFiles: SignupUploadedFile[];
    upload: UploadState;
  };
  status: SignupStatus;
  summary: {
    title: string;
    subtitle: string;
    allowNext: boolean;
  };
  handlers: {
    updateField<Field extends keyof SignupValues>(
      field: Field,
      value: SignupValues[Field],
    ): void;
    toggleAgreement(value: boolean): void;
    handleUpload(files: FileList | null): Promise<void>;
    removeFile(filename: string): void;
    nextStep(): void;
    prevStep(): void;
    submit(): void;
    reset(): void;
  };
}

const totalSteps = 4 satisfies number;

const stepSummary: Record<
  SignupStep,
  {
    title: string;
    subtitle: string;
    allowNext: (values: SignupValues, schema: SignupFormSchema) => boolean;
  }
> = {
  1: {
    title: "Data Pribadi Siswa",
    subtitle: "Lengkapi data pribadi calon siswa",
    allowNext: (values, schema) => {
      const requiredFields: Array<keyof SignupValues> = [
        "namaLengkap",
        "tempatLahir",
        "tanggalLahir",
        "jenisKelamin",
        "alamatLengkap",
        "noHP",
        "email",
      ];

      return requiredFields.every((field) => {
        const config = schema[field];
        if (!config?.required) {
          return true;
        }

        const value = values[field];
        return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
      });
    },
  },
  2: {
    title: "Data Orangtua",
    subtitle: "Lengkapi data orangtua/wali",
    allowNext: (values, schema) => {
      const requiredFields: Array<keyof SignupValues> = [
        "namaAyah",
        "pekerjaanAyah",
        "namaIbu",
        "pekerjaanIbu",
        "noHPOrangtua",
      ];

      return requiredFields.every((field) => {
        const config = schema[field];
        if (!config?.required) {
          return true;
        }

        const value = values[field];
        return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
      });
    },
  },
  3: {
    title: "Data Sekolah & Prestasi",
    subtitle: "Lengkapi data sekolah asal dan lampiran pendukung",
    allowNext: (values, schema) => {
      const requiredFields: Array<keyof SignupValues> = [
        "asalSekolah",
        "alamatSekolah",
        "jalurPendaftaran",
        "gelombangPendaftaran",
      ];

      return requiredFields.every((field) => {
        const config = schema[field];
        if (!config?.required) {
          return true;
        }

        const value = values[field];
        return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
      });
    },
  },
  4: {
    title: "Konfirmasi & Persetujuan",
    subtitle: "Periksa kembali data dan berikan persetujuan",
    allowNext: (values) => values.persetujuan,
  },
};

export function useSignupForm(): UseSignupFormResult {
  const [step, setStep] = useState<SignupStep>(1);
  const [schema, setSchema] = useState<SignupFormSchema>(defaultFormSchema);
  const [values, setValues] = useState<SignupValues>(createInitialValues);
  const [uploadedFiles, setUploadedFiles] = useState<SignupUploadedFile[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    error: null,
  });
  const [status, setStatus] = useState<SignupStatus>({
    pending: false,
    phase: "idle",
    error: null,
  });
  const [isPending, startTransition] = useTransition();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setSchema(loadDynamicFormSchema());
  }, []);

  useEffect(() => {
    const persisted = loadPersistedState();
    if (persisted) {
      setStep(persisted.step);
      setValues(persisted.values);
      setUploadedFiles(persisted.uploadedFiles);
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated || status.phase === "success") {
      return;
    }

    persistState({
      step,
      values,
      uploadedFiles,
    });
  }, [hasHydrated, status.phase, step, uploadedFiles, values]);

  const updateField = useCallback(
    <Field extends keyof SignupValues>(field: Field, value: SignupValues[Field]) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const toggleAgreement = useCallback((value: boolean) => {
    setValues((prev) => ({ ...prev, persetujuan: value }));
  }, []);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    setUploadState({ isUploading: true, error: null });
    try {
      const result = await uploadFiles(formData);
      setUploadedFiles((prev) => [...prev, ...result]);
      setUploadState({ isUploading: false, error: null });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal mengunggah file";
      setUploadState({ isUploading: false, error: message });
    }
  }, []);

  const removeFile = useCallback((filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.filename !== filename));
  }, []);

  const nextStep = useCallback(() => {
    setStep((prev) => Math.min((prev + 1) as SignupStep, totalSteps as SignupStep));
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max((prev - 1) as SignupStep, 1 as SignupStep));
  }, []);

  const submit = useCallback(() => {
    startTransition(async () => {
      setStatus((prev) => ({ ...prev, pending: true, error: null }));
      try {
        const response = await submitForm(values, uploadedFiles, schema);
        setStatus({
          pending: false,
          phase: "success",
          registrationNumber: response.registrationNumber,
        });
        clearPersistedState();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal mengirim pendaftaran";
        setStatus({ pending: false, phase: "idle", error: message });
      }
    });
  }, [uploadedFiles, values]);

  const reset = useCallback(() => {
    setStep(1);
    setValues(createInitialValues());
    setUploadedFiles([]);
    setUploadState({ isUploading: false, error: null });
    setStatus({ pending: false, phase: "idle", error: null });
    clearPersistedState();
  }, []);

  const summary = useMemo(() => {
    const current = stepSummary[step];
    return {
      title: current.title,
      subtitle: current.subtitle,
      allowNext: current.allowNext(values, schema),
    };
  }, [schema, step, values]);

  return {
    step,
    totalSteps,
    schema,
    state: {
      values,
      uploadedFiles,
      upload: uploadState,
    },
    status: {
      ...status,
      pending: status.pending || isPending,
    },
    summary,
    handlers: {
      updateField,
      toggleAgreement,
      handleUpload,
      removeFile,
      nextStep,
      prevStep,
      submit,
      reset,
    },
  };
}

