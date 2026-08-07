---
title: Add "Open in Antigravity IDE" to Finder on macOS
description: Learn how to add an "Open in Antigravity IDE" option to the Finder context menu using Automator.
date: "2026-08-01"
tags:
  - macOS
  - Finder
  - Automator
  - Antigravity IDE
coverImage: "/images/blog-3.png"
featured: true
readTime: "4 min read"
category: "Automation"
---

If you frequently work with **Antigravity IDE**, opening projects directly from Finder can save time. This guide shows how to create a Finder Quick Action that adds an **Open in Antigravity IDE** option to the right-click context menu.

## Prerequisites

- macOS
- Antigravity IDE installed in the `Applications` folder

---

## Step 1: Verify the Application Name

Before creating the Quick Action, ensure macOS recognizes the application name.

Open **Terminal** and run:

```bash
ls /Applications
```

You should see something similar to:

```text
Antigravity IDE.app
```

or

```text
Antigravity.app
```

Next, verify that the application can be opened using the `open` command.

```bash
open -a "Antigravity IDE"
```

If the IDE launches successfully, continue to the next step.

---

## Step 2: Open Automator

1. Press **⌘ + Space** to open Spotlight.
2. Search for **Automator**.
3. Launch the Automator application.

---

## Step 3: Create a Quick Action

1. Click **New Document**.
2. Select **Quick Action**.
3. Click **Choose**.

---

## Step 4: Configure the Workflow

At the top of the workflow, configure the following settings:

| Setting | Value |
|---------|-------|
| Workflow receives current | **Files or Folders** |
| In | **Finder** |

No other changes are required.

---

## Step 5: Add the "Run Shell Script" Action

1. In the search bar on the left, search for:

```
Run Shell Script
```

2. Drag the action into the workflow.

---

## Step 6: Configure the Shell Script

Update the action with the following settings:

| Setting | Value |
|---------|-------|
| Shell | `/bin/zsh` |
| Pass Input | **As Arguments** |

Passing the input as arguments allows Finder to send the selected files or folders to the script.

---

## Step 7: Add the Shell Script

Replace the default script with the following:

```zsh
#!/bin/zsh

for file in "$@"; do
    open -a "Antigravity IDE" "$file"
done
```

### How the Script Works

- `"$@"` contains every selected file or folder.
- The loop processes each selected item.
- `open -a` launches the specified application.
- The selected file or folder is opened in Antigravity IDE.

This script supports:

- Opening a single file
- Opening multiple files
- Opening folders
- Opening multiple folders

---

## Step 8: Save the Quick Action

Press:

```
⌘ + S
```

Save the workflow with the name:

```
Open in Antigravity IDE
```

---

## Step 9: Test the Quick Action

1. Open **Finder**.
2. Right-click any file or folder.
3. Select:

```
Quick Actions
    Open in Antigravity IDE
```

Depending on your macOS version, it may instead appear under:

```
Services
    Open in Antigravity IDE
```

Click the option, and the selected file or folder should open in Antigravity IDE.

---

## Enable the Quick Action (Optional)

If the Quick Action does not appear:

1. Open **System Settings**.
2. Navigate to:

```
Privacy & Security
→ Extensions
→ Finder
```

3. Enable:

```
Open in Antigravity IDE
```

---

## Assign a Keyboard Shortcut (Optional)

You can also launch the Quick Action using a keyboard shortcut.

Navigate to:

```
System Settings
→ Keyboard
→ Keyboard Shortcuts
→ Services
```

Locate:

```
Open in Antigravity IDE
```

Assign your preferred shortcut, for example:

```
⌃⌥A
```

---

## Result

You can now open any file or folder directly in **Antigravity IDE** by right-clicking it in Finder and selecting **Open in Antigravity IDE**, making it easier to launch projects without opening the IDE first.