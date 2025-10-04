# VS Code Extension Profiles for Next.js Development

## Profile: Next.js Development (15-20 Essentials)

### Core Development Extensions
- **ESLint** (ms-vscode.vscode-typescript-next)
- **Prettier - Code formatter** (esbenp.prettier-vscode)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **TypeScript Importer** (ms-vscode.vscode-typescript-next)
- **Auto Rename Tag** (formulahendry.auto-rename-tag)
- **Path Intellisense** (christian-kohler.path-intellisense)

### Productivity & Navigation
- **Error Lens** (usernamehw.errorlens)
- **Bookmarks** (alefragnani.Bookmarks)
- **Toggle Quotes** (BriteSnow.vscode-toggle-quotes)
- **Toggle Case** (wmaurer.vscode-toggle-case)
- **Indent Rainbow** (oderwat.indent-rainbow)
- **Peek** (dtsvet.vscode-wpilib)

### Testing & Quality
- **Jest Runner** (firsttris.vscode-jest-runner)
- **Coverage Gutters** (ryanluker.vscode-coverage-gutters)

### Optional but Recommended
- **Docker** (ms-azuretools.vscode-docker)
- **npm Intellisense** (christian-kohler.npm-intellisense)
- **Live Share** (ms-vsliveshare.vsliveshare)

## Profile: Minimal Build (5 Essentials)
- **ESLint** (ms-vscode.vscode-typescript-next)
- **Prettier - Code formatter** (esbenp.prettier-vscode)
- **Error Lens** (usernamehw.errorlens)
- **GitLens** (eamodio.gitlens)
- **Auto Rename Tag** (formulahendry.auto-rename-tag)

## Profile: Full Development (All Extensions)
- Keep all currently installed extensions for when needed

## Implementation Commands

### Create Profiles via VS Code Command Palette
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Profiles: Create Profile"
3. Name: "Next.js Development"
4. Select only the extensions listed above
5. Repeat for "Minimal Build" profile

### Extension Management Commands
```bash
# List all installed extensions (run in VS Code terminal)
code --list-extensions

# Disable specific extensions (examples)
code --disable-extension extension.id.here

# Enable specific extensions
code --enable-extension extension.id.here
```

## Performance Monitoring Setup

### VS Code Settings for Performance
```json
{
  "telemetry.telemetryLevel": "off",
  "extensions.autoUpdate": false,
  "extensions.autoCheckUpdates": false,
  "files.autoSave": "afterDelay",
  "editor.quickSuggestions": {
    "strings": true
  },
  "typescript.suggest.autoImports": true,
  "npm.enableScriptExplorer": true,
  "git.enableSmartCommit": true,
  "git.autofetch": true
}
```

### Build Time Monitoring Script
```bash
#!/bin/bash
# build-monitor.sh

echo "=== Build Performance Monitor ==="
echo "Starting build at: $(date)"

# Start timer
start_time=$(date +%s.%N)

# Run build command
npm run build

# End timer
end_time=$(date +%s.%N)

# Calculate duration
duration=$(echo "$end_time - $start_time" | bc)

echo "Build completed at: $(date)"
echo "Total build time: ${duration} seconds"

# Log to file
echo "$(date), ${duration}" >> build-times.log

echo "Build time logged to build-times.log"
```

### VS Code Performance Monitoring Extensions
- **VS Code Counter** - Extension count monitoring
- **Performance** - Built-in VS Code performance reporter
