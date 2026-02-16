# 📝 Form Editor Components Documentation

## 🎯 Overview

Dokumentasi ini menjelaskan struktur dan implementasi komponen Form Editor untuk sistem interview. Form Editor memungkinkan admin untuk membuat, mengedit, dan mengelola form interview secara modular dengan antarmuka yang intuitif dan responsif.

## 📁 Struktur Komponen

### Component Hierarchy

```
InterviewFormsTab (Main Container)
├── FormList (List of forms)
├── FormTemplatesBar (Template buttons)
└── Dialog (Editor Modal)
    └── FormEditorContent (Main Editor)
        ├── TableOfContents (Desktop TOC - sidebar)
        ├── MobileToc (Mobile TOC - horizontal)
        ├── FormInfoPane (Form information)
        ├── SectionEditorPane (Section editor)
        │   └── FormSectionsEditor
        │       ├── SectionHeader
        │       └── SectionItem (Accordion)
        │           ├── SectionFields
        │           └── QuestionsList
        │               └── QuestionEditor
        │                   ├── QuestionTextFields
        │                   ├── QuestionTypeSelect
        │                   ├── RequiredSwitch
        │                   └── QuestionOptionsEditor
        │                       └── OptionItem
        └── PreviewBrowser (Preview mode)
```

## 🎨 Komponen Utama

### 1. InterviewFormsTab

**Lokasi**: `components/dashboard/interview/InterviewFormsTab.tsx`

**Fungsi**: Container utama yang mengelola state form editor dan dialog.

**Fitur**:
- List form interview
- Create/Edit/Delete form
- Template form management
- Save/Load form data
- Success/Error handling

### 2. FormEditorContent

**Lokasi**: `components/dashboard/interview/editor/FormEditorContent.tsx`

**Fungsi**: Main editor component yang mengatur layout dan navigasi.

**Fitur**:
- Layout responsif (desktop sidebar + mobile horizontal)
- Navigation antara panes (form-info, sections, preview)
- Previous/Next navigation buttons
- Preview mode handling

### 3. TableOfContents (Desktop)

**Lokasi**: `components/dashboard/interview/editor/TableOfContents.tsx`

**Fungsi**: Sidebar navigation untuk desktop (lg ke atas).

**Fitur**:
- Collapse/Expand functionality
- Scrollable content area
- Active pane highlighting
- Auto-scroll to active item
- Sticky positioning (tidak ikut scroll dengan konten)

**Breakpoint**: `lg:` (1024px ke atas)

**Props**:
```typescript
interface TableOfContentsProps {
  tocItems: EditorPaneItem[];
  activePane: EditorPaneKey;
  onSelectPane: (pane: EditorPaneKey) => void;
  hidden?: boolean;
}
```

### 4. MobileToc (Mobile/Tablet)

**Lokasi**: `components/dashboard/interview/editor/TableOfContents.tsx`

**Fungsi**: Horizontal navigation untuk mobile dan tablet.

**Fitur**:
- Responsive display berdasarkan breakpoint
- Scrollable horizontal navigation
- Active state highlighting
- Tooltip dengan label lengkap

**Breakpoint**: `< lg` (di bawah 1024px)

**Props**:
```typescript
interface MobileTocProps {
  tocItems: EditorPaneItem[];
  activePane: EditorPaneKey;
  onSelectPane: (pane: EditorPaneKey) => void;
}
```

## 📱 Responsive Behavior

### MobileToc Responsive Logic

#### Breakpoint Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    VIEWPORT WIDTH BREAKPOINT                     │
└─────────────────────────────────────────────────────────────────┘

   < 640px          640px - 1024px           >= 1024px
   (Mobile)          (Tablet)                 (Desktop)
      │                    │                       │
      │                    │                       │
      ▼                    ▼                       ▼
┌──────────┐      ┌──────────────┐      ┌──────────────────┐
│  MOBILE  │      │   TABLET     │      │    DESKTOP       │
│  < sm    │      │  sm - md     │      │    >= lg         │
└──────────┘      └──────────────┘      └──────────────────┘
      │                    │                       │
      │                    │                       │
      ▼                    ▼                       ▼
┌──────────┐      ┌──────────────┐      ┌──────────────────┐
│  Index   │      │   Label      │      │   Hidden         │
│  (0,1,2) │      │  ("Informasi │      │   (Desktop TOC   │
│          │      │   Form",     │      │    muncul)       │
│          │      │   "Bagian 1")│      │                  │
└──────────┘      └──────────────┘      └──────────────────┘
```

#### Implementation Flowchart

```
                    START
                      │
                      ▼
            ┌─────────────────┐
            │  Check Viewport │
            │     Width       │
            └─────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   < 640px     640px - 1024px   >= 1024px
   (Mobile)      (Tablet)       (Desktop)
        │             │             │
        ▼             ▼             ▼
   ┌─────────┐  ┌──────────┐  ┌─────────┐
   │ Display │  │ Display  │  │ Display │
   │ Index   │  │ Label    │  │ Hidden  │
   │ (0,1,2) │  │ (Text)   │  │ (lg:    │
   │         │  │          │  │ hidden) │
   └─────────┘  └──────────┘  └─────────┘
        │             │             │
        └─────────────┴─────────────┘
                      │
                      ▼
                    END
```

#### Breakpoint Details

| Viewport | Breakpoint | Display | Button Style |
|----------|------------|---------|--------------|
| **< 640px** | Mobile | Index (0, 1, 2, ...) | Compact (`min-w-8 h-8 px-0`) |
| **640px - 1024px** | Tablet (sm - md) | Label ("Informasi Form", "Bagian 1", ...) | Wider (`sm:min-w-0 sm:px-3`) |
| **>= 1024px** | Desktop (lg+) | Hidden | Desktop TOC sidebar muncul |

#### Code Implementation

```typescript
export function MobileToc({ tocItems, activePane, onSelectPane }: MobileTocProps) {
  return (
    <div className="lg:hidden"> {/* Hidden pada lg ke atas */}
      <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-2">
        {tocItems.map((item, index) => {
          const isActive = activePane === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelectPane(item.id)}
              className={cn(
                "flex items-center justify-center h-8 rounded-full border text-xs font-medium transition-all",
                "hover:scale-105 active:scale-95",
                // Mobile: compact (min-w-8), Tablet: wider (px-3)
                "min-w-8 px-0 sm:min-w-0 sm:px-3",
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
              title={item.label}
              aria-label={item.label}
            >
              {/* Index: Visible di mobile (< sm), hidden di sm+ */}
              <span className="sm:hidden">{index}</span>
              
              {/* Label: Hidden di mobile, visible di sm sampai sebelum lg */}
              <span className="hidden sm:inline lg:hidden whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

### TableOfContents (Desktop) Responsive Logic

#### Breakpoint Behavior

**Desktop (>= 1024px / lg+)**:
- Sidebar navigation dengan collapse/expand
- Sticky positioning (tidak ikut scroll)
- Scrollable content area untuk daftar panjang
- Max-height: `calc(100vh - 10rem - 2rem)` (dengan margin)

**Mobile/Tablet (< 1024px)**:
- Hidden (MobileToc muncul)

#### Constants

Konstanta untuk TOC diatur di `components/dashboard/interview/editor/constants.ts`:

```typescript
export const TOC_CONSTANTS = {
  HEADER_OFFSET: '10rem',        // Offset dari dialog header
  MARGIN_SIZE: '1rem',           // Margin m-4 = 1rem per sisi
  VERTICAL_MARGIN: '2rem',       // Margin top + bottom
  getMaxHeight: (): string => {
    return `calc(100vh - ${TOC_CONSTANTS.HEADER_OFFSET} - ${TOC_CONSTANTS.VERTICAL_MARGIN})`;
  },
  WIDTH_EXPANDED: '12rem',       // w-48 = 12rem
  WIDTH_COLLAPSED: '3rem',       // w-12 = 3rem
} as const;
```

## 🔄 State Management

### Editor State

```typescript
interface EditorForm {
  id?: string;
  title: string;
  description?: string | null;
  slug?: string;
  status: InterviewFormStatus;
  version?: number;
  interviewTypeId?: string;
  metadata?: Record<string, unknown> | null;
  setAsDefault?: boolean;
  sections: EditorSection[];
}
```

### Navigation State

```typescript
type EditorPaneKey = "form-info" | "preview" | `section-${number}`;

interface EditorPaneItem {
  id: EditorPaneKey;
  label: string;
}
```

## 🎨 Styling & Layout

### Scroll Behavior

#### FormEditorContent
- Container utama: `flex flex-1 min-h-0 gap-4 md:gap-6`
- TableOfContents: Di luar area scroll (sticky)
- Konten editor: `flex-1 min-h-0 overflow-y-auto` (scroll independent)

#### TableOfContents
- Container: `sticky top-0` dengan `max-height` terbatas
- Header: `shrink-0` (tidak scroll)
- Content area: `flex-1 min-h-0 overflow-y-auto` (scroll independent)

### Responsive Padding

- Mobile: `px-3 py-2`, `px-4 py-4`
- Tablet: `md:px-6 py-3`, `md:px-6`
- Desktop: Konsisten dengan tablet

### Button Responsive

- Mobile: Icon-only (`h-8 w-8`)
- Tablet/Desktop: Icon + text (`md:h-auto md:w-auto md:px-3`)

## 🔧 Constants & Configuration

### TOC Constants

File: `components/dashboard/interview/editor/constants.ts`

```typescript
export const TOC_CONSTANTS = {
  HEADER_OFFSET: '10rem',
  MARGIN_SIZE: '1rem',
  VERTICAL_MARGIN: '2rem',
  getMaxHeight: (): string => {
    return `calc(100vh - ${TOC_CONSTANTS.HEADER_OFFSET} - ${TOC_CONSTANTS.VERTICAL_MARGIN})`;
  },
  WIDTH_EXPANDED: '12rem',
  WIDTH_COLLAPSED: '3rem',
} as const;
```

### Breakpoint Reference

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

## 🐛 Troubleshooting

### Issue: TableOfContents ikut scroll dengan konten

**Penyebab**: TableOfContents berada di dalam container yang scroll.

**Solusi**: Pastikan TableOfContents berada di luar area scroll dan menggunakan sticky positioning.

### Issue: MobileToc tidak responsif

**Penyebab**: Breakpoint class tidak sesuai.

**Solusi**: 
- Gunakan `sm:hidden` untuk index (hidden di sm+)
- Gunakan `hidden sm:inline lg:hidden` untuk label (visible hanya di sm-md)

### Issue: Max-height tidak bekerja

**Penyebab**: Parent container tidak memiliki height constraint.

**Solusi**: Pastikan parent container memiliki `min-h-0` dan `overflow-hidden`.

## 📚 Related Documentation

- [Interview System Documentation](./INTERVIEW_SYSTEM_DOCUMENTATION.md)
- [Form Editor Types](../components/dashboard/interview/editor/types.ts)
- [Constants](../components/dashboard/interview/editor/constants.ts)

## 🚀 Future Improvements

- [ ] Add keyboard navigation
- [ ] Add drag-and-drop untuk reorder sections/questions
- [ ] Add undo/redo functionality
- [ ] Add form validation preview
- [ ] Add export/import form template
- [ ] Add collaboration features

---

_Dokumentasi ini akan terus diupdate sesuai perkembangan implementasi._

