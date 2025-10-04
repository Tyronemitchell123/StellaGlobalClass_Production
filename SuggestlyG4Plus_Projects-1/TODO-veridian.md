# Veridian Project - Next Steps & TODO List

This document outlines the plan for enhancing the Veridian Private Concierge platform, building upon the successful merge of the Next.js authentication system and the Express.js custom server.

## Phase 1: Unify and Refactor

- [ ] **Migrate Express APIs to Next.js:**
  - [ ] Move the `/api/contact` logic from `premium-production-server.js` into a new Next.js API route at `src/app/api/contact/route.ts`.
  - [ ] Move the `/api/membership` logic into a new Next.js API route at `src/app/api/membership/route.ts`.
  - [ ] Move the `/api/status` logic into a new Next.js API route at `src/app/api/status/route.ts`.
  - [ ] This will centralize all API logic within the Next.js framework, simplifying the server file.

- [ ] **Clean Up Server File:**
  - [ ] Once APIs are migrated, remove the custom API handling from `premium-production-server.js`, leaving it to focus solely on serving the Next.js app.

- [ ] **Static Asset Management:**
  - [ ] Move all static assets from the `/veridian` directory (e.g., `index.html`, `unified-veridian-styles.css`, `unified-veridian-script.js`) into the Next.js `/public` directory.
  - [ ] Convert the `veridian/index.html` page into the root `src/app/page.tsx` in the Next.js application. This will allow for dynamic React components and better integration.

## Phase 2: Feature Enhancements

- [ ] **Modal Enhancements:**
  - [ ] Add a "Forgot Password?" link to the "Sign In" modal form.
  - [ ] When clicked, this link should switch the modal's content to a "Reset Password" form that calls the existing `/api/auth/forgot-password` endpoint.

- [ ] **User Dashboard/Profile:**
  - [ ] Implement the "Update Email" feature on the user profile page (`/profile`).
  - [ ] Create a new API endpoint in Next.js to handle email update requests securely.
  - [ ] Add a section to the profile page to display user's membership status (e.g., "Elite Member").

- [ ] **Live Chat Widget:**
  - [ ] Replace the `alert()` on the live chat widget with a functional chat interface.
  - [ ] This could be a simple form that sends an email, or it could be integrated with a third-party service like Intercom or Crisp.

## Phase 3: Testing and Production Readiness

- [ ] **End-to-End Testing:**
  - [ ] Write end-to-end tests using a framework like Playwright or Cypress.
  - [ ] Test key user flows:
    - User registration.
    - User login via the modal.
    - Password change on the profile page.
    - Contact form submission.

- [ ] **Review Environment Variables:**
  - [ ] Ensure all sensitive information (like `EMAIL_PASS`, `JWT_SECRET`) is loaded exclusively from environment variables and not hardcoded.
  - [ ] Create a `.env.example` file to document required variables for other developers.
