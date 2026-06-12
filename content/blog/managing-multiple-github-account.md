---
title: "Managing Multiple GitHub Accounts on a Single Mac with Automatic Git Identity Switching"
description: "Learn how to manage personal and work GitHub accounts on the same macOS or Linux machine using SSH keys, host aliases, and Git's includeIf configuration for automatic identity switching."
date: "2026-06-11"
tags:
  - Git
  - GitHub
  - SSH
  - macOS
  - Developer Tools
  - Version Control
coverImage: "/images/blog/git_setup.png"
featured: true
readTime: "8 min read"
category: "Development"
---

# Managing Multiple GitHub Accounts on a Single Mac with Automatic Git Identity Switching

## Introduction

As developers, it is common to maintain separate GitHub accounts for personal projects and professional work. While this separation helps keep repositories organized, it often introduces a frustrating problem: accidentally committing with the wrong email address or pushing to the wrong GitHub account.

In my setup, I maintain:

* Personal projects inside `~/Projects`
* Work-related repositories inside `~/work`

Instead of manually switching Git identities every time I change repositories, I configured Git and SSH to automatically select the correct account based on the repository location.

This article documents the complete setup.

---

# The Problem

Without proper configuration, Git uses a single global identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

This creates several issues:

* Personal commits appear under a work email.
* Work commits appear under a personal email.
* GitHub contribution graphs become inaccurate.
* Developers frequently need to modify global Git configuration.
* Multiple GitHub accounts become difficult to manage.

The goal is simple:

| Repository Location | GitHub Account | Email                                                       |
| ------------------- | -------------- | ----------------------------------------------------------- |
| `~/Projects`        | Personal       | [yogeshtandan25@gmail.com](mailto:yogeshtandan25@gmail.com) |
| `~/work`            | Work           | [yogesh.work@gmail.com](mailto:yogesh.mac@gmail.com)    |

---

# Solution Overview

The setup consists of two independent layers:

## Layer 1: SSH Authentication

SSH determines which GitHub account is used when cloning, pushing, or pulling repositories.

## Layer 2: Git Identity

Git determines which author name and email are attached to commits.

Both layers must be configured correctly.

---

# Step 1: Create Separate SSH Keys

Generate an SSH key for each GitHub account.

## Personal Account

```bash
ssh-keygen -t ed25519 -C "yogeshtandan25@gmail.com"
```

Save as:

```text
~/.ssh/id_ed25519_personal
```

## Work Account

```bash
ssh-keygen -t ed25519 -C "yogesh.work@gmail.com"
```

Save as:

```text
~/.ssh/id_ed25519_work
```

---

# Step 2: Add Keys to SSH Agent

Start the SSH agent:

```bash
eval "$(ssh-agent -s)"
```

Add both keys:

```bash
ssh-add ~/.ssh/id_ed25519_personal
ssh-add ~/.ssh/id_ed25519_work
```

Verify:

```bash
ssh-add -l
```

---

# Step 3: Configure SSH Host Aliases

Edit:

```bash
~/.ssh/config
```

Add:

```ssh
# Personal GitHub
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal
    IdentitiesOnly yes

# Work GitHub
Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes
```

This allows GitHub to recognize each account independently.

---

# Step 4: Configure Automatic Git Identity Switching

Git provides a powerful feature called `includeIf`.

This feature loads different configuration files depending on the repository path.

## Global Configuration

Edit:

```bash
~/.gitconfig
```

```ini
[filter "lfs"]
    clean = git-lfs clean -- %f
    smudge = git-lfs smudge -- %f
    process = git-lfs filter-process
    required = true

[includeIf "gitdir:/Users/mac/Projects/"]
    path = ~/.gitconfig-personal

[includeIf "gitdir:/Users/mac/work/"]
    path = ~/.gitconfig-work
```

Notice that there is no global user email.

The identity is determined entirely by repository location.

---

# Step 5: Create Personal Git Configuration

Create:

```bash
~/.gitconfig-personal
```

```ini
[user]
    name = Yogesh Tandan
    email = yogeshtandan25@gmail.com
```

---

# Step 6: Create Work Git Configuration

Create:

```bash
~/.gitconfig-work
```

```ini
[user]
    name = Yogesh Tandan
    email = yogesh.work@gmail.com
```

---

# Step 7: Verify Configuration

Navigate into a personal repository:

```bash
cd ~/Projects/my-project
```

Check:

```bash
git config user.email
```

Expected:

```text
yogeshtandan25@gmail.com
```

Navigate into a work repository:

```bash
cd ~/work/internal-tool
```

Check:

```bash
git config user.email
```

Expected:

```text
yogesh.work@gmail.com
```

---

# Verify the Source of Configuration

To determine exactly which configuration file Git is using:

```bash
git config --show-origin --get user.email
```

Example output:

```text
file:/Users/mac/.gitconfig-work
yogesh.work@gmail.com
```

This command is extremely useful when debugging configuration issues.

---

# Common Pitfall: Local Repository Overrides

Git follows a hierarchy:

```text
Local Repository Config
        ↓
Included Config
        ↓
Global Config
        ↓
System Config
```

If a repository already contains:

```bash
git config --local user.email
```

that value overrides everything else.

Check:

```bash
git config --local --list
```

Remove existing overrides:

```bash
git config --unset user.name
git config --unset user.email
```

---

# Cloning Repositories Correctly

SSH aliases only work if they are used in repository URLs.

## Personal Repository

```bash
git clone git@github-personal:username/project.git
```

## Work Repository

```bash
git clone git@github-work:organization/project.git
```

Avoid:

```bash
git clone git@github.com:user/project.git
```

because this bypasses the SSH alias configuration.

---

# Final Folder Structure

```text
/Users/mac
│
├── Projects
│   ├── portfolio
│   ├── side-project
│   └── experiments
│
└── work
    ├── internal-tools
    ├── client-projects
    └── production-apps
```

With this structure, Git automatically applies the correct identity and SSH key without any manual intervention.

---

# Conclusion

Managing multiple GitHub accounts does not require constantly switching credentials or editing Git configuration files.

By combining:

* Separate SSH keys
* SSH host aliases
* Conditional Git configuration using `includeIf`

it is possible to create a clean and fully automated workflow.

In my setup, repositories under `~/Projects` automatically use my personal GitHub account, while repositories under `~/work` use my work account. Once configured, the process becomes completely transparent, reducing mistakes and keeping commit history accurate across all projects.
