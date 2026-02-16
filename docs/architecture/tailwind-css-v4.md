# Tailwind CSS v4 Documentation

## Overview
Proyek ini menggunakan Tailwind CSS v4 dengan Next.js 14.2.16. Dokumentasi ini menjelaskan konfigurasi dan penggunaan yang benar.

## Configuration

### Package.json Dependencies
```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.9",
    "tailwindcss": "^4.1.9",
    "postcss": "^8.5"
  }
}
```

### CSS Import Syntax
```css
/* app/globals.css */
@import "tailwindcss";
```

**❌ Jangan gunakan syntax v3:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Custom Variants
```css
@custom-variant dark (&:is(.dark *));
```

### Theme Configuration
```css
@theme inline {
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  /* ... other theme variables */
}
```

## Common Issues & Solutions

### ModuleParseError: Unexpected character '@'
**Cause:** Next.js CSS loader tidak mengenali Tailwind v4 syntax

**Solution:**
1. Pastikan menggunakan `@import "tailwindcss"`
2. Jangan gunakan `@tailwind base/components/utilities`
3. Rebuild containers setelah perubahan CSS

### CSS Classes Not Working
**Cause:** Tailwind CSS tidak ter-compile dengan benar

**Solution:**
```bash
# Rebuild containers
docker compose -f docker-compose.test.yml build --no-cache
docker compose -f docker-compose.test.yml up -d

# Check CSS compilation
docker exec school-website-dev-test cat app/globals.css | head -5
```

### Hydration Errors
**Cause:** CSS classes berbeda antara server dan client

**Solution:**
1. Gunakan `mounted` state di React components
2. Environment indicator menggunakan vanilla JavaScript
3. Restart containers untuk clear cache

## Best Practices

### 1. CSS Structure
```css
@import "tailwindcss";

/* Custom CSS variables */
:root {
  --primary: oklch(0.45 0.15 160);
  --secondary: oklch(0.55 0.15 160);
}

/* Custom variants */
@custom-variant dark (&:is(.dark *));

/* Theme configuration */
@theme inline {
  --color-primary: var(--primary);
}

/* Custom utilities */
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }
}
```

### 2. Component Usage
```tsx
// ✅ Correct - menggunakan mounted state
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <div>Loading...</div>;
}

// ✅ Correct - static className
const getLinkClassName = () => {
  return "px-4 py-2 rounded-lg font-medium transition-all duration-200";
};
```

### 3. Environment Indicator
```tsx
// ✅ Correct - vanilla JavaScript di layout.tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        function addEnvironmentIndicator() {
          const url = window.location.href;
          let environment = 'development';
          let label = 'DEV';
          let className = 'dev';
          
          if (url.includes('/websekolah-staging/')) {
            environment = 'staging';
            label = 'STAGING';
            className = 'staging';
          } else if (url.includes('/websekolah/')) {
            environment = 'production';
            label = 'PROD';
            className = 'production';
          }
          
          const indicator = document.createElement('div');
          indicator.className = 'environment-indicator ' + className;
          indicator.textContent = label;
          document.body.appendChild(indicator);
        }
        
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', addEnvironmentIndicator);
        } else {
          addEnvironmentIndicator();
        }
      })();
    `,
  }}
/>
```

## Troubleshooting Commands

### Check CSS Compilation
```bash
# Check CSS file
docker exec school-website-dev-test cat app/globals.css | head -10

# Check if Tailwind is working
curl -s http://localhost:8080/websekolah-dev/ | grep -o "class=" | head -5
```

### Debug Hydration Issues
```bash
# Check browser console
# Open DevTools > Console
# Look for hydration warnings

# Restart containers
docker compose -f docker-compose.test.yml restart
```

### Verify Environment Indicator
```bash
# Check if indicator appears
curl -s http://localhost:8080/websekolah-dev/ | grep -o "environment-indicator"
curl -s http://localhost:8080/websekolah-staging/ | grep -o "environment-indicator"
curl -s http://localhost:8080/websekolah/ | grep -o "environment-indicator"
```

## Migration Notes

### From Tailwind v3 to v4
1. **CSS Import:** `@tailwind base/components/utilities` → `@import "tailwindcss"`
2. **Custom Variants:** `@variant` → `@custom-variant`
3. **Theme:** `@theme` → `@theme inline`
4. **PostCSS:** Update to v8.5+ for compatibility

### Next.js Compatibility
- Next.js 14.2.16 works with Tailwind v4
- Use `@import "tailwindcss"` syntax
- Avoid `@apply` in complex scenarios
- Use vanilla JavaScript for dynamic content

## Resources
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Next.js CSS Documentation](https://nextjs.org/docs/app/building-your-application/styling)
- [PostCSS Configuration](https://postcss.org/docs/)
