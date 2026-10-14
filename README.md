# Neon Odyssey 2077 - Immersive Festival Website

A responsive landing page for a fictional cyber-art and music festival. It is built with plain HTML, CSS, and JavaScript, with no animation libraries or framework dependencies.

## 🚀 Project Overview

**Neon Odyssey** is designed to transport the user into a futuristic setting. It features a dark, high-contrast aesthetic with neon accents, cinematic motion, and responsive interactive elements.

### 🌟 Key Features

1.  **Immersive Hero Section:**
    *   Interactive particle network rendered with Canvas 2D.
    *   Animated orbital rings, cinematic background drift, and a live signal meter.
    *   Staggered entrance motion and pointer-responsive lighting.

2.  **Interactive UI Elements:**
    *   **Tabs System:** A functional schedule section that switches content between "Day 1" and "Day 2" without reloading the page.
    *   **Payment Modal:** A simulated checkout experience. Clicking "Initialize" on a ticket opens a popup with form validation and a simulated processing loading state.
    *   **Animated Statistics:** Numbers in the "About" section count up dynamically when they scroll into view.

3.  **Advanced Styling:**
    *   **Neon Aesthetics:** Heavy use of CSS `box-shadow` and `text-shadow` for glowing effects.
    *   **Glassmorphism:** The sticky navigation bar uses `backdrop-filter: blur()` for a frosted glass effect.
    *   **CSS Grid & Flexbox:** Used extensively for the responsive layout of cards, gallery, and schedule items.

4.  **Animations:**
    *   **Scroll Reveal:** Sections fade in and move up as the user scrolls down (using the Intersection Observer API).
    *   **Micro-interactions:** Magnetic buttons, tilt cards, animated counters, image zoom, and staggered card entrances.
    *   **Accessibility:** Respects reduced-motion preferences and provides visible keyboard focus.

## 🛠️ Tech Stack

*   **HTML5:** Semantic structure.
*   **CSS3:** Custom properties (variables), Keyframe animations, Media Queries for responsiveness.
* **JavaScript (ES6+):** DOM manipulation, Intersection Observer, Canvas 2D particles, and event handling.
*   **Assets:**
    *   Fonts: *Space Grotesk* (Headings) and *Inter* (Body) from Google Fonts.
    *   Festival photography: Unsplash.

## 📂 File Structure

```
/WebMarket
│
├── index.html      # Main structure and content
├── style.css       # All visual styling, animations, and responsive rules
├── script.js       # Logic for navigation, modal, and scroll animations
└── README.md       # Project documentation
```

## 🎬 Animation Approach

All interface animations are implemented directly with CSS keyframes/transitions and native JavaScript APIs. The canvas particle field is drawn with Canvas 2D and `requestAnimationFrame`; there are no animation libraries such as GSAP or Framer Motion.

Scroll reveals and count-up statistics use the native Intersection Observer API:

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});
```

## 📱 Responsive Design

The site adapts to mobile devices (max-width: 768px) by:
*   Converting the navigation bar into a slide-out hamburger menu.
*   Stacking grid columns into a single column flow.
*   Adjusting font sizes and padding for readability on smaller screens.

## 🚀 How to Run

1.  Download or clone the repository.
2.  Open `index.html` in any modern web browser.
3.  No build step or server is required.

---
*Created for the WebMarket Project.*

