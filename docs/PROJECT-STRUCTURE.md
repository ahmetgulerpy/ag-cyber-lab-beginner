# Project Structure

```text
AG-CYBER-LAB-BEGINNER/
├── assets/
│   └── images/
│       ├── project-logo.png
│       ├── github-banner.png
│       ├── module-overview.png
│       ├── platform-features.png
│       └── learning-workflow.png
├── docs/
│   ├── INSTALLATION.md
│   └── PROJECT-STRUCTURE.md
├── modules/
│   ├── 01-siber-guvenlige-giris/
│   ├── 02-bilgisayar-bilimleri-temelleri/
│   ├── 03-ag-teknolojileri-temelleri/
│   ├── 04-isletim-sistemleri-temelleri/
│   ├── 05-programlama-scripting-temelleri/
│   ├── 06-siber-guvenlik-temel-kavramlari/
│   ├── 07-kriptografi-temelleri/
│   ├── 08-siber-tehditleri-tanima/
│   └── 09-sanallastirma-ve-laboratuvar/
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── PRE-RELEASE-AUDIT.md
├── README.md
├── README.tr.md
└── SECURITY.md
```

## Module Architecture

Each module is an independent application with its own `package.json` and lockfile.

- **Module 02** uses React and Vite.
- **All other modules** use Next.js.

There is intentionally no root-level npm workspace or shared runtime. Dependencies are installed and applications are started separately inside each module directory.

## Design Principles

- Independent module development and execution.
- Local development without requiring a central hosted platform.
- Separate dependency management for each module.
- A modular structure that supports future expansion.