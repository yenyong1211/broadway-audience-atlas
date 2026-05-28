:root {
  --bg: #f6efe2;
  --paper: #fffaf0;
  --ink: #17130f;
  --muted: #6e6258;

  --red: #9b1d2e;
  --gold: #d89b2b;
  --green: #567a4c;
  --blue: #4d7398;
  --brown: #845d34;
  --violet: #765a91;
  --capacity: #2f8f6f;

  --line: #d7c4a5;
  --soft-shadow: rgba(23, 19, 15, 0.08);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--ink);
  background:
    radial-gradient(circle at 12% 8%, rgba(155, 29, 46, 0.08), transparent 26%),
    radial-gradient(circle at 88% 14%, rgba(216, 155, 43, 0.1), transparent 26%),
    linear-gradient(180deg, #fbf5e9 0%, var(--bg) 100%);
  font-family: Georgia, "Times New Roman", serif;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input {
  font-family: inherit;
}

.reveal {
  opacity: 0;
  transform: translateY(34px);
  transition: opacity 0.85s ease, transform 0.85s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.atlas-header {
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 78px;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(251, 245, 233, 0.94);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(12px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 900;
  font-size: 18px;
}

.brand-symbol {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--red);
  color: white;
  box-shadow: 0 10px 24px rgba(155, 29, 46, 0.2);
}

.atlas-nav {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.atlas-nav a {
  padding: 11px 18px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 15px;
}

.atlas-nav a:hover {
  background: var(--ink);
  color: var(--paper);
}

.hero {
  max-width: 1500px;
  margin: 0 auto 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(70vh - 100px);
}

.hero-copy {
  width: 100%;
  max-width: 1180px;
  min-height: auto;
  padding: 70px 40px 70px;
  position: relative;
  overflow: visible;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  text-align: center;
}

.hero-copy::after {
  content: "ATLAS";
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  font-size: clamp(80px, 12vw, 190px);
  font-weight: 900;
  letter-spacing: 0.08em;
  color: rgba(155, 29, 46, 0.045);
  pointer-events: none;
  z-index: 0;
}

.hero-copy .eyebrow {
  position: relative;
  z-index: 2;
  color: var(--red);
  margin-bottom: 24px;
  text-align: center;
}

h1 {
  position: relative;
  z-index: 2;
  margin: 0 auto;
  max-width: 1050px;
  font-size: clamp(72px, 8.4vw, 140px);
  line-height: 0.82;
  letter-spacing: -0.075em;
  text-align: center;
}

.hero-copy > p:last-child {
  position: relative;
  z-index: 2;
  margin: 34px auto 0;
  max-width: 800px;
  color: var(--muted);
  font-size: 23px;
  line-height: 1.45;
  text-align: center;
}

.hero-stats {
  display: none;
}

main {
  padding: 10px 30px 60px;
}

.chart-card,
.text-card,
.side-card {
  border: 1px solid var(--line);
  border-radius: 40px;
  background:
    linear-gradient(135deg, rgba(255, 250, 240, 0.96), rgba(240, 226, 199, 0.92));
  box-shadow: 0 22px 56px var(--soft-shadow);
}

.eyebrow {
  margin: 0 0 16px;
  color: var(--red);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 12px;
  font-weight: 900;
}

.eyebrow.small {
  font-size: 11px;
  margin-bottom: 8px;
}

h1 {
  position: relative;
  z-index: 2;
  margin: 0;
  max-width: 980px;
  font-size: clamp(76px, 9vw, 160px);
  line-height: 0.82;
  letter-spacing: -0.075em;
}

.content-section {
  max-width: 1500px;
  margin: 0 auto 60px;
  scroll-margin-top: 100px;
}

.section-heading {
  margin-bottom: 22px;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(44px, 7vw, 70px);
  line-height: 0.86;
  letter-spacing: -0.06em;
}

.section-description {
  max-width: 900px;
  margin: 20px 0 0;
  color: var(--muted);
  font-size: 20px;
  line-height: 1.6;
}

.chart-card {
  padding: 28px 28px 22px;
  position: relative;
  overflow: hidden;
}

.chart-card::after {
  content: "";
  position: absolute;
  inset: 18px;
  border: 1px dashed rgba(118, 80, 45, 0.22);
  border-radius: 30px;
  pointer-events: none;
}

.chart-card.large {
  min-height: 690px;
}

.card-head {
  position: relative;
  z-index: 2;
  margin-bottom: 10px;
}

.card-head h3,
.text-card h3 {
  margin: 0;
  font-size: clamp(30px, 4vw, 60px);
  line-height: 0.92;
  letter-spacing: -0.05em;
}

.chart-note {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.55;
}

.chart-box {
  position: relative;
  z-index: 2;
  min-height: 420px;
}

.where-atlas {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.text-card {
  padding: 36px;
  align-self: start;
}

.text-card p:not(.eyebrow) {
  margin: 24px 0 0;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.65;
}

.map-step-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.step-btn,
.bubble-filter,
.bubble-action {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 250, 240, 0.78);
  color: var(--ink);
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition: background 0.22s ease, color 0.22s ease, transform 0.22s ease;
}

.step-btn:hover,
.step-btn.active,
.bubble-filter:hover,
.bubble-filter.active,
.bubble-action:hover {
  background: var(--red);
  color: white;
  border-color: var(--red);
  transform: translateY(-2px);
}

.key-insight {
  margin-top: 34px;
  padding: 24px 26px;
  border-radius: 28px;
  background: #120b08;
  color: var(--paper);
}

.key-insight span {
  display: block;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 11px;
  font-weight: 900;
}

.key-insight p {
  margin: 14px 0 0 !important;
  color: rgba(255, 250, 240, 0.88) !important;
  font-size: 17px !important;
  line-height: 1.5 !important;
}

.map-box {
  min-height: 520px;
}

.map-shape {
  cursor: pointer;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.map-shape.dimmed {
  opacity: 0.18;
}

.map-shape.active {
  opacity: 0.96;
  filter: drop-shadow(0 12px 18px rgba(23, 19, 15, 0.22));
}

.map-label {
  fill: var(--ink);
  font-size: 14px;
  font-weight: 900;
}

.map-sub-label {
  fill: var(--muted);
  font-size: 12px;
  font-weight: 800;
}

.bubble-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  margin-top: 24px;
}

.bubble-card {
  min-height: 760px;
}

.bubble-box {
  min-height: 620px;
}

.bubble-side-panel {
  display: grid;
  gap: 16px;
  align-content: start;
}

.side-card {
  border-radius: 28px;
  padding: 22px;
}

.bubble-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.show-search {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 250, 240, 0.84);
  padding: 12px 16px;
  font-size: 15px;
  color: var(--ink);
}

.show-search:focus {
  outline: 2px solid rgba(155, 29, 46, 0.24);
}

.selected-show-card h3 {
  margin: 0;
  font-size: 28px;
  line-height: 1;
  letter-spacing: -0.04em;
}

.selected-show-card p {
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.55;
}

.bubble {
  cursor: pointer;
  transition: opacity 0.25s ease, stroke-width 0.2s ease;
}

.bubble.faded {
  opacity: 0.12;
}

.bubble.selected {
  stroke: var(--ink);
  stroke-width: 3;
}

.bubble.top-highlight {
  stroke: var(--gold);
  stroke-width: 4.5;
  opacity: 1;
}

.bubble.capacity-highlight {
  stroke: var(--capacity);
  stroke-width: 4.5;
  opacity: 1;
}

.bubble:hover {
  opacity: 1;
  stroke-width: 3;
}

.capacity-label {
  fill: var(--capacity);
  font-size: 11px;
  font-weight: 900;
  pointer-events: none;
  paint-order: stroke;
  stroke: var(--paper);
  stroke-width: 4px;
  stroke-linejoin: round;
}

.bubble-legend-note {
  margin-top: 14px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.45;
}

.bubble-legend-note div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-capacity-outline {
  width: 16px;
  height: 16px;
  border: 3px solid var(--capacity);
  border-radius: 50%;
  display: inline-block;
  background: transparent;
}

.capacity-summary {
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(47, 143, 111, 0.12);
  color: var(--ink);
  font-size: 13px;
  line-height: 1.45;
  font-weight: 800;
}

.year-watermark {
  fill: rgba(23, 19, 15, 0.08);
  font-size: 150px;
  font-weight: 900;
  pointer-events: none;
}

.hover-guide {
  pointer-events: none;
}

.guide-line {
  stroke: var(--ink);
  stroke-width: 1.4;
  stroke-dasharray: 6 6;
  opacity: 0.55;
}

.guide-value-label {
  fill: var(--ink);
  font-size: 12px;
  font-weight: 900;
  paint-order: stroke;
  stroke: var(--paper);
  stroke-width: 4px;
  stroke-linejoin: round;
}

svg {
  width: 100%;
  height: auto;
  display: block;
}

.axis text {
  fill: var(--muted);
  font-size: 12px;
}

.axis path,
.axis line {
  stroke: var(--line);
}

.grid line {
  stroke: rgba(118, 80, 45, 0.18);
}

.grid path {
  display: none;
}

.tooltip {
  position: absolute;
  z-index: 120;
  pointer-events: none;
  opacity: 0;
  max-width: 280px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--ink);
  color: white;
  font-size: 13px;
  line-height: 1.4;
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.25);
}

.atlas-footer {
  padding: 10px 32px 36px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
}

@media (max-width: 1200px) {
  .hero,
  .where-atlas,
  .bubble-layout {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .hero-stats {
    grid-template-columns: 1fr;
  }

  .flip-card {
    height: 170px;
  }
}

@media (max-width: 740px) {
  .atlas-header {
    padding: 16px 18px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  main {
    padding: 20px 18px 50px;
  }

  .hero-copy,
  .hero-stats,
  .chart-card,
  .text-card,
  .side-card {
    border-radius: 28px;
  }

  .hero-copy {
    padding: 34px 26px;
  }

  h1 {
    font-size: clamp(56px, 17vw, 88px);
  }

  .section-heading h2 {
    font-size: clamp(44px, 15vw, 70px);
  }
}
