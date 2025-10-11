# 🎓 School Website Builder

<div align="center">

![School Website Builder](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Build beautiful, modern school websites with ease**

*A comprehensive, open-source solution for educational institutions*

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🌟 Features](#-features) • [🤝 Contributing](#-contributing) • [💬 Community](#-community)

</div>

---

## ⚠️ IMPORTANT: Team Review Required

> 📋 **Layout System Evaluation**  
> We have two layout systems running in parallel (`/admin` and `/dashboard`). A comprehensive evaluation document has been created to help the team make an informed decision about system architecture.
> 
> **Action Required:** Please review [docs/LAYOUT_EVALUATION.md](docs/LAYOUT_EVALUATION.md)  
> **Priority:** High | **Impact:** High | **Decision By:** [Set deadline]
>
> Key findings:
> - Dashboard system scores 88.5% vs Admin 52.5%
> - Potential 5-year savings: Rp 895 juta
> - Performance improvement: <200ms vs 2-4s page loads
> - **Recommendation:** Full migration to `/dashboard` system

---

## 🌟 What is School Website Builder?

**School Website Builder** is a modern, open-source platform designed specifically for educational institutions. Built with Next.js 14 and TypeScript, it provides everything schools need to create professional, SEO-optimized websites with integrated academic management features.

### 🎯 Vision
To democratize school website development and create a strong community around educational technology, ultimately evolving into a comprehensive Academic Management System.

### 🚀 Mission
- **Empower Schools**: Provide free, high-quality website solutions
- **Build Community**: Foster collaboration among developers and educators
- **Innovate Education**: Create tools that enhance educational experiences
- **Scale Globally**: Support schools worldwide with localized solutions

---

## ✨ Features

### 🌐 **Public Website**
- **Modern Design**: Beautiful, responsive design that works on all devices
- **SEO Optimized**: Built-in SEO features for better search engine visibility
- **Fast Performance**: Optimized for Core Web Vitals and speed
- **Accessibility**: WCAG compliant for inclusive access

### 🏫 **School Information Management**
- **Profile Pages**: School history, vision, mission, and achievements
- **Academic Programs**: Curriculum and program information
- **Facilities**: Showcase school infrastructure and resources
- **Staff Directory**: Teacher and staff information

### 📝 **Student Management**
- **Admissions**: Online application and registration system
- **Student Records**: Basic student information management
- **Communication**: Parent-teacher communication tools
- **Announcements**: School news and updates

### 🔧 **Admin Dashboard**
- **Content Management**: Easy-to-use content editing interface
- **User Management**: Role-based access control
- **Analytics**: Website performance and user engagement metrics
- **Settings**: Customizable school branding and configuration

### 📱 **Mobile-First Design**
- **Responsive**: Optimized for mobile, tablet, and desktop
- **PWA Ready**: Progressive Web App capabilities
- **Touch-Friendly**: Intuitive mobile navigation
- **Offline Support**: Basic offline functionality

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **pnpm** (recommended) or npm
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/koneksi-jaringan/school-website-builder.git
cd school-website-builder

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your school website!

### 🎨 Customization

1. **Update School Information**
   ```bash
   # Edit school details
   cp .env.example .env.local
   # Update NEXT_PUBLIC_SCHOOL_NAME, NEXT_PUBLIC_SCHOOL_DESCRIPTION, etc.
   ```

2. **Customize Branding**
   ```bash
   # Replace logo and images
   # Update colors in tailwind.config.js
   # Modify components in /components directory
   ```

3. **Deploy**
   ```bash
   # Build for production
   pnpm build
   
   # Deploy to Vercel (recommended)
   vercel --prod
   ```

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Deployment**: Vercel, Netlify, or custom server
- **Database**: Ready for PostgreSQL, MySQL, or MongoDB

### 🔧 **Modular Architecture** (Recent Refactoring)
Our codebase follows modern best practices with:
- **Shared Custom Hooks**: Reusable logic in `/hooks` directory
  - `useTabParam`: URL query parameter management
  - `useScrollTop`: Scroll-to-top functionality
- **Reusable Components**: Modular UI components in `/components/navigation`
  - `Breadcrumb`: Professional breadcrumb navigation
  - `FloatingActions`: Configurable floating action buttons
- **Type Safety**: Full TypeScript coverage with interfaces
- **Single Source of Truth**: Zero code duplication
- **Easy Testing**: Isolated, testable modules

[📖 Read Modular Architecture Docs →](docs/refactoring/modular-architecture.md)

### Future Technology Roadmap
- **Astro**: Island architecture for optimal performance
- **Qwik**: Resumable applications for instant loading
- **Visual Builder**: Drag-and-drop interface for designers
- **AI Integration**: Smart content generation and optimization

### Project Structure
```
school-website-builder/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Admin dashboard
│   ├── profile/           # School profile
│   ├── academic/          # Academic programs
│   ├── facilities/        # School facilities
│   ├── staff/             # Staff directory
│   ├── contact/           # Contact information
│   ├── admissions/        # Student admissions
│   └── ...
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
├── docs/                  # Comprehensive documentation
└── public/                # Static assets
```

---

## 🏗️ Hybrid Architecture: Best of Both Worlds

### 🎯 **Strategic Approach**
School Website Builder uses a **hybrid architecture** that combines the best of modern web development with proven content management capabilities:

- **Frontend**: Next.js for lightning-fast public website
- **Backend**: WordPress as dedicated CMS for content management
- **Separation**: Complete separation of concerns for optimal performance

### 🚀 **Performance & Speed**
- **Lightning Fast Frontend**: Next.js delivers optimal performance for public visitors
- **Dedicated CMS**: WordPress handles content management without affecting frontend performance
- **Server Load Distribution**: Content management and public browsing use separate resources
- **CDN Ready**: Built-in optimization for global content delivery

### 👥 **Role-Based Workflow**
- **Content Managers**: Use familiar WordPress interface for content creation
- **School Administrators**: Focus on school management without technical complexity
- **Media Team**: Efficient content workflow with WordPress's proven CMS
- **Developers**: Modern frontend development with Next.js

### 🔒 **Security & Reliability**
- **Isolated CMS**: WordPress CMS runs separately from public website
- **Reduced Attack Surface**: Public website has minimal attack vectors
- **Content Security**: CMS access restricted to authorized personnel only
- **Regular Updates**: Both systems receive regular security updates

### 💰 **Cost-Effective Solution**
- **No Frontend Plugin Costs**: Public website doesn't need expensive WordPress plugins
- **Familiar CMS**: Use existing WordPress knowledge and plugins for content management
- **Optimized Hosting**: Frontend can use static hosting, CMS uses standard WordPress hosting
- **Transparent Pricing**: Clear separation of costs between frontend and CMS

### 🎨 **Designer-Developer Collaboration**
- **Modern Frontend**: Developers work with cutting-edge Next.js components
- **Familiar CMS**: Designers and content creators use proven WordPress interface
- **API Integration**: Seamless data flow between WordPress CMS and Next.js frontend
- **Version Control**: Frontend code in Git, CMS content managed through WordPress

### 🔧 **Developer Experience**
- **Modern Stack**: Latest technologies for frontend development
- **Type Safety**: Full TypeScript support for reliable development
- **API-First**: Clean API integration between WordPress and Next.js
- **Comprehensive Docs**: Detailed documentation for both systems

### 🌟 **Future-Proof Technology**
- **Island Architecture**: Astro integration for optimal frontend performance
- **Resumable Applications**: Qwik framework for instant loading
- **Headless CMS**: WordPress as headless CMS with modern frontend
- **AI Integration**: Smart content generation and optimization

### 📈 **Scalability & Growth**
- **Independent Scaling**: Frontend and CMS can scale independently
- **Multi-School Support**: Scale from single school to district-wide
- **API-First**: Easy integration with existing school systems
- **Cloud Native**: Both systems built for modern cloud infrastructure

---

## 🌍 Roadmap

### 🎯 Phase 1: Foundation (Current - ✅ Complete!)
- [x] **Core Website**: Public-facing school website
- [x] **Admin Dashboard**: Basic content management with independent pages
- [x] **SEO Optimization**: Sitemap, robots.txt, professional URLs
- [x] **Documentation**: 2,500+ lines of comprehensive guides
- [x] **URL Query Parameters**: Bookmarkable tabs across all pages
- [x] **Navigation Enhancements**: Breadcrumbs and floating action buttons
- [x] **Modular Architecture**: Shared hooks and reusable components
- [x] **Code Refactoring**: Zero duplication, full TypeScript coverage

### 🚀 Phase 2: Community Building (Q2 2025)
- [ ] **Plugin System**: Extensible architecture
- [ ] **Theme Marketplace**: Community-created themes
- [ ] **Template Library**: Pre-built school templates
- [ ] **Community Forum**: Developer and user community
- [ ] **WordPress CMS Integration**: Headless WordPress setup

### 🎓 Phase 3: Academic Management (Q3 2025)
- [ ] **Student Information System**: Complete SIS
- [ ] **Grade Management**: Academic records
- [ ] **Attendance Tracking**: Student attendance
- [ ] **Parent Portal**: Parent-student communication
- [ ] **WordPress Content Sync**: Real-time content synchronization

### 💼 Phase 4: Enterprise Features (Q4 2025)
- [ ] **Multi-School Support**: District management
- [ ] **Advanced Analytics**: Educational insights
- [ ] **Integration APIs**: Third-party integrations
- [ ] **Subscription Model**: Premium features
- [ ] **WordPress Multi-Site**: Multi-school CMS management

### 🌟 Phase 5: Next-Gen Technology (2026)
- [ ] **Astro Integration**: Island architecture for optimal performance
- [ ] **Qwik Framework**: Resumable applications for instant loading
- [ ] **Visual Builder**: Drag-and-drop interface for non-technical users
- [ ] **AI-Powered Content**: Smart content generation and optimization
- [ ] **WordPress Headless**: Complete headless WordPress integration

---

## 🤝 Contributing

We welcome contributions from developers, educators, and school administrators!

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/school-website-builder.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow our [Code Style Guide](docs/development/code-style.md)
   - Add tests for new features
   - Update documentation

4. **Submit a Pull Request**
   - Fill out the PR template
   - Add reviewers
   - Link related issues

### Contribution Areas

- **🐛 Bug Fixes**: Help us improve stability
- **✨ New Features**: Add functionality schools need
- **📚 Documentation**: Improve guides and tutorials
- **🎨 UI/UX**: Enhance user experience
- **🧪 Testing**: Improve test coverage
- **🌍 Localization**: Add support for different languages

### Development Guidelines

- **Code Quality**: TypeScript, ESLint, Prettier
- **Testing**: Jest, React Testing Library
- **Documentation**: Comprehensive docs for all features
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals optimization

---

## 💬 Community

### Join Our Community

- **💬 Discord**: [Join our Discord server](https://discord.gg/school-website-builder)
- **🐦 Twitter**: [Follow us on Twitter](https://twitter.com/schoolwebsite)
- **📧 Email**: community@schoolwebsitebuilder.com
- **📖 Documentation**: [Read our docs](docs/README.md)

### Community Guidelines

- **Be Respectful**: Treat everyone with kindness
- **Be Helpful**: Share knowledge and help others
- **Be Constructive**: Provide helpful feedback
- **Be Inclusive**: Welcome people from all backgrounds

---

## 🏢 About PT Koneksi Jaringan Indonesia

**PT Koneksi Jaringan Indonesia** is a technology company focused on educational solutions. This open-source project represents our commitment to:

- **Open Source**: Democratizing educational technology
- **Community**: Building strong developer communities
- **Innovation**: Creating cutting-edge educational tools
- **Accessibility**: Making quality education technology available to all

### Our Vision
To become the leading provider of educational technology solutions in Indonesia and Southeast Asia, empowering schools with modern, efficient, and user-friendly systems.

### Our Mission
- **Empower Educators**: Provide tools that enhance teaching and learning
- **Support Schools**: Help educational institutions thrive in the digital age
- **Build Community**: Foster collaboration and knowledge sharing
- **Drive Innovation**: Continuously improve educational technology

---

## 📊 Project Statistics

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/koneksi-jaringan/school-website-builder?style=social)
![GitHub forks](https://img.shields.io/github/forks/koneksi-jaringan/school-website-builder?style=social)
![GitHub issues](https://img.shields.io/github/issues/koneksi-jaringan/school-website-builder)
![GitHub pull requests](https://img.shields.io/github/issues-pr/koneksi-jaringan/school-website-builder)

</div>

### Current Status
- **⭐ Stars**: Growing community support
- **🍴 Forks**: Active development community
- **🐛 Issues**: Continuous improvement
- **📈 Contributors**: Expanding developer base

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ **Commercial Use**: Use in commercial projects
- ✅ **Modification**: Modify and adapt the code
- ✅ **Distribution**: Share and distribute
- ✅ **Private Use**: Use in private projects
- ❌ **Liability**: No warranty or liability
- ❌ **Warranty**: No warranty provided

---

## 🙏 Acknowledgments

### Core Contributors
- **Development Team**: PT Koneksi Jaringan Indonesia
- **Community Contributors**: Open source developers worldwide
- **Beta Testers**: Schools and educators who provided feedback

### Technologies & Libraries
- **Next.js Team**: Amazing React framework
- **Vercel**: Deployment platform
- **shadcn/ui**: Beautiful component library
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript

### Special Thanks
- **Educational Community**: Teachers, administrators, and students
- **Open Source Community**: Developers and contributors worldwide
- **Beta Schools**: Early adopters and feedback providers

---

## 🚀 Get Started Today!

Ready to build your school's website? Here's how to get started:

### For Schools
1. **Try the Demo**: [View live demo](https://demo.schoolwebsitebuilder.com)
2. **Download**: Clone or download the repository
3. **Customize**: Follow our [customization guide](docs/customization.md)
4. **Deploy**: Use our [deployment guide](docs/deployment/README.md)

### For Developers
1. **Fork the Repository**: Start contributing
2. **Read Documentation**: [Comprehensive docs](docs/README.md)
3. **Join Community**: [Discord server](https://discord.gg/school-website-builder)
4. **Contribute**: [Contribution guide](CONTRIBUTING.md)

### For Organizations
1. **Enterprise Support**: [Contact us](mailto:enterprise@schoolwebsitebuilder.com)
2. **Custom Development**: [Request quote](https://koneksi-jaringan.com/contact)
3. **Training**: [Developer training](https://koneksi-jaringan.com/training)
4. **Consulting**: [Expert consultation](https://koneksi-jaringan.com/consulting)

---

<div align="center">

**Built with ❤️ by [PT Koneksi Jaringan Indonesia](https://koneksi-jaringan.com)**

*Empowering Education Through Technology*

[🌐 Website](https://schoolwebsitebuilder.com) • [📖 Docs](docs/README.md) • [💬 Community](https://discord.gg/school-website-builder) • [🐛 Issues](https://github.com/koneksi-jaringan/school-website-builder/issues)

</div>