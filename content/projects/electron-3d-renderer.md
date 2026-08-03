---
title: "Electron.js 3D Renderer Optimization"
description: "Optimized 3D rendering pipeline for computational engineering software, delivering a ~60% performance improvement."
date: "2024-11-15"
tags: ["Electron.js", "React", "TypeScript", "WebGL", "Performance"]
coverImage: "/images/projects/electron-3d.jpg"
featured: true
githubUrl: "https://github.com/y0-gesh"
liveUrl: ""
---

## Overview & Objective

During my tenure as Frontend Developer Intern at **Avkalan Labs**, I focused on optimizing complex Electron.js-based 3D rendering software used for computational engineering applications.

---

## 🎯 The Problem

- **Rendering Bottlenecks**: Heavy 3D mesh loads were causing severe UI thread freezing, frame drops, and high memory consumption during interaction.
- **IPC Overhead**: Inefficient cross-process communication between Electron's main process and React renderer process throttled real-time rendering.
- **Complex UI Overlay**: Engineering parameter panels frequently triggered unnecessary full-canvas WebGL redraws.

---

## 🛠️ Key Contributions & Optimization

- **Refactored IPC Bridge**: Serialized 3D mesh data buffers directly over shared memory channels to eliminate IPC serialization bottlenecks.
- **WebGL Frame Loop Decoupling**: Separated the 3D WebGL render loop from the React component tree lifecycle to maintain 60 FPS under heavy interaction.
- **State Management & Caching**: Implemented fine-grained selector-based state subscriptions, preventing unnecessary re-renders of the canvas layer.
- **Memory Leak Elimination**: Identified and disposed unused WebGL textures and buffers upon model switching.

---

## 📐 Architecture Diagram

```
+-------------------------------------------------------------------+
|                        Electron Native Shell                      |
|                                                                   |
|   +---------------------+               +---------------------+   |
|   |  Electron Main      | <--- Shared   |  IPC Buffer Stream  |   |
|   |  Native Engine      |      Memory   |  & Data Deserializer|   |
|   +---------------------+               +----------+----------+   |
|                                                    |              |
|                                                    v              |
|   +-----------------------------------------------------------+   |
|   |                     Renderer Process                      |   |
|   |  +-----------------------+     +-----------------------+  |   |
|   |  | WebGL Canvas (60 FPS) |     |  React UI Control Overlay| |   |
|   |  +-----------------------+     +-----------------------+  |   |
|   +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+
```

---

## ⚡ Outcome & Key Metrics

- **🚀 ~60% Performance Improvement**: Drastically boosted frame rates and cut rendering latency across complex 3D models.
- **Smooth 60 FPS Interaction**: Maintained stable high-framerate interaction during zoom, pan, and structural analysis ops.
- **Reduced Memory Overhead**: Cut memory leaks and overall RAM consumption by over 40%.
