---
title: "CI/CD & Infrastructure Automation"
description: "Automated GitHub Actions workflows, Terraform AWS infrastructure provisioning (ECS, VPC, API Gateway, WAF, DynamoDB), and OIDC authentication."
date: "2025-11-20"
tags: ["DevOps", "GitHub Actions", "AWS", "Terraform", "OIDC", "Docker"]
coverImage: "/images/projects/cicd.jpg"
featured: true
githubUrl: "https://github.com/y0-gesh/devops-cicd-journey"
liveUrl: ""
---

## Overview & Objective

At **eigenstudio**, studied, extended, and authored cloud infrastructure automation and CI/CD pipelines. The goal was eliminating static cloud credentials, automating deployment workflows, and provisioning AWS resources using Infrastructure as Code (IaC).

---

## 🎯 The Problem

- **Security Risks of Static Credentials**: Storing long-lived AWS IAM secret keys inside CI/CD repositories created major security risks.
- **Manual Cloud Setup**: Provisioning VPCs, container services, and security rules manually caused configuration drift and slow release cycles.
- **Unvalidated Builds**: Lack of automated test and container build pipelines led to deployment-time errors.

---

## 🛠️ Key Contributions & Infrastructure Setup

- **OIDC GitHub-to-AWS Auth**: Configured OpenID Connect (OIDC) identity provider federation between GitHub Actions and AWS IAM, eliminating static access keys.
- **Terraform Infrastructure as Code**: Authored modular HCL configurations for provisioning AWS VPCs, ECS Fargate clusters, API Gateway, WAF, and DynamoDB tables.
- **Automated CI/CD Workflows**: Created end-to-end GitHub Actions pipelines including automated linting, test suites, multi-stage Docker image builds, and AWS deployments.
- **Security & WAF Layering**: Provisioned AWS WAF rules in front of API Gateway to protect against common web exploits.

---

## 📐 Architecture Diagram

```
+-------------------------------------------------------------------+
|                        GitHub Repository                          |
|    Commit / PR Trigger -> GitHub Actions Runner Pipelines          |
+---------------------------------+---------------------------------+
                                  |
                      OIDC Token Request (No Key)
                                  v
+---------------------------------+---------------------------------+
|                        AWS STS & IAM Role                         |
|             Exchanges Token for Short-Lived Session               |
+---------------------------------+---------------------------------+
                                  |
                         Terraform Execution
                                  v
+---------------------------------+---------------------------------+
|                      AWS Cloud Infrastructure                     |
|  [ VPC ] -> [ WAF & API Gateway ] -> [ ECS Fargate ] -> [DynamoDB]|
+-------------------------------------------------------------------+
```

---

## 📈 Outcome & Key Metrics

- **Zero Static Credentials**: 100% elimination of hardcoded AWS IAM secret keys in CI/CD environment variables.
- **Automated Deployments**: Reduced deployment cycle time from hours to single-click automated pipeline triggers.
- **IaC Reproducibility**: Complete cloud architecture codified into version-controlled Terraform modules.
