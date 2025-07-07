
# SYLVIA Health Platform Flow Diagram
*Complete Patient Journey & System Architecture*

## 🏥 GP/Clinic Workflow

### 1. GP Dashboard (`/gp-dashboard`)
**Purpose**: Central hub for GPs to manage patient assessments

**Actions Available**:
- Create secure assessment links for patients
- View completed assessments
- Access GP instructions tab
- Monitor assessment status

**Data Storage**: 
- `localStorage`: 'assessments' array
- `localStorage`: Individual assessment data keyed by sessionId

**Triggers Next**:
- → Patient receives secure link via email/SMS
- → Assessment link stored in `assessment_links` table (if using Supabase)

---

### 2. Patient Receives Secure Link
**Format**: `/patient-assessment/{unique-sessionId}?patientRef={encoded-patient-info}`

**Security Features**:
- Time-limited access (48 hours)
- Single-use link
- Patient reference encoding for identification

---

## 👤 Patient Journey

### 3. Patient Instructions Landing (`/patientinstructions?sessionId={id}`)
**Purpose**: Educational gateway before assessment

**Content Displayed**:
- NICE NG23 Enhanced Evidence-Based Assessment explanation
- What to expect (10-15 minutes, 8 steps)
- Privacy & security information
- Step-by-step process guide

**Patient Actions**:
- Read comprehensive instructions
- Click "Start My Assessment"

**System Actions**:
- Set flag: `localStorage.setItem('instructions_seen_{sessionId}', 'true')`
- Redirect to: `/patient-assessment/{sessionId}`

---

### 4. Patient Assessment (`/patient-assessment/{sessionId}`)
**Purpose**: 8-step NICE NG23 enhanced clinical assessment

**Assessment Steps**:
1. **About You** - Demographics, basic info
2. **Your Periods** - Menstrual history, postmenopausal bleeding flags
3. **Hot Flashes** - Vasomotor symptoms
4. **Physical Symptoms** - Joint pain, headaches, etc.
5. **Mental Health** - Mood, memory, anxiety, self-harm screening
6. **Sleep & Intimacy** - Sleep quality, sexual health
7. **Lifestyle** - Exercise, diet, bone health, UTI screening
8. **Complete** - Treatment preferences, final questions

**Real-time Risk Assessment**:
- Red flags detection (postmenopausal bleeding, severe symptoms)
- Risk badge display (Green/Amber/Red)
- Urgent warning triggers

**Data Collection**:
- All responses stored in `assessmentData` state
- Real-time validation and scoring
- Enhanced clinical evidence integration

**System Processing**:
- Calls `processAssessmentData()` from `assessmentProcessor.ts`
- Determines care pathway: 'gp-referral', 'self-care', or 'education'
- Generates clinical risk scores and recommendations

---

### 5. Assessment Results Processing
**File**: `useAssessmentCompletion.ts`

**Data Flow**:
1. **Assessment Data** → `processAssessmentData()`
2. **Clinical Analysis** → Risk stratification + pathway determination
3. **Storage Operations**:
   - Main assessments array: `localStorage['assessments']`
   - Individual result: `localStorage['assessment_{sessionId}']`
   - Patient reference linking

**Pathway Routing Logic**:
```
IF (determinedPath === 'self-care' OR 'education')
  → Redirect to Educational Resources
ELSE 
  → Redirect to Patient Results Page
```

---

### 6A. Patient Results - GP Referral Path (`/patient-results/{sessionId}`)
**Triggered When**: Clinical assessment indicates GP consultation needed

**Dynamic Content Based On Assessment**:
- **Risk Level Display**: Derived from actual assessment responses
- **Red Flags Handling**: 
  - If present: Gentle urgency message for GP appointment
  - If absent: Standard follow-up guidance
- **Personalized Recommendations**: Generated from assessment data
- **Treatment Discussion Points**: Tailored to patient's responses

**Content Sections**:
1. **Assessment Complete Confirmation**
2. **Health Summary** (from actual assessment data)
3. **Embedded Personalized Actions** (priority-based)
4. **GP Discussion Topics** (evidence-based)
5. **Educational Resources Integration**
6. **Symptom Tracker Integration**
7. **Next Steps Guidance**

**Actions Available**:
- Download assessment summary
- Access educational resources
- Begin symptom tracking
- Close window

---

### 6B. Educational Resources Path (`/education`)
**Triggered When**: Assessment indicates self-care pathway suitable

**Dynamic Routing**:
- URL: `/education?preferences={treatment-preferences}&sessionId={id}&source=assessment`
- Content personalized based on treatment preferences
- Self-care pathway components loaded

---

## 🔄 Data Flow & Storage Architecture

### Assessment Data Structure
```typescript
interface PatientAssessmentData {
  // Demographics
  patientRef: string
  dateOfBirth: string
  
  // Clinical Responses
  menstrualStatus: string
  postmenopausalBleeding: boolean
  hotFlashes: object
  physicalSymptoms: object
  moodSymptoms: object
  selfHarmRisk: boolean
  sleepQuality: number
  treatmentPreferences: string[]
  
  // Enhanced screening
  utiHistory: object
  boneHealth: object
  // ... additional fields
}
```

### Storage Locations
1. **Active Assessment**: Component state during completion
2. **Completed Assessments**: `localStorage['assessments']` (GP Dashboard access)
3. **Individual Results**: `localStorage['assessment_{sessionId}']` (GP Results page)
4. **Patient References**: `localStorage['patient_ref_{sessionId}']` (backup identification)

---

## 🏥 GP Results Workflow

### 7. GP Results Page (`/gp-results/{sessionId}`)
**Purpose**: Detailed clinical view for healthcare providers

**Data Sources**: 
- `localStorage['assessment_{sessionId}']`
- Clinical evidence integration
- NICE NG23 enhanced analysis

**Content Displayed**:
- Complete assessment responses
- Risk stratification results
- Clinical recommendations
- Treatment pathway suggestions
- Evidence-based guidance

---

## 🔐 Security & Privacy Flow

### Data Protection Points
1. **Link Generation**: Secure sessionId creation
2. **Patient Identification**: Encoded references
3. **Data Transmission**: Client-side processing
4. **Storage**: Local storage with session isolation
5. **Access Control**: Time-limited links, single-use validation

### Privacy Compliance
- NHS-grade security standards
- GDPR-compliant data handling
- Minimal data collection principle
- Secure disposal of temporary data

---

## 🎯 Integration Points

### External Systems
- **Educational Website**: Seamless handoff for self-care pathways
- **Symptom Tracker**: Post-assessment monitoring
- **Email Services**: Assessment link delivery
- **Clinical Systems**: Future EMR integration capability

### Internal System Connections
- **Authentication**: Role-based access (GP/Clinical Admin)
- **Dashboard Analytics**: Assessment completion tracking
- **Clinical Evidence**: Real-time guideline integration
- **Audit Logging**: Security and compliance tracking

---

## 📊 Success Metrics & Monitoring

### Patient Journey Metrics
- Instructions completion rate
- Assessment completion rate
- Time to completion
- Pathway distribution (GP vs self-care)

### Clinical Quality Metrics
- Red flag detection accuracy
- Risk stratification validation
- Treatment pathway appropriateness
- GP satisfaction with results quality

---

*This document serves as the technical blueprint for the complete SYLVIA Health platform flow, from GP initiation through patient completion and clinical review.*
