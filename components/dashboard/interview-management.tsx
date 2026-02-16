"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TabsContent } from "@/components/ui/tabs";
import { InterviewSessionsTab } from "@/components/dashboard/interview/InterviewSessionsTab";
import { InterviewFormsTab } from "@/components/dashboard/interview/InterviewFormsTab";
import { FlatTabNavigation } from "@/components/dashboard/FlatTabNavigation";

export default function InterviewManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const viewFromQuery = useMemo(() => {
    const viewParam = searchParams.get("interviewView");
    return viewParam === "forms" ? "forms" : "schedule";
  }, [searchParams]);

  const [tabValue, setTabValue] = useState<"schedule" | "forms">(
    viewFromQuery,
  );

  useEffect(() => {
    setTabValue(viewFromQuery);
  }, [viewFromQuery]);

  const handleTabChange = (value: string) => {
    const nextValue = value === "forms" ? "forms" : "schedule";
    setTabValue(nextValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set("interviewView", nextValue);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const tabs = [
    { key: "schedule", label: "Jadwal Interview" },
    { key: "forms", label: "Template Form Interview" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Interview Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola jadwal interview dan susun formulir penilaian sesuai kebutuhan sekolah.
        </p>
      </div>

      <FlatTabNavigation
        tabs={tabs}
        current={tabValue}
        onTabChange={handleTabChange}
        ariaLabel="Interview sections"
      >
        <TabsContent value="schedule">
          <InterviewSessionsTab />
        </TabsContent>

        <TabsContent value="forms">
          <InterviewFormsTab />
        </TabsContent>
      </FlatTabNavigation>
    </div>
  );
}
