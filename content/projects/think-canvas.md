---
title: "ThinkCanvas Node Editor"
description: "A graph-first node visual editor designed for structured thinking, visual workflows, and extensible system architectures."
date: "2026-05-20"
tags: ["React", "TypeScript", "React Flow", "Zustand"]
coverImage: "/images/projects/think-canvas.jpg"
featured: true
githubUrl: "https://github.com/y0-gesh/think-canvas"
liveUrl: ""
---

## The Concept

Modern diagramming tools are either overly freeform (like Figma Jam) or too rigid. **ThinkCanvas** strikes a perfect balance. It is a graph-first node editor engineered for structured system thinking, visual mind-mapping, and programmatic state routing.

Built with React Flow and Zustand, it provides fluid 60fps graph manipulations and node-to-node data relays.

### Features

* **Node Data Relay**: Dynamic ports allowing nodes to output results that flow down connecting paths to adjacent nodes.
* **Extensible Node Schemes**: Easily add custom Markdown nodes, image cells, or API execution triggers.
* **Zustand Graph State**: Keeps visual layout coordinates and underlying connection lists perfectly in sync, allowing easy export to JSON.
* **Infinite Pan & Zoom**: High performance rendering that handles hundreds of nodes with sub-millisecond redraw latency.
