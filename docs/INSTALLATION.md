# Installation & Local Usage

This guide explains how to install, run, and build the AG CYBER LAB Beginner modules locally.

## 1. Install Node.js

Install a supported Node.js LTS release from [https://nodejs.org/](https://nodejs.org/).

After installation, restart your terminal and verify:

```bash
node --version
npm --version
```

## 2. Choose a Module

Navigate to the `modules/` directory and select the module you want to study.

Each module is an independent application with its own `package.json` and lockfile.

**Important:** Run all commands from inside the selected module directory, not from the repository root.

## 3. Install Dependencies

Open a terminal inside the selected module directory and run:

```bash
npm install
```

Wait for the installation to complete.

## 4. Start the Development Server

Run:

```bash
npm run dev
```

The terminal will display the local address where the application is available.

Open that address in your browser. It is commonly `http://localhost:3000` for Next.js or `http://localhost:5173` for Vite, but the actual address may differ.

Keep the terminal open while using the application.

To stop the development server, press `Ctrl+C`.

## 5. Production Build (Optional)

To check whether the module can be built for production, run:

```bash
npm run build
```

Next.js modules may also support:

```bash
npm run start
```

This command is generally used after a successful production build. Check the selected module's `package.json` for its available scripts.

## Troubleshooting

- **`node` or `npm` not recognized:** Install Node.js LTS and reopen your terminal.
- **Port already in use:** Stop the other local development server or use another available port.
- **Dependency installation fails:** Check your internet connection and retry `npm install`.
- **Application does not start:** Check the terminal output for errors and consult the selected module's README, if available.
- **Dependency issues:** Do not delete `package-lock.json` without a reason. It helps maintain reproducible dependency versions.

## Security Notes

- Do not share `.env` files, API tokens, passwords, or private keys.
- Only run commands you understand and trust.
- Use the lab exercises only in authorized environments.
- Keep your Node.js installation and dependencies reasonably up to date.