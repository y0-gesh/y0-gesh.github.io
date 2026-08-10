---
title: "Connecting a Custom Domain to GitHub Pages: A Practical DNS Guide"
description: "A practical guide to connecting a custom domain to a website hosted on GitHub Pages, including DNS records, CNAME configuration, domain verification, HTTPS, and common mistakes."
date: "2026-08-10"
coverImage: "/images/blog-5.png"
tags:
  - GitHub Pages
  - DNS
  - Domain
  - GoDaddy
  - Deployment
  - Web Development
  - HTTPS

featured: false
readTime: "10 min read"
category: "Web Development"
---

## Introduction

GitHub Pages is a convenient way to host static websites directly from a GitHub repository. It is particularly useful for portfolios, documentation sites, project pages, and other frontend applications that do not require a traditional server.

However, the default GitHub Pages URL is not always ideal for a professional website. A custom domain provides a cleaner public identity while allowing the underlying website to remain hosted on GitHub Pages.

This guide explains how to connect a custom domain to an existing GitHub Pages website using DNS records. The examples intentionally use placeholder domains and usernames so that private account information is not exposed.

> **Security note:** Never publish registrar login details, verification links, account identifiers, API tokens, passwords, private repository information, or personal contact information in a public blog post. The DNS values required by GitHub Pages are public and are safe to document.

---

## 1. Understand the Architecture

A custom domain does not replace GitHub Pages. Instead, DNS tells browsers where the domain should resolve.

The overall setup looks like this:

```text
User
  │
  ▼
Custom Domain
example.com
  │
  │ DNS lookup
  ▼
GitHub Pages
USERNAME.github.io
  │
  ▼
GitHub Repository
  │
  ▼
Static Website
```

The domain registrar manages the domain and DNS records, while GitHub Pages continues to serve the website.

For a typical setup:

- The **apex/root domain** is `example.com`.
- The **www subdomain** is `www.example.com`.
- The apex domain uses GitHub Pages `A` records.
- The `www` subdomain uses a `CNAME` record pointing to the GitHub Pages hostname.

---

## 2. Before Changing DNS

Before modifying DNS records, identify these three pieces of information:

```text
Custom domain:
example.com

GitHub Pages domain:
USERNAME.github.io

DNS provider:
Your domain registrar or DNS hosting provider
```

The GitHub Pages hostname should be the default hostname associated with the GitHub Pages site.

Do not use a repository URL such as:

```text
USERNAME.github.io/repository-name
```

for the `CNAME` value.

The CNAME should point to the GitHub Pages hostname itself.

---

## 3. Configure the Custom Domain in GitHub

Open the GitHub repository that contains the website.

Navigate to:

```text
Repository
    → Settings
        → Pages
            → Custom domain
```

Enter the custom domain:

```text
example.com
```

and save it.

GitHub Pages can use both an apex domain and a `www` subdomain. Configuring both is useful because visitors may enter either version.

GitHub may create or update a `CNAME` file in the repository depending on the deployment configuration.

If the website is deployed through GitHub Actions, the custom-domain configuration can also be managed through the deployment workflow.

---

## 4. Configure the Apex Domain with A Records

For an apex domain such as:

```text
example.com
```

GitHub Pages provides four IPv4 addresses.

For more information, see **[Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)**.

Create these `A` records:

| Type | Name | Value |
| :--- | :--- | :--- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

The `@` symbol represents the root/apex domain.

For example:

```text
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

GitHub's current documentation also lists IPv6 `AAAA` records. They can be configured when IPv6 support is required, but the four IPv4 `A` records are the straightforward configuration for a standard GitHub Pages setup.

### Important

If your DNS provider has automatically created an `A` record such as:

```text
A    @    Parked
```

or another hosting/parking IP, it should not remain alongside the GitHub Pages configuration for the apex domain.

Extra conflicting `A` or `AAAA` records can cause incorrect routing and may interfere with HTTPS certificate provisioning.

---

## 5. Configure the `www` Subdomain

The `www` version should point to the GitHub Pages hostname using a CNAME record.

Create or update:

```text
Type:  CNAME
Name:  www
Value: USERNAME.github.io
```

For example:

```text
CNAME    www    USERNAME.github.io
```

Do not point the CNAME to an IP address.

A CNAME maps one hostname to another hostname, whereas an A record maps a hostname to an IPv4 address.

Also avoid creating multiple conflicting CNAME records for the same hostname.

---

## 6. What to Keep and What to Replace

A common DNS zone may contain several records that are unrelated to website hosting.

For example:

```text
A       @       Parked
NS      @       nsXX.domaincontrol.com
NS      @       nsYY.domaincontrol.com
CNAME   www     example.com
CNAME   _domainconnect   ...
SOA     @       ...
TXT     _dmarc  ...
```

For a GitHub Pages website:

### Replace

```text
A       @       Parked
```

with the GitHub Pages `A` records.

Also replace an incorrect `www` CNAME such as:

```text
CNAME   www     example.com
```

with:

```text
CNAME   www     USERNAME.github.io
```

### Usually leave unchanged

Records such as:

```text
NS
SOA
_dmarc
_domainconnect
```

should not be deleted simply because they are unrelated to GitHub Pages.

In particular, default nameserver records are managed by the DNS provider when the domain uses that provider's nameservers.

> **Rule:** Do not delete DNS records unless you understand what service uses them.

This is especially important for `MX`, `TXT`, `CAA`, and other records that may control email, domain verification, or certificate issuance.

---

## 7. Domain Verification Can Block DNS Changes

**Newly registered domains** may require registrant contact or WHOIS verification.

A registrar may display a warning such as:

> Your domain is pending verification.
> Some domain actions are unavailable until your domain verification is complete.

If DNS editing is disabled, do not assume that the DNS configuration is broken.

First complete the domain verification process provided by the registrar.

Typical steps are:

```text
Domain registration
       │
       ▼
Verification email
       │
       ▼
Verify registrant information
       │
       ▼
Domain becomes verified
       │
       ▼
DNS management becomes available
```

The exact verification process depends on the registrar and the domain's registration status.

Do not publish the verification email, verification URL, or personal registrant information in a public article.

---

## 8. DNS Propagation

DNS changes are not necessarily visible everywhere immediately.

After changing the records, some DNS resolvers may continue returning the previous values until their cached records expire.

A typical workflow is:

```text
DNS record changed
       │
       ▼
Authoritative DNS updated
       │
       ▼
Resolvers refresh their cached data
       │
       ▼
Visitors begin receiving the new destination
```

Depending on the DNS provider, TTL, and resolver cache, changes can take from minutes to considerably longer to become visible globally.

Do not repeatedly change the records simply because the website does not update immediately.

---

## 9. Verify DNS from the Command Line

The `dig` utility can be used to inspect DNS records.

For the apex domain:

```bash
dig example.com +noall +answer -t A
```

The response should contain the four GitHub Pages addresses:

```text
example.com.    3600    IN    A    185.199.108.153
example.com.    3600    IN    A    185.199.109.153
example.com.    3600    IN    A    185.199.110.153
example.com.    3600    IN    A    185.199.111.153
```

To check the `www` record:

```bash
dig www.example.com +noall +answer -t CNAME
```

The result should point to:

```text
USERNAME.github.io
```

These commands are useful because they allow you to inspect the DNS response independently of the registrar's dashboard.

---

## 10. Enable HTTPS

After GitHub detects the custom-domain configuration, GitHub Pages can provision an HTTPS certificate.

In:

```text
Repository
    → Settings
        → Pages
```

look for the HTTPS option.

Once the certificate is available, enable:

```text
Enforce HTTPS
```

Your final website should be accessible through:

```text
https://example.com
```

and, if configured:

```text
https://www.example.com
```

HTTPS is not just a visual improvement. It protects traffic between the visitor and the website and is expected for modern production websites.

---

## 11. Common Mistakes

### Mistake 1: Keeping the parking A record

Incorrect:

```text
A    @    Parked
A    @    185.199.108.153
```

The parking record should be removed or replaced when the domain is being served through GitHub Pages.

---

### Mistake 2: Pointing `www` to the apex domain

Incorrect:

```text
CNAME    www    example.com
```

For GitHub Pages, use:

```text
CNAME    www    USERNAME.github.io
```

---

### Mistake 3: Adding a CNAME to the apex domain

Do not attempt:

```text
CNAME    @    USERNAME.github.io
```

when using the standard GitHub Pages A-record configuration.

Use:

```text
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

and use the CNAME for `www`.

---

### Mistake 4: Changing nameservers unnecessarily

You generally do not need to change the domain's nameservers just to connect it to GitHub Pages.

If your registrar already manages the DNS zone, configure the required records there.

Changing nameservers unnecessarily can replace the entire DNS management system and may break unrelated services such as email.

---

### Mistake 5: Deleting unrelated DNS records

Do not delete records simply because they are not part of GitHub Pages.

For example:

```text
MX
TXT
CAA
_dmarc
```

may serve other purposes.

Review each record before changing it.

---

### Mistake 6: Publishing sensitive configuration

A public tutorial should never contain:

```text
Registrar username
Registrar password
2FA codes
Verification links
API tokens
Private repository URLs
Personal email addresses
Account IDs
Private IP addresses
```

Use placeholders instead:

```text
example.com
USERNAME.github.io
your-email@example.com
```

Public GitHub Pages IP addresses are different: they are published by GitHub and are not secret.

---

## 12. Recommended Final Configuration

For a standard GitHub Pages deployment, the DNS configuration should conceptually look like this:

```text
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153

CNAME   www     USERNAME.github.io
```

Other DNS records required by unrelated services should remain in place.

The architecture is therefore:

```text
                    ┌──────────────────────┐
                    │      Visitor         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Custom Domain      │
                    │     example.com      │
                    └──────────┬───────────┘
                               │
                       DNS resolution
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
        Apex A Records                  www CNAME
                │                             │
                └──────────────┬──────────────┘
                               ▼
                    ┌──────────────────────┐
                    │     GitHub Pages     │
                    └──────────┬───────────┘
                               ▼
                    ┌──────────────────────┐
                    │    GitHub Repository  │
                    └──────────────────────┘
```

---

## Conclusion

Connecting a custom domain to GitHub Pages is primarily a DNS configuration task. The website itself can remain on GitHub Pages; the domain simply needs to resolve to GitHub's infrastructure.

The essential configuration is:

1. Configure the custom domain in GitHub Pages.
2. Point the apex domain to GitHub Pages using the required `A` records.
3. Point `www` to the GitHub Pages hostname using a `CNAME`.
4. Remove conflicting parking or hosting records.
5. Keep unrelated DNS records intact.
6. Complete domain verification if the registrar requires it.
7. Wait for DNS propagation.
8. Verify the DNS records.
9. Enable HTTPS once GitHub has provisioned the certificate.

The important lesson is that DNS changes should be made deliberately. A working website is not just about pointing the domain to the correct server; it also requires preserving the DNS records responsible for other services and avoiding conflicting records that can interfere with routing or HTTPS.

---

## References

- [GitHub Pages: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages: Securing your site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [GoDaddy: Manage DNS records](https://www.godaddy.com/en-in/help/manage-dns-records-680)
- [GoDaddy: Add or edit an A record](https://www.godaddy.com/en-in/help/add-or-edit-an-a-record-42545)
