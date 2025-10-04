# TODO: Remove Wealth Management Traces and Pivot to General Luxury AI Concierge

## Phase 1: File Renames and Structure Updates
- [x] Rename wealth-management-landing.html to concierge-landing.html
- [x] Rename wealth-management-script.js to concierge-script.js
- [x] Rename wealth-management-styles.css to concierge-styles.css
- [x] Update server.cjs: Change routes to serve concierge-landing.html at root and /concierge
- [x] Update src/integrated-mcp-ai-server.js: Update any serves to new file names
- [x] Update IMPLEMENTATION-TODO.md: Remove wealth integrations, pivot to general concierge services
- [ ] Run search_files for "wealth|finance|investment|portfolio|assets" to verify traces before edits

## Phase 2: Content Rewrites - Generalize to Luxury Lifestyle Concierge
- [ ] Update concierge-landing.html:
  - Meta/title/description: Change to general AI concierge for luxury lifestyle (travel, events, personal assistance)
  - Hero: Replace financial metrics ($2.5T, etc.) with general (e.g., 500K+ experiences managed, 24/7 elite support); subtitle to lifestyle services
  - Navigation/Services: Remove Wealth Management; add/replace with Lifestyle Management, Luxury Travel, Event Planning
  - Intelligence section: Rephrase cards (e.g., Portfolio Optimization -> Personalized Itinerary Planning; Market Prediction -> Predictive Lifestyle Insights; keep Privacy & Security)
  - Services section: Pivot to Lifestyle Intelligence (personalized recommendations), Event Coordination (bespoke events), Personal Assistance (daily concierge); remove finance features like risk management
  - Trust & Assurance: Remove SEC/AML/FATCA/ financial compliance; focus on GDPR/data privacy, service excellence
  - Testimonials: Generalize to lifestyle/personal services (e.g., "transformed how I manage my schedule")
  - Reassurance: Remove financial guarantees/returns; focus on service uptime, personalization
  - Exclusive Access: Remove $100M assets criteria; use invitation-only for elite clients
  - Pricing: Lower tiers (e.g., Basic $99/month, Premium $499/month); features for lifestyle (itineraries, bookings, 24/7 support)
  - Collaborators: Change filters/experts to lifestyle (e.g., travel planners, event coordinators, personal chefs); remove finance options
  - Contact: Remove investable assets field; add service interest dropdown (travel, events, etc.)
  - Todo section: Change categories to general (personal, travel, events, health); update empty state/subtitle
  - Footer: Generalize "Why Veridian" to company overview; remove finance-specific links
- [ ] Update concierge-script.js:
  - Chatbot: Change welcome/responses to lifestyle (e.g., "How may I assist with your lifestyle needs?"; responses for travel/events)
  - Todo AI suggestions: Pivot categories/suggestions to lifestyle (e.g., "Book dinner reservation", "Plan vacation itinerary"); remove finance/investment tasks
  - Export CSV: Remove wealth-specific formatting; generalize headers
  - Analytics/Forms: Remove wealth-specific events/tracking (e.g., no 'wealth management' in events)
  - Functions: Generalize requestExclusiveAccess/viewDemo/selectMembership to concierge services (e.g., membership for lifestyle access)
- [ ] Update concierge-styles.css: Remove any wealth-specific classes (if any); ensure general luxury styling applies

## Phase 3: Update Dependent Files
- [ ] Update veridium/node_app/src/index.js: Remove/rename any wealth app references, logger messages, responses to general concierge
- [ ] Update veridium/node_app/package.json: Update name/description/keywords to "Veridian Private Concierge" (lifestyle focus)
- [ ] Update veridium/fastapi_app/app/main.py: Update app title, descriptions, responses, logger to general concierge
- [ ] Update .history/ai-collaborator-engine_20250928042547.js: Remove 'wealth-management' category; add general 'lifestyle'
- [ ] Update .github/production_ready_server.js and refactored_server_integration.js: Remove wealth welcome messages
- [ ] Update .github/workflows/code-quality.yml: Update echo statements to project overview (general concierge)
- [ ] Scan and update dashboard/src/components/*: Remove any finance integrations if present (e.g., no wealth hooks in TSX)
- [ ] Update MCP/chroma-server/*: Remove any wealth tools; pivot to general (e.g., travel APIs if needed)

## Phase 4: Verification and Testing
- [ ] Run search_files for "wealth|finance|investment|portfolio|assets|SEC|AML" to confirm removal
- [ ] Stop server (if running), update, restart with node server.cjs
- [ ] Launch browser to http://localhost:8000/ to verify new concierge-landing.html loads without wealth content
- [ ] Test interactions: Todo add/filter, chatbot, forms, collaborators search
- [ ] Update this TODO.md with [x] for completed steps after each phase

## Phase 5: Enhancements for General Concierge
- [ ] Add general MCP tools: e.g., weather lookup, restaurant reservations, event calendars (non-finance)
- [ ] Integrate with dashboard for unified experience
- [ ] Final review and attempt_completion
