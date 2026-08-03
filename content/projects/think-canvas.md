---
title: "Interactive Flow & Visualization System"
description: "Node-based UI system built with React Flow, customized node rendering, animations, grouping, and Attio-inspired motion behavior."
date: "2025-08-10"
tags: ["React", "TypeScript", "React Flow", "Two.js", "Zustand", "Motion"]
coverImage: "/images/projects/think-canvas.jpg"
featured: true
githubUrl: "https://github.com/y0-gesh/think-canvas"
liveUrl: ""
---

## Overview & Objective

Engineered an interactive graph-first node visual editor designed for structured thinking, visual workflows, and extensible system architectures. Inspired by Attio UI motion physics and modular node graphs.

---

## 🎯 The Problem

- **Rigid Diagram Editors**: Traditional flowchart tools lack custom node extensibility and dynamic data propagation between connected nodes.
- **Performance Drops at Scale**: Rendering dozens of custom node components on an interactive canvas often results in stutter during pan and zoom.

---

## 🛠️ Key Contributions & Features

- **React Flow Custom Nodes**: Designed custom node definitions with dynamic input/output ports, inline Markdown editing, and state relays.
- **Attio-Inspired Motion**: Implemented smooth hover states, magnetic node snapping, and fluid animation curves.
- **Zustand Graph State**: Synchronized canvas layout positions, edge connections, and node data payloads in a centralized Zustand store.
- **60 FPS Canvas Performance**: Optimized node rendering with memoization and custom viewport culling.

---

## 📐 Architecture Diagram

```
+-------------------------------------------------------------------+
|                        Interactive Flow UI                        |
|                                                                   |
|   +-----------------------+           +-----------------------+   |
|   |  React Flow Viewport  | <=======> |  Attio Motion & Canvas|   |
|   |  (Custom Nodes/Edges) |           |  Snapping Engine      |   |
|   +-----------+-----------+           +-----------+-----------+   |
|               |                                   |               |
|               v                                   v               |
|   +-----------------------------------------------------------+   |
|   |                 Zustand Graph State Store                 |   |
|   |   Nodes Array | Edges Array | Port Data Relays | Undo/Redo|   |
|   +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+
```

---

## 📈 Outcome & Key Metrics

- **Fluid 60 FPS Performance**: Seamless pan/zoom across hundreds of active nodes and edges.
- **Zero-Latency State Sync**: Sub-millisecond data relay between connected graph ports.
