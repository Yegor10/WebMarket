# Neon Odyssey 2077 - Cyberpunk Festival Website

A fully responsive, immersive landing page for a fictional cyber-art and music festival. This project demonstrates modern frontend development techniques using pure HTML, CSS, and JavaScript, focusing on aesthetic UI/UX and interactive elements.

## 🚀 Project Overview

**Neon Odyssey** is designed to transport the user into a futuristic setting. It features a dark, high-contrast "cyberpunk" aesthetic with neon glowing accents, glitch effects, and smooth animations. The site is built to be performant and responsive across all device sizes.

### 🌟 Key Features

1.  **Immersive Hero Section:**
    *   Custom "Glitch" text effect using CSS clip-path animations.
    *   Animated background grids and radial gradients.
    *   Scroll indicator animation.

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
    *   **Hover Effects:** Cards lift up and glow brighter when hovered.

## 🛠️ Tech Stack

*   **HTML5:** Semantic structure.
*   **CSS3:** Custom properties (variables), Keyframe animations, Media Queries for responsiveness.
*   **JavaScript (ES6+):** DOM manipulation, Intersection Observer, Event handling (no external frameworks used).
*   **Assets:**
    *   Fonts: *Orbitron* (Headings) and *Rajdhani* (Body) from Google Fonts.
    *   Icons: *Font Awesome* 6.4.0.

## 📂 File Structure

```
/WebMarket
│
├── index.html      # Main structure and content
├── style.css       # All visual styling, animations, and responsive rules
├── script.js       # Logic for navigation, modal, and scroll animations
└── README.md       # Project documentation
```

## 💻 Code Highlights

### The Glitch Effect (CSS)
The main title uses a pseudo-element technique with `clip-path` to create the jittery distortion effect without needing JavaScript or images.

```css
.glitch::before {
    content: attr(data-text);
    clip: rect(24px, 550px, 90px, 0);
    animation: glitch-anim-2 3s infinite linear alternate-reverse;
}
```

### Scroll Animations (JavaScript)
We use the `IntersectionObserver` to detect when elements enter the viewport, triggering the `.visible` class which handles the fade-in CSS transition.

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

