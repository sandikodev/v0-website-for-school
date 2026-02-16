"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import { TabsContent } from "@/components/ui/tabs";
import { useTabParam } from "@/hooks";
import { FlatTabNavigation } from "@/components/dashboard/FlatTabNavigation";

const ProfileTab = dynamic(() => import("./school/ProfileTab"));
const AboutTab = dynamic(() => import("./school/AboutTab"));
const StructureTab = dynamic(() => import("./school/StructureTab"));
const FacilityTab = dynamic(() => import("./school/FacilityTab"));

type TabKey = "profil" | "tentang" | "struktur" | "fasilitas";

interface TabDefinition {
  key: TabKey;
  label: string;
  Component: ComponentType;
}

const TAB_DEFINITIONS: TabDefinition[] = [
  { key: "profil", label: "Profil", Component: ProfileTab },
  { key: "tentang", label: "Tentang", Component: AboutTab },
  { key: "struktur", label: "Struktur", Component: StructureTab },
  { key: "fasilitas", label: "Fasilitas", Component: FacilityTab },
];

export function SchoolTabs() {
  const { current, setTab } = useTabParam("profil");
  const fallbackTab = TAB_DEFINITIONS[0]?.key ?? "profil";
  const activeTab = (TAB_DEFINITIONS.find((tab) => tab.key === current)?.key ??
    fallbackTab) as TabKey;

  const tabs = TAB_DEFINITIONS.map(({ key, label }) => ({ key, label }));

  return (
    <FlatTabNavigation
      tabs={tabs}
      current={activeTab}
      onTabChange={setTab}
      ariaLabel="School sections"
    >
      {TAB_DEFINITIONS.map(({ key, Component }) => (
        <TabsContent key={key} value={key}>
          <Component />
        </TabsContent>
      ))}
    </FlatTabNavigation>
  );
}

