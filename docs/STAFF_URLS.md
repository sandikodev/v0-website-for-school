# 📋 Staff Page URLs - Complete Documentation

Dokumentasi lengkap URL structure untuk halaman Staff SMP IT Masjid Syuhada.

## 🎯 Overview

Halaman `/staff` menggunakan URL query parameters untuk navigasi tab yang SEO-friendly dan bookmarkable. Sekarang mendukung **individual pimpinan selection** dengan URL yang dapat dibagikan.

## 📋 Available URLs

### 1. **Default Tab (Pimpinan Sekolah)**
```
http://localhost:3000/staff                    ← Redirects to pimpinan tab
http://localhost:3000/staff?tab=pimpinan        ← Default pimpinan tab
```

#### Individual Pimpinan Selection:
```
http://localhost:3000/staff?tab=pimpinan&pimpinan=0    ← Kepala Sekolah
http://localhost:3000/staff?tab=pimpinan&pimpinan=1    ← Wakil Kepala Sekolah
```

### 2. **YASMA Tab**
```
http://localhost:3000/staff?tab=yasma
```

### 3. **Wali Kelas Tab**
```
http://localhost:3000/staff?tab=wali
```

### 4. **Staf Pengajar Tab**
```
http://localhost:3000/staff?tab=pengajar
```

## 🔧 Technical Features

### ✅ **Core Features**
- **Bookmarkable**: Setiap tab dapat di-bookmark
- **Shareable**: URL dapat dibagikan langsung ke tab tertentu
- **SEO Friendly**: URL yang bersih dan meaningful
- **Browser History**: Tombol back/forward berfungsi dengan baik
- **No Page Reload**: Navigasi smooth tanpa refresh
- **Validation**: Parameter tab yang invalid fallback ke default

### ✅ **New Features**
- **Auto Redirect**: `/staff` otomatis redirect ke `/staff?tab=pimpinan`
- **Individual Selection**: Setiap pimpinan dapat dipilih dengan URL unik
- **Visual Feedback**: Selected state dengan ring dan shadow
- **Detail View**: Expanded information untuk pimpinan yang dipilih
- **Close Button**: Tombol untuk menutup detail view

## 📁 Files Structure

```
components/staff/
├── staff-tabs-wrapper.tsx     ← Main wrapper dengan URL management
├── staff-stats-cards.tsx      ← Statistics cards
├── pimpinan-tab.tsx          ← Pimpinan tab dengan individual selection
├── yasma-tab.tsx             ← YASMA tab
├── wali-kelas-tab.tsx        ← Wali Kelas tab
└── pengajar-tab.tsx          ← Pengajar tab

middleware.ts                 ← Auto redirect dari /staff
data/staff-data.ts           ← Centralized data
types/staff.ts               ← TypeScript interfaces
```

## 🏗️ Implementation Details

### **URL Parameter Structure**
```
/staff?tab=pimpinan&pimpinan=0

Parameters:
- tab: 'pimpinan' | 'yasma' | 'wali' | 'pengajar'
- pimpinan: '0' | '1' (index dari array pimpinan)
```

### **Middleware Redirect**
```typescript
// middleware.ts
if (pathname === '/staff' && !searchParams.has('tab')) {
  url.searchParams.set('tab', 'pimpinan')
  return NextResponse.redirect(url)
}
```

### **Individual Pimpinan Selection**
```typescript
// pimpinan-tab.tsx
const handlePimpinanClick = (index: number) => {
  const params = new URLSearchParams(searchParams.toString())
  params.set('tab', 'pimpinan')
  params.set('pimpinan', index.toString())
  router.push(`?${params.toString()}`, { scroll: false })
}
```

## 📊 URL Examples

### **Complete URL Examples**
```
Default:        /staff
Pimpinan:       /staff?tab=pimpinan
Kepala Sekolah: /staff?tab=pimpinan&pimpinan=0
Wakasek:        /staff?tab=pimpinan&pimpinan=1
YASMA:          /staff?tab=yasma
Wali Kelas:     /staff?tab=wali
Pengajar:       /staff?tab=pengajar
```

## 🎨 UI/UX Features

### **Visual States**
- **Normal State**: Default card appearance
- **Hover State**: Subtle shadow dan background change
- **Selected State**: Primary ring, enhanced shadow, expanded detail
- **Interactive Elements**: Smooth transitions dan micro-interactions

### **User Experience**
- **Click to Select**: Click card untuk expand detail
- **Click to Close**: Click close button untuk collapse
- **URL Synchronization**: URL update real-time
- **Visual Feedback**: Clear indication of selected state

## 🚀 Benefits

### **For Users**
- **Easy Sharing**: Share specific pimpinan via URL
- **Bookmark Support**: Save favorite pimpinan
- **Smooth Navigation**: No page reloads
- **Clear Visual**: Easy to see selected state

### **For SEO**
- **Crawlable URLs**: Search engines can index individual pages
- **Semantic URLs**: Meaningful parameter names
- **No Hash Fragments**: Clean query parameters

### **For Development**
- **Maintainable**: Clean separation of concerns
- **Type Safe**: Full TypeScript support
- **Reusable**: Component-based architecture
- **Scalable**: Easy to add more tabs atau features

## 🔍 Testing

### **Manual Testing Checklist**
- [ ] `/staff` redirects to `/staff?tab=pimpinan`
- [ ] Tab navigation works without page reload
- [ ] Individual pimpinan selection works
- [ ] URL updates correctly for each selection
- [ ] Browser back/forward buttons work
- [ ] Bookmarks work correctly
- [ ] Invalid parameters handled gracefully
- [ ] Visual feedback is clear dan responsive

---

**Last Updated**: December 2024  
**Status**: ✅ Complete - Production Ready  
**Maintainer**: Development Team