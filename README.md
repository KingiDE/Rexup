
![Rexup README Banner](https://github.com/user-attachments/assets/a6eb8af0-28e4-410f-9fc0-f5436b6efc04)

Rexup is an tool to automate the creation of backups. Every backup consists of paths to existing files and directories which are then copied into the created backup-directory. 
This newly created directory can then easily stored on an flash-drive or upload to some cloud-storage.

## 💻 Run locally

**Run locally:** <br/>
To run this project yourself, simply clone the repository, install all the required npm-packages (e.g. with `bun install`), start the dev-server (e.g. with `bun run tauri dev`) and wait for the Rust-Code to build. 
After that, everything should work just perfectly fine.

**Build from source:** <br/>
To build this project from source, follow the exact same steps as before and execute the command `bun tauri build` (or your preferred package-manager). The Tauri-CLI then will guide you to the location of the built files.   

**Extensions:** <br/>
It might be useful to install extensions for the tools that are used in this project. Here's a short list:
- Tauri
- Astro
- Svelte for VSCode
- Biome (Linter and Code-Formatter)
- TailwindCSS Intellisense

Also, to correctly format on save, you can modify your Code editor's settings to use Biome as the default formatter for `.ts`, `.js`-files and "Svelte for VSCode for `.svelte` files. 

**Scripts:** <br/>
There are three important scripts in the `package.json` file: `tsc-check` checks for any TypeScript errors, `format` lints the code, formats it (even without the extension installed) and points out possible errors. Additionally, you can run `svelte-check` to get notified about any Svelte errors.

## 📜 Installation

> Note: Currently only Windows and Linux are supported operating systems. Although this will likely change in the future, you can already adjust the code to your likings and build it to work on other devices. 

**On Windows:**
Simply download either the `rexup_2.0.0_x64_en-US.msi` or the `rexup_2.0.0_x64-setup.exe` file and follow the installation process after clicking it. <br/>
On the other hand, you can download the `rexup_2.0.0.exe` which is a standalone executable that runs the same program without creating its own entry inside your Windows-Startup-Menu.

## ⛏️ Workflow

First, you want to create a backup. After that, you need to add all directories and files you want to backup. Finally you're ready to configure the backup to your likings like adding filters and then you can execute it. 

## 🗺️ Roadmap

- [x] Move from React to Svelte as the frontend library
- [x] Add Linux support
- [ ] Use TOML instead of JSON to store data
- [ ] Add remote sources like a git repository and run commands in it (like `bun install`) to backup GitHub-Repos
- [ ] Extend the functionality of filters
- [ ] (Add MacOS support)

## ❓ Help

If you are at some point unsure how to proceed you can create an issue inside this repository stating as much information as you have acess to. If you want to, you can also request an improvement to the documentation.  

**Try to include...**
1. ... an exact set of instructions on how to reproduce your problem/bug.
2. ... screenshots/screen captures in cases where the your problem might be hard to understand for others. 
