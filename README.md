![Rexup README Banner](https://github.com/user-attachments/assets/a6eb8af0-28e4-410f-9fc0-f5436b6efc04)

**Rexup** is a tool to automate the creation of backups. Each backup copies files and folders into a new "backup" directory. This directory can then be easily stored on a flash drive or uploaded to cloud storage.

## 💻 Run Locally

**Run:**  
Follow these steps to run Rexup on your local machine:

1. Clone the repository  
2. Install all required npm packages (e.g., with bun install)  
3. Start the development server (e.g., with bun run tauri dev)  
4. Wait for the Rust code to build  

After that, everything should work as expected.

**Build from source:**  
To build the project from source, follow the same steps as in **Run**, and then execute bun tauri build (or use your preferred package manager). The Tauri CLI will guide you to the built files.

**Extensions:**  
It might be useful to install some extensions before developing. Here's a short list of those used for this project. I use Visual Studio Code, so note that these may vary between IDEs.

- Tauri  
- Astro  
- Svelte for VSCode  
- Biome (Linter and code formatter)  
- Tailwind CSS IntelliSense  

To format code correctly on save, configure your editor to use Biome as the default formatter for .ts and .js files, and "Svelte for VSCode" for .svelte files.

**Scripts:**
There are three important scripts in the package.json file:

- tsc-check: Checks for any TypeScript errors  
- format: Lints and formats the code (even without the extension installed) and shows possible issues  
- svelte-check: Reports Svelte-related errors  

## 📦 Installation

> Currently, only Windows and Linux are supported. This may change in the future, but you can already build Rexup for other systems.

### 🟦 Windows

Download either rexup_2.0.0_x64_en-US.msi or rexup_2.0.0_x64-setup.exe and follow the installation instructions.  
If you prefer a standalone executable, download rexup_2.0.0.exe, which runs without creating a Start Menu entry.

### 🐧 Linux

Due to the variety of Linux distributions, the best installation method may vary. The following section provides general guidance.

**AppImage:**  
AppImages should work on nearly all distributions. They are not installed – just double-click to run.  
They also do not create a Start Menu entry. Download rexup_2.0.0_amd64.AppImage and run it.  
You may need to make it executable first (chmod +x filename or via file properties).

**Debian:**  
.deb files work on Debian-based distributions (this means also Ubuntu and Linux Mint).  
To install rexup_2.0.0_amd64.deb, right-click the file and open it with "Software Install" if your system doesn’t do so automatically.  
Follow the prompts to complete installation.

**RPM:**  
For RPM-based distributions like Fedora, openSUSE, and CentOS, use rexup_2.0.0_x86_64.rpm.  
Download the file, right-click it, and choose "Software Install" to begin the installation.

## ⚙️ Workflow

1. Create a backup  
2. Add all files and directories you want to include  
3. Configure the backup (e.g., add filters)  
4. Run the backup  

## 🚧 Roadmap

- [x] Migrate from React to Svelte  
- [x] Add Linux support  
- [ ] Use TOML instead of JSON for storing data
- [ ] Allow renaming of backuped directories and files  
- [ ] Add remote sources (e.g., Git repositories) and execute commands in them (bun install) for backing up GitHub repos  
- [ ] Extend filter functionality  
- [ ] Add macOS support (planned)  

## ⁉️ Help

If you're unsure how to proceed or have found a bug, check the FAQ section or browse existing Issues or Discussions. Otherwise, feel free to [open an issue](https://github.com/your-repo/issues) and follow the instructions below.

### 🗨️ Issues and Discussion

If you’ve found a problem (and confirmed there isn’t already an open Issue), you can open a new one. Please include as much relevant information as possible.  
**This includes:**

1. A clear, step-by-step guide on how to reproduce the issue  
2. Screenshots or screen recordings if the issue is difficult to describe  

If there’s a topic you'd like to discuss, you can open a Discussion — after making sure it hasn’t been addressed already.

### ➕️ How to Contribute

To contribute, follow these steps:

1. Fork the repository  
2. Create a new branch based on the dev branch and name it after the feature or fix  
3. Create a pull request  

Before starting, ensure no one else is already working on the same issue.

Thank you to everyone contributing to Rexup!

### ❓ FAQ

This section will contain frequently asked questions to help users with quick guidance. Currently, there are no entries, but they will be added soon.
