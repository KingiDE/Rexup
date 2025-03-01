
![Rexup README Banner](https://github.com/user-attachments/assets/a6eb8af0-28e4-410f-9fc0-f5436b6efc04)

Rexup is an tool to automate the creation of backups. Every backup consists of paths to existing folders which are then copied into the "Result"-folder. 
This one can easily be zipped and safed on an USB-drive or transferred into the cloud.

## ⚠️ Important info

This project is still in its early stages. This means that although the repository is public and already had its first release, some parts - especially complex features - might have unknown bugs. 
Also, the code-quality may vary. This is fixed very soon and later will be integrated into the main codebase.

## 💻 Run locally

**Run locally:** <br/>
To run this project yourself, simply clone the repository, install all the required npm-packages (e.g. with `bun install`), start the dev-server (e.g. with `bun run tauri dev`) and wait for the Rust-Code to build. 
After that, everything should work just perfectly fine.

**Build from source:** <br/>
To build this project from source, follow the exact same steps as before and execute the command `bun tauri build` (or your preferred package-manager). 
This will compile the entire project, create a `.msi`-installer-file and print its location to the terminal. You just have to double-click it now and follow the installation-process.   

## 📜 Installation

> Note: Currently Windows is the only supported operating system. Although this will likely change in the future, you can already adjust the code to your likings and build it to work on other devices. 

**On Windows:**
Simply download either the `rexup_1.0.0_x64_en-US.msi` or the `rexup_1.0.0_x64-setup.exe` file and follow the installation process after clicking it. 

## ⛏️ Workflow

First, you want to create a backup. After that, you need to add all folders and files you want to backup. Finally you're ready to configure the backup to your likings and and execute it. 
For an easier understanding just watch the video at the top or give the [docs](DOCS.md) a try.

## 🗺️ Roadmap

- [ ] Use TOML instead of JSON to store data
- [ ] Move from React to Svelte
- [ ] Add remote sources like a git repository and run commands in it (like `bun install`) to backup GitHub-Repos
- [ ] Add Linux and MacOS support

## ❓ Help

If you are at some point unsure how to proceed you can create an issue inside this repository stating as much information as you have acess to. If you want to, you can also request an improvement to the documentation.  

**Try to include...**
1. ... an exact set of instructions on how to reproduce your problem/bug.
2. ... screenshots/screen captures in cases where the your problem might be hard to understand for others. 
