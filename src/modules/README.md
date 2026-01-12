# Lighth Hosting GUI Modules

This folder contains React component skeletons for each major area of your Minecraft hosting dashboard. Each file is ready for your dev/design team to expand with real UI and logic.

## Modules & Prompts

### MainDashboard.jsx ("The Home")
**Purpose:** Instant health check and control.
**Key Elements:** Power buttons, resource widgets, server IP, status color logic.
**Prompt:**
High-fidelity UI/UX design for a Minecraft server hosting dashboard. Dark mode aesthetic with deep slate backgrounds and neon emerald green accents. Sidebar with glassmorphism icons. Main area: four card-based widgets for CPU, RAM, Disk, and Network with smooth radial progress bars. Professional, modern SaaS look, 4k resolution, Figma style. Mobile-first design. "Click to Copy IP" button beside server address.

### LiveConsole.jsx ("The Command Center")
**Purpose:** Real-time server interaction and log monitoring.
**Key Elements:** Log feed, command input, Kill/Clear buttons, monospaced text.
**Prompt:**
A terminal-inspired GUI for a Minecraft console. Dark charcoal background with bright green and white monospaced text. Layout includes a 'Kill' button in bright red and a 'Clear' button in gray. Bottom: prominent input bar with 'Send Command' icon. Real-time data feed visual, futuristic gaming aesthetic. Mobile-first design.

### FileManager.jsx ("The Hard Drive")
**Purpose:** Manage world, plugins, and config files.
**Key Elements:** Folder tree, file list, toolbar, edit/upload features.
**Prompt:**
A clean, functional web-based File Manager interface for a game server. Left sidebar: directory tree. Right panel: file list with 'Size' and 'Date Modified' columns. Icons for .jar, .yml, .json files. Top toolbar: 'Upload', 'New Folder', 'Mass Delete'. Minimalist, highly readable, mobile-first design.

### StartupSettings.jsx ("The Engine Room")
**Purpose:** Configure server boot options.
**Key Elements:** Java version picker, memory slider, EULA toggle.
**Prompt:**
Modern settings panel for server startup. Dark mode, glassmorphism cards. Java version dropdown, memory slider, EULA toggle switch. Save/Reset buttons. Mobile-first design.

### Schedules.jsx ("The Alarm Clock")
**Purpose:** Automate tasks (restarts, backups).
**Key Elements:** Cron job list, add/edit/delete, task type selector.
**Prompt:**
Scheduling dashboard with list of cron jobs. Add/Edit/Delete buttons. Task type selector. Clean, modern, mobile-first design.

### Databases.jsx ("The Vault")
**Purpose:** Manage plugin data storage.
**Key Elements:** MySQL host, database name, password generator, test button.
**Prompt:**
Database management panel. Inputs for MySQL host, database name, password generator. 'Test Connection' button. Modern, secure look, mobile-first design.

### SubUsers.jsx ("The Team Manager")
**Purpose:** Delegate access to friends/team.
**Key Elements:** User list, permission checkboxes, add/remove user.
**Prompt:**
Sub-user management panel. User list with permission checkboxes. Add/Remove user buttons. Clean, collaborative, mobile-first design.

### Billing.jsx ("The Business")
**Purpose:** Manage subscription and support.
**Key Elements:** Current plan, next invoice, renew, invoice table, support link.
**Prompt:**
User-account dashboard for Minecraft hosting. Shows current plan, next invoice, 'Renew Now' button. Modern table for past invoices. Right: 'Support Ticket' quick-link. Simple, trustworthy, clean interface. Mobile-first design.

---

## Pro-Tips
- **Color Logic:** Green = Online/Success, Orange = Starting/Warning, Red = Offline/Error
- **Mobile Responsiveness:** All modules are mobile-first.
- **One-Click Actions:** Always include a "Click to Copy IP" button next to server address.

Expand each component as needed for your production UI!
