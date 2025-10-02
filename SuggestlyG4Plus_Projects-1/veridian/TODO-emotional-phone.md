# TODO: Add Emotional Intelligence (EQ Mode) and Mobile Phone Bot Calling to Subscription Page

## Current Work
Enhance subscription.html with production-ready features for emotional intelligence in EQ/G4 modes and mobile phone bot calling, based on approved recommendations. This builds on the existing page (tested thoroughly: all sections render, interactions work, no errors). Focus on frontend demo with backend placeholders.

## Key Technical Concepts
- EQ Mode: Emotional Intelligence – Basic sentiment analysis using 'sentiment' library (CDN); empathetic responses based on score.
- G4 Mode: Performance – Disable emotion demo, show speed metrics.
- Mobile Calling: tel: links for direct dial; placeholder number +1-800-VERIDIAN (replace with Twilio in production).
- JS: Web Speech API for voice input (optional demo); fetch to mcp-server.js /analyze-emotion (mock for now).
- CSS: New classes for section, input, button; mode-specific styles (warm for EQ, cool for G4).
- Accessibility: ARIA labels, keyboard support.
- Dependencies: sentiment CDN, Font Awesome (existing), no new npm.

## Relevant Files and Code
- SuggestlyG4Plus_Projects/subscription.html: Add "AI Modes" section after pricing; add tel: buttons in CTA/footer; enhance script for demo (input analysis, mode toggle integration).
  - Current script has EQ/G4 toggle with localStorage; extend to show/hide emotion input.
- SuggestlyG4Plus_Projects/veridian.css: Add styles for .ai-modes, .emotion-demo, .call-bot-btn, animations.
  - Existing: eq-mode/g4-mode classes, btn styles; extend for new elements.
- src/eq-engine.js, src/human-voice-engine.js, src/mcp-server.js: Noted for production integration (e.g., fetch to /analyze-emotion); no changes now.

## Problem Solving
- Sentiment demo: Use keyword-based for simplicity; handle no library load (fallback to basic keywords).
- Voice: Request mic permission; fallback to text if denied.
- Phone: tel: works on mobile; desktop fallback to alert "Open on mobile".
- Security: Sanitize input with textContent; no eval.

## Pending Tasks and Next Steps
- [ ] Create/update TODO-emotional-phone.md with steps (this file).
- [ ] Read veridian.css to ensure style compatibility.
- [ ] Edit subscription.html: Insert AI Modes section (descriptions, input/button for demo); add call buttons; update script (load sentiment, analyze function, integrate with toggle).
  - Quote from recent conversation: "Add an interactive 'Test Your AI Mode' section after pricing: Input field + button to analyze sentiment."
- [ ] Edit veridian.css: Add new styles (e.g., .ai-modes { background: linear-gradient(...); }, .call-bot-btn { ... pulse animation }).
- [ ] Test new features: Launch browser, verify section renders, sentiment works (positive/negative responses), tel: opens (simulate), EQ toggle affects demo, no errors.
- [ ] Update README.md with new features section.
- [ ] Mark complete in TODO.md; attempt_completion.

Proceed step-by-step, confirming each tool use.
