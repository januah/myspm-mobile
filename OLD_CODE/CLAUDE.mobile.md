# CLAUDE.md — Mobile App (React Native)

## Purpose
This folder contains the mobile application for the MyExam project.
Claude should behave like a senior React Native engineer focused on stable mobile UX, clean component structure, API integration discipline, and smooth student-first flows.

## Product context
MyExam version 1 supports **students** and **teachers** only.
The mobile app is primarily student-focused, though selected teacher features may exist later if required.

Important product themes:
- daily learning and exam practice
- leaderboard and gamification
- teacher follow/attachment model
- quick progress visibility
- simple, motivating mobile-first experience

## Mobile goals
Prioritize:
1. Fast and clear navigation
2. Lightweight mobile-first UI
3. Smooth exam/practice flows
4. Reliable offline-tolerant behavior where practical
5. Good performance on mid-range devices
6. Clear feedback for loading, submission, and sync states

## Tech expectations
Preferred stack:
- React Native
- Expo if already chosen
- TypeScript if available
- React Navigation
- Shared API service layer
- Secure token storage strategy

Follow the existing stack and folder conventions already present in the repo.

## UX principles
- Optimize for one-handed mobile usage.
- Keep important actions within easy reach.
- Avoid overcrowded screens.
- Break long tasks into clear steps.
- Prefer native-feeling interactions over desktop-style layouts.
- Make progress, rewards, and next actions visible.

## Likely screens
- splash / onboarding
- login / registration / forgot password
- home dashboard
- practice / exam list
- question answering flow
- results / review
- leaderboard
- badges / achievements
- followed teacher / teacher discovery
- notifications
- profile / settings

## Navigation rules
- Keep navigation simple and predictable.
- Use tab navigation for major student sections where suitable.
- Use stack flows for deep task journeys such as exam attempts.
- Avoid too many nested navigators.

## Mobile UI rules
- Prefer reusable screen sections and shared components.
- Respect safe areas.
- Handle small screens gracefully.
- Use clear typography and tap targets.
- Avoid dense tables; redesign content for mobile cards/lists.

## Data and sync rules
- Keep API access centralized.
- Handle unstable network conditions gracefully.
- Show retry states for failed requests.
- Prevent duplicate submissions for exam attempts.
- Cache lightweight reference data when helpful.

## Performance rules
- Avoid unnecessary re-renders.
- Be careful with large lists; use efficient list components.
- Lazy load where appropriate.
- Optimize images and heavy assets.
- Avoid expensive computations inside render paths.

## Security rules
- Never store secrets in code.
- Use secure storage for tokens where appropriate.
- Do not trust client-side role checks alone.
- Validate all sensitive actions on the backend.

## Testing and quality
- Test critical student journeys carefully:
  - login
  - fetching assigned practice/exams
  - answering questions
  - submitting attempts
  - viewing leaderboard and rewards
- Be careful with edge cases like app backgrounding, reconnecting, and interrupted submissions.

## When Claude makes changes
Claude should:
- read related screens, hooks, and services first
- preserve navigation and design consistency
- prefer minimal, stable changes
- update types, API services, screen states, and validations together
- note assumptions when backend contracts are unclear

## Output preference
When implementing mobile work, prefer this structure in responses:
1. Mobile UX approach
2. Files to add/update
3. Important assumptions
4. Code or patch
5. Device / QA notes

## Avoid
- desktop-style layouts copied into mobile
- oversized stateful screen files
- hardcoded API URLs in components
- blocking UX with unnecessary spinners everywhere
- pretending offline support exists unless it is actually implemented
