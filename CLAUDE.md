# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development (useful for debugging)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

### Application Overview
**Silvia Health** is a clinical-grade React/TypeScript healthcare application for menopause assessment and symptom tracking. It serves both patient and healthcare provider workflows with NHS-compliant assessment protocols.

### Key Architectural Patterns

**Multi-Step Assessment Flow**: 8-step progressive assessment form (`src/components/assessment-steps/`) that collects patient data and calculates clinical risk levels using NICE NG23 guidelines.

**Multi-Interface Design**: 
- Patient interface: User-friendly assessment forms with progress tracking
- GP interface: Clinical dashboard with risk assessment results and treatment recommendations
- Partner Zone: Educational resources and support guidance for partners/family members

**State Management**: Uses React hooks pattern with custom hooks:
- `useAssessmentState()` - Central assessment form state management
- `useAssessmentCompletion()` - Assessment completion logic
- No external state management library (Redux/Zustand)

**Clinical Risk Engine**: Real-time risk calculation system in `src/components/ConditionalQuestionLogic.tsx` that returns:
- **RED FLAGS**: Urgent care required (postmenopausal bleeding, cancer symptoms)
- **AMBER FLAGS**: Priority GP assessment needed
- **GREEN**: Routine management appropriate

### Data Flow Architecture

```
GP Creates Assessment → Patient Completes 8 Steps → Risk Calculation → 
Clinical Processing → Results Available to GP
```

**Data Storage**: Currently uses localStorage with session-based isolation. Supabase integration exists but is disabled for local development.

**Session Management**: Each assessment gets a unique session ID, data is segregated by GP email under `completed_assessments` localStorage key.

### Component Organization

**Core Components**:
- `/src/pages/` - Route-level pages (PatientAssessment, GPDashboard, PartnerZone, etc.)
- `/src/components/assessment-steps/` - 8 assessment form steps
- `/src/components/assessment/` - Assessment-specific UI components
- `/src/components/ui/` - shadcn/ui design system components

**Clinical Logic**:
- `/src/utils/assessmentProcessor.ts` - Data processing and normalization
- `/src/utils/clinicalValidation.ts` - Clinical validation rules
- `/src/types/clinicalTypes.ts` - TypeScript interfaces for clinical data

### Technology Stack Notes

**Build System**: Vite with SWC for fast compilation and hot reload on port 8080
**UI Framework**: shadcn/ui components with Radix UI primitives and Tailwind CSS
**Forms**: React Hook Form with Zod validation for type-safe form handling
**Routing**: React Router v6 with protected routes and role-based access control

### Development Considerations

**Local Development**: All data stored in localStorage, Supabase client mocked out
**Component Tagging**: lovable-tagger enabled in development mode for component identification
**Path Aliases**: `@/` resolves to `src/` directory
**Deployment**: Configured for Vercel with SPA routing in `vercel.json`

### Clinical Compliance

**NHS Guidelines**: Assessment follows NICE NG23 (Menopause diagnosis and management) and NICE CG27 (Cancer referral guidelines)
**Data Protection**: No persistent PII storage in current implementation, ready for GDPR-compliant backend integration
**Risk Assessment**: Clinical risk flags based on validated medical guidelines with immediate escalation protocols

### Key Files to Understand

- `src/App.tsx` - Main routing and application structure
- `src/pages/PatientAssessment.tsx` - Main patient assessment interface
- `src/hooks/useAssessmentState.ts` - Assessment state management
- `src/components/ConditionalQuestionLogic.tsx` - Clinical risk calculation engine
- `src/types/clinicalTypes.ts` - Core TypeScript definitions for clinical data

### Testing and Quality

Run `npm run lint` before committing changes. The application uses TypeScript strict mode for type safety and follows React best practices for component design.