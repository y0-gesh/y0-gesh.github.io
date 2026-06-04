---
title: "ENM Marketplace"
description: "A hyper-local location-based service marketplace connecting verified local service providers with nearby users."
date: "2025-05-10"
tags: ["React", "Node.js", "Express", "MongoDB", "Geolocation"]
coverImage: "/images/projects/enm.jpg"
featured: true
githubUrl: "https://github.com/y0-gesh/ENM"
liveUrl: ""
---

## The Origin Story

Finding trustworthy, local service providers (plumbers, cleaners, tutors) is often a friction-filled task. Our hero developed **ENM**, a location-based hyper-local service marketplace engineered to match consumers with nearby verified professionals instantly.

The platform guarantees trust using an immutable, verified review ecosystem, preventing review tampering and ensuring authentic user experiences.

### Key Features

* **Hyper-Local Matching**: Tracks geolocation parameters to index and rank nearby service providers within a 5km radius.
* **Frictionless Bookings**: Real-time communication channels and double-sided reservation flows.
* **Verified Reviews**: Review locks that only unlock after a booking completes, keeping the reputation network clean.

```javascript
// Haversine formula to compute distances in-database
const computeDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  // coordinate math ...
};
```
