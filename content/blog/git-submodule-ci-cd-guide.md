---
title: "Adding a Git Submodule to a Repository and Using It in CI/CD"
description: "A practical guide to adding a private Git repository as a submodule, configuring GitHub Actions authentication, and including the submodule in automated builds and deployments."
date: "2026-08-11"
coverImage: "/images/blog-6.png"
tags:
  - Git
  - Git Submodule
  - GitHub
  - GitHub Actions
  - CI/CD
  - Deployment
  - Web Development

featured: false
readTime: 8 min read
category: "Development"
---

## Introduction

Git submodules are useful when a project needs to include content or
code maintained in a separate Git repository.

A common example is a website that keeps its blog content in a dedicated
repository while the website source code remains in another repository.

This guide explains how to:

-   Add a Git repository as a submodule.
-   Configure the submodule inside a specific directory.
-   Understand how Git tracks a submodule commit.
-   Configure GitHub Actions to clone a private submodule.
-   Use separate authentication for the parent repository and the
    submodule repository.
-   Include the submodule contents in the CI/CD build.
-   Troubleshoot common authentication and checkout errors.

> **Security note:** Never publish personal access tokens, passwords,
> private keys, repository credentials, or other secrets in a public
> blog post. Use placeholders when documenting private infrastructure.

---

## 1. Understand the Repository Structure

The setup described in this guide contains two repositories.

### Parent Repository

The parent repository contains the main application or website:

``` text
Parent Repository
└── website-project
```

### Submodule Repository

The submodule repository contains content or code that needs to be
included inside the parent project:

``` text
Submodule Repository
└── blogs
```

After adding the submodule, the structure becomes:

``` text
website-project/
├── .github/
│   └── workflows/
├── src/
│   └── contents/
│       └── blogs/          ← Git submodule
├── package.json
└── ...
```

The `blogs/` directory is not an ordinary directory tracked directly by
the parent repository. It is a reference to a specific commit in another
Git repository.

---

## 2. Why Use a Git Submodule?

A submodule allows the parent project and content repository to have
separate Git histories.

For example:

``` text
Parent Repository
        │
        └── src/contents/blogs
                    │
                    ▼
             Submodule Repository
```

This provides a clean separation:

-   The parent repository contains application code.
-   The submodule repository contains independently managed content.
-   The content repository can have its own contributors and release
    history.
-   The parent repository controls exactly which submodule commit is
    used during a build.

This last point is important: a submodule is **commit-pinned**.

If the submodule's `main` branch moves to a new commit, the parent
repository does not automatically start using that commit.

---

## 3. Add the Repository as a Submodule

From the root of the parent repository, run:

```bash
git submodule add <submodule-repository-url> src/contents/blogs
```

For example:

```bash
git submodule add https://github.com/<account>/<content-repository>.git src/contents/blogs
```

The second argument specifies where the submodule should be placed.

After running the command, Git creates:

``` text
.gitmodules
```

and registers:

``` text
src/contents/blogs
```

as a submodule.

---

## 4. Check the `.gitmodules` File

The `.gitmodules` file should contain configuration similar to:

``` ini
[submodule "src/contents/blogs"]
    path = src/contents/blogs
    url = https://github.com/<account>/<submodule-repository>.git
    branch = main
```

The important fields are:

  Field      Purpose
  ---------- --------------------------------------------------------
  `path`     Location of the submodule inside the parent repository
  `url`      Git repository containing the submodule
  `branch`   Branch used when updating the submodule

Do not put authentication tokens inside `.gitmodules`.

The repository URL can remain a normal HTTPS URL.

---

## 5. Verify the Submodule

Run:

``` bash
git submodule status
```

A successful result looks similar to:

``` text
fdbd28b... src/contents/blogs (heads/main)
```

The commit hash represents the exact version of the submodule currently
referenced by the parent repository.

You can also check:

``` bash
git status
```

The submodule should appear as a single Git entry rather than a list of
individual files.

---

## 6. Commit the Submodule Configuration

After adding the submodule:

``` bash
git add .gitmodules src/contents/blogs
```

Then commit:

``` bash
git commit -m "chore: add blogs as submodule"
```

Push the parent repository:

``` bash
git push origin main
```

The parent repository now records the submodule reference.

---

## 7. Understanding Commit Pinning

Suppose the submodule repository has:

``` text
A → B → C
        ↑
       main
```

and the parent repository points to:

``` text
B
```

If a new commit is pushed:

``` text
A → B → C → D
            ↑
           main
```

the parent repository still points to `B`.

The parent repository must explicitly update its submodule reference.

To update it:

``` bash
cd src/contents/blogs
git checkout main
git pull origin main
```

Then return to the parent repository:

``` bash
cd ../../..
```

Check the changed submodule reference:

``` bash
git status
```

Commit the new reference:

``` bash
git add src/contents/blogs
git commit -m "chore: update blogs submodule"
git push origin main
```

This approach makes builds reproducible because the parent repository
explicitly determines which submodule commit is used.

---

## 8. The CI/CD Problem

A local checkout may work because your computer already has credentials
that allow access to the submodule repository.

A GitHub Actions runner is a new environment.

If the submodule repository is private, the runner needs permission to
clone it.

There are two separate repositories involved:

``` text
Parent Repository
        │
        │ GitHub Actions built-in token
        ▼
Submodule Repository
        │
        │ Personal Access Token / secret
        ▼
Private Content
```

The authentication requirements should be treated separately.

### Parent Repository

GitHub Actions can use the built-in:

``` text
GITHUB_TOKEN
```

to access the repository where the workflow is running.

### Private Submodule

A separate GitHub secret can be used to authenticate against the private
submodule repository.

For example:

``` text
SUBMODULE_TOKEN
```

The token should have only the permissions required to read the
submodule repository.

---

## 9. Create a Read-Only Token for the Submodule

For a private submodule, create a fine-grained GitHub personal access
token.

Configure the token with:

``` text
Repository access:
    Only selected repositories
        → Submodule repository

Repository permissions:
    Contents: Read-only
```

Avoid granting unnecessary permissions.

The token should not have write access unless the workflow actually
needs to modify the repository.

---

## 10. Add the Token to GitHub Actions Secrets

In the parent repository, open:

``` text
Repository
    → Settings
        → Secrets and variables
            → Actions
                → New repository secret
```

Create:

``` text
Name:
SUBMODULE_TOKEN
```

Paste the token as the secret value.

Do not put the token directly into:

``` text
.github/workflows/*.yml
```

and do not commit it to the repository.

---

## 11. Checkout the Parent Repository

The parent repository should be checked out normally:

``` yaml
- name: Checkout Repository
  uses: actions/checkout@v4
```

This uses the GitHub Actions authentication available to the workflow.

Do not replace the parent repository's authentication with a token
intended only for the private submodule.

---

## 12. Authenticate and Checkout the Submodule

After checking out the parent repository, configure Git to use the
secret when accessing the submodule repository.

Example:

``` yaml
- name: Checkout Submodule
  env:
    SUBMODULE_TOKEN: ${{ secrets.SUBMODULE_TOKEN }}
  run: |
    git config --global url."https://x-access-token:${SUBMODULE_TOKEN}@github.com/<account>/".insteadOf "https://github.com/<account>/"
    git submodule update --init --recursive
```

The authentication flow is then:

``` text
GitHub Actions
      │
      ├── GITHUB_TOKEN
      │       │
      │       ▼
      │  Parent Repository
      │
      └── SUBMODULE_TOKEN
              │
              ▼
        Private Submodule
```

The token is never stored in `.gitmodules`.

---

## 13. Example GitHub Actions Workflow

A simplified workflow can look like this:

``` yaml
name: Build and Deploy

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Checkout Submodule
        env:
          SUBMODULE_TOKEN: ${{ secrets.SUBMODULE_TOKEN }}
        run: |
          git config --global url."https://x-access-token:${SUBMODULE_TOKEN}@github.com/<account>/".insteadOf "https://github.com/<account>/"
          git submodule update --init --recursive

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install Dependencies
        run: npm ci

      - name: Build Website
        run: npm run build
```

The important part is that the submodule is initialized **before** the
application build runs.

---

## 14. Verify the Submodule During CI

While troubleshooting, add a temporary verification step:

``` yaml
- name: Verify Submodule
  run: |
    git submodule status
    echo "Submodule directory:"
    ls -la src/contents/blogs
```

A successful result should show:

``` text
<commit-sha> src/contents/blogs
```

followed by the files inside the directory.

Once the deployment works correctly, the diagnostic step can be removed.

---

## 15. Test Repository Access Separately

Before debugging the complete deployment pipeline, test whether the
secret can access the private submodule:

``` yaml
name: Test Submodule Access

on:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Test Submodule Repository Access
        env:
          TOKEN: ${{ secrets.SUBMODULE_TOKEN }}
        run: |
          git ls-remote "https://x-access-token:${TOKEN}@github.com/<account>/<submodule-repository>.git"
```

A successful result should contain references similar to:

``` text
<commit-sha>    HEAD
<commit-sha>    refs/heads/main
```

This confirms that the token can read the submodule repository.

However, this test only proves repository access. It does not verify the
complete Git submodule checkout.

---

## 16. Common CI/CD Errors

### Error: Repository not found

``` text
remote: Repository not found.
fatal: repository 'https://github.com/.../' not found
```

First determine which repository failed.

If it is the parent repository:

``` text
Parent Repository
        ↓
Checkout failed
```

the problem is with the parent checkout or repository permissions.

If it is the submodule:

``` text
Parent Repository
        ↓
Checkout successful
        ↓
Submodule checkout failed
```

the problem is usually with the submodule URL, token, or repository
permissions.

---

### Error: Submodule directory is empty

If the build cannot find files under:

``` text
src/contents/blogs
```

*verify that the workflow contains:*

``` bash
git submodule update --init --recursive
```

and that the step runs before the build.

---

### Error: Token works in a test but deployment fails

A token test such as:

``` bash
git ls-remote ...
```

only proves that the token can access the specific repository used in
that test.

Make sure the deployment is using the same secret and that the checkout
operation is using the appropriate authentication for each repository.

---

### Error: `git submodule status` is empty

Check whether the submodule has actually been initialized:

``` bash
git submodule update --init --recursive
```

Then run:

``` bash
git submodule status
```

Also verify that `.gitmodules` exists:

``` bash
cat .gitmodules
```

---

## 17. Deployment Architecture

Once configured correctly, the deployment flow becomes:

``` text
                     Git Push
                         │
                         ▼
                Parent Repository
                         │
                         ▼
                  GitHub Actions
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
       Checkout Parent       Checkout Submodule
         GITHUB_TOKEN          SUBMODULE_TOKEN
              │                     │
              └──────────┬──────────┘
                         ▼
                  Install Dependencies
                         │
                         ▼
                    Build Website
                         │
                         ▼
                   Deployment
```

The application build sees the submodule as a normal directory:

``` text
src/
└── contents/
    └── blogs/
        ├── article-1.md
        ├── article-2.md
        └── ...
```

This means the application does not need special logic to understand Git
submodules. Git handles the repository checkout before the build begins.

---

## 18. Recommended Project Structure

A clean project structure can look like:

``` text
website-project/
├── .github/
│   └── workflows/
│       ├── deploy-alpha.yml
│       └── deploy-main.yml
├── src/
│   ├── contents/
│   │   └── blogs/              ← submodule
│   └── ...
├── public/
├── package.json
├── .gitmodules
└── ...
```

Keep the submodule at a location that matches how the application loads
its content.

For example, if the application imports Markdown files from:

``` text
src/contents/blogs
```

the submodule should be mounted at exactly that path.

---

## Conclusion

Git submodules provide a clean way to keep independently maintained
content or code inside another project.

The important concepts are:

1.  The **parent repository** owns the application.
2.  The **submodule repository** owns the separately maintained content.
3.  `.gitmodules` defines where the submodule is located and where it
    comes from.
4.  The parent repository records a specific submodule commit.
5.  A private submodule requires CI/CD credentials.
6.  Use the built-in GitHub Actions token for the parent repository.
7.  Use a restricted read-only secret for the private submodule.
8.  Initialize the submodule before running the application build.
9.  Do not store credentials inside `.gitmodules` or source code.
10. Update the submodule reference in the parent repository whenever a
    newer submodule commit should be included in a deployment.

The resulting separation is simple:

``` text
Parent Repository
    │
    ├── Application
    ├── CI/CD
    └── Submodule reference
              │
              ▼
       Submodule Repository
              │
              └── Content / Code
```

This approach keeps repositories independently maintainable while still
allowing the submodule's content to become part of the parent
application's build.
