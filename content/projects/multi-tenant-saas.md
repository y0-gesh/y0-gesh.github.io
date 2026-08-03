---
title: "Multi-Tenant SaaS Frontend Platform"
description: "Scalable Next.js frontend architecture supporting tenant isolation, AWS Cognito MFA authentication, and incident lifecycle management."
date: "2025-12-01"
tags: ["Next.js", "TypeScript", "Cognito MFA", "Two.js", "Recharts", "SaaS"]
coverImage: "/images/projects/saas.jpg"
featured: true
githubUrl: "https://github.com/y0-gesh"
liveUrl: ""
---

## Overview & Objective

At **eigenstudio**, engineered production-grade frontend architecture for a multi-tenant enterprise SaaS platform. The core goal was delivering strict tenant isolation, seamless MFA authentication, and real-time incident lifecycle management without compromising developer velocity or UI performance.

---

## 🎯 The Problem

- **Tenant Data Isolation**: Operating in a multi-tenant ecosystem required guaranteed UI state partitioning and tenant-scoped routing to prevent cross-tenant data leaks.
- **Complex Authentication**: Implementing multi-factor authentication (MFA) with AWS Cognito while matching strict, custom Figma design system specifications.
- **Heavy Data Visualization**: Displaying complex domain-specific analytics and network diagrams required high-performance canvas and SVG rendering.

---

## 🛠️ Key Contributions & Architecture

- **Reverse-Engineered Backend APIs**: Analyzed source code, schemas, and Postman collections for backend User Services to construct precise TypeScript frontend contracts.
- **Figma-Aligned MFA Auth**: Implemented secure Cognito-backed multi-factor auth flows, session persistence, and role-based route guards.
- **Incident Lifecycle Dashboards**: Designed modular incident listing, creation, filtering, and resolution tracking interfaces.
- **Custom Analytics Engine**: Integrated **Two.js** for 2D diagram rendering and **Recharts** for real-time telemetry dashboards.

---

## 📐 Architecture Diagram

```
+-------------------------------------------------------------------+
|                        Next.js Client Shell                       |
|  [ Tenant Context ] -> [ Guard & MFA Flow ] -> [ Two.js/Recharts] |
+---------------------------------+---------------------------------+
                                  |
                   HTTPS / OIDC REST API & Schemas
                                  v
+---------------------------------+---------------------------------+
|                         AWS API Gateway                           |
+-----------------+---------------------------------+---------------+
                  |                                 |
                  v                                 v
        +-------------------+             +-------------------+
        | AWS Cognito (MFA) |             | Backend User Service|
        +-------------------+             +---------+---------+
                                                    |
                                                    v
                                          +-------------------+
                                          | Tenant DB Engine  |
                                          +-------------------+
```

---

## 📈 Outcome & Key Metrics

- **100% Tenant Isolation**: Zero cross-tenant state leakages across session lifecycles.
- **Sub-200ms Dashboard Redraws**: Optimized component re-renders and canvas bindings for heavy analytical data.
- **Production Delivery**: Shipped Figma-compliant UI components across core incident management pipelines.
