
# SILVIA Health Platform Flow Diagram
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
3. **Hot Flashes** - Vasomotor symptoms with frequency and severity
4. **Physical Symptoms** - Joint pain, headaches, energy levels, fatigue
5. **Mental Health** - Mood changes, anxiety levels, memory issues, self-harm screening
6. **Sleep & Intimacy** - Sleep quality, disturbances, sexual health
7. **Lifestyle** - Exercise, diet, bone health, UTI screening
8. **Complete** - Treatment preferences, current treatments, final questions

**Real-time Risk Assessment**:
- Red flags detection (postmenopausal bleeding, severe symptoms)
- Risk badge display (Green/Amber/Red)
- Urgent warning triggers

**Enhanced Data Collection**:
- Detailed symptom frequency and severity ratings
- Specific sleep disturbance patterns
- Current treatment usage and preferences
- Lifestyle factors and exercise levels
- Mental health screening with risk stratification

**System Processing**:
- Calls `processAssessmentData()` from `assessmentProcessor.ts`
- Determines care pathway: 'gp-referral', 'self-care', or 'education'
- Generates clinical risk scores and recommendations
- Creates personalized tracking and education recommendations

---

### 5. Assessment Results Processing
**File**: `useAssessmentCompletion.ts`

**Enhanced Data Flow**:
1. **Assessment Data** → `processAssessmentData()`
2. **Clinical Analysis** → Risk stratification + pathway determination
3. **Personalization Engine** → Generate symptom tracking recommendations
4. **Educational Mapping** → Create personalized learning content
5. **Storage Operations**:
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

**Enhanced Content Sections**:
1. **Assessment Complete Confirmation**
2. **Health Summary** (from actual assessment data)
3. **Embedded Personalized Actions** (priority-based with urgency levels)
4. **GP Discussion Topics** (evidence-based, symptom-specific)
5. **Educational Resources Integration** (personalized content selection)
6. **Symptom Tracker Integration** (detailed tracking recommendations)
7. **Next Steps Guidance**

**New Personalization Features**:
- **Symptom Tracking Recommendations**: 
  - Generated from specific assessment responses (hot flash frequency, sleep quality, mood severity)
  - Includes detailed tracking guidance (what to record, how often)
  - Priority levels (high/medium/low) based on symptom severity
  - Specific categories: Vasomotor, Sleep, Mood/Cognitive, Physical, Menstrual, Treatment Response

- **Educational Content Selection**:
  - Dynamically generated based on treatment preferences
  - Symptom-specific topics prioritized by severity
  - Integration with existing education page content
  - Contextual linking with session data

**Actions Available**:
- Download assessment summary
- Access personalized educational resources
- Explore symptom tracking (redirects to SILVIA homepage)
- Close window

---

### 6B. Educational Resources Path (`/education`)
**Triggered When**: Assessment indicates self-care pathway suitable

**Enhanced Dynamic Routing**:
- URL: `/education?focus={personalized-topics}&sessionId={id}&source=assessment&personalized=true`
- Content personalized based on treatment preferences and symptom severity
- Self-care pathway components loaded with contextual data

---

### 7. SILVIA Platform Integration Points

#### 7A. Symptom Tracker Integration
**New Patient Flow**: 
- Assessment → Results → "Explore Symptom Tracking" → SILVIA Homepage
- URL: `/?source=assessment&session={sessionId}&focus=symptom-tracking`
- Homepage explains SILVIA platform and symptom tracking benefits
- Patients can choose to sign up and start tracking

**Returning Patient Flow**:
- Direct access to symptom tracker if already registered
- Personalized tracking recommendations from assessment

#### 7B. Educational Resources Integration  
**Enhanced Personalization**:
- Assessment data used to prioritize educational content
- Dynamic topic selection based on symptoms and preferences
- Integration with existing education page structure
- Contextual navigation from assessment results

---

## 🔄 Enhanced Data Flow & Storage Architecture

### Extended Assessment Data Structure
```typescript
interface PatientAssessmentData {
  // Demographics
  patientRef: string
  dateOfBirth: string
  
  // Enhanced Clinical Responses
  menstrualStatus: string
  postmenopausalBleeding: boolean
  hotFlashFrequency: 'none' | 'weekly' | 'daily' | 'multiple-daily'
  nightSweats: 'none' | 'rare' | 'frequent' | 'nightly'
  sleepQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'very-poor'
  sleepDisturbances: string[]
  moodChanges: 'none' | 'mild' | 'moderate' | 'severe'
  anxietyLevels: 'none' | 'mild' | 'moderate' | 'severe'
  memoryIssues: 'none' | 'occasional' | 'frequent' | 'severe'
  jointPain: 'none' | 'mild' | 'moderate' | 'severe'
  headaches: 'none' | 'rare' | 'frequent' | 'daily'
  fatigue: 'none' | 'mild' | 'moderate' | 'severe'
  energyLevels: 'high' | 'normal' | 'low' | 'very-low'
  currentTreatments: string[]
  treatmentPreferences: string[]
  exerciseLevel: 'none' | 'light' | 'moderate' | 'vigorous'
  
  // Risk Assessment
  selfHarmRisk: boolean
  postmenopausalBleedingRisk: boolean
  
  // Enhanced screening
  utiHistory: object
  boneHealth: object
}
```

### Personalization Engine Components
1. **Symptom Tracking Recommender**: Analyzes assessment data to generate specific tracking guidance
2. **Educational Content Mapper**: Matches symptoms and preferences to educational resources
3. **Risk Stratification Engine**: Enhanced clinical decision support
4. **Treatment Pathway Advisor**: Personalized next steps based on comprehensive data

---

## 🏥 GP Results Workflow

### 8. GP Results Page (`/gp-results/{sessionId}`)
**Purpose**: Detailed clinical view for healthcare providers

**Enhanced Data Sources**: 
- `localStorage['assessment_{sessionId}']`
- Clinical evidence integration
- NICE NG23 enhanced analysis
- Personalization engine outputs

**New Content Features**:
- Symptom tracking recommendations for GP discussion
- Educational resource suggestions for patient
- Enhanced risk stratification with detailed reasoning
- Treatment pathway recommendations with evidence base

---

## 🔐 Security & Privacy Flow

### Enhanced Data Protection Points
1. **Link Generation**: Secure sessionId creation with time limits
2. **Patient Identification**: Encoded references with validation
3. **Data Transmission**: Client-side processing with enhanced validation
4. **Storage**: Local storage with session isolation and data encryption
5. **Access Control**: Time-limited links, single-use validation, IP tracking
6. **Audit Trail**: Enhanced logging for all assessment interactions

### Privacy Compliance
- NHS-grade security standards with enhanced audit logging
- GDPR-compliant data handling with explicit consent tracking
- Minimal data collection principle with purpose limitation
- Secure disposal of temporary data with verified deletion
- Enhanced consent management for educational and tracking integrations

---

## 🎯 Enhanced Integration Points

### External Systems
- **SILVIA Homepage**: Seamless patient onboarding for symptom tracking
- **Educational Platform**: Dynamic content personalization
- **Symptom Tracker**: Assessment-driven tracking recommendations
- **Email Services**: Assessment link delivery with enhanced templates
- **Clinical Systems**: Future EMR integration with standardized data formats

### Internal System Connections
- **Authentication**: Role-based access with enhanced session management
- **Dashboard Analytics**: Assessment completion tracking with outcome analysis
- **Clinical Evidence**: Real-time guideline integration with personalization
- **Audit Logging**: Enhanced security and compliance tracking
- **Personalization Engine**: Cross-platform data utilization for patient experience

---

## 📊 Success Metrics & Enhanced Monitoring

### Patient Journey Metrics
- Instructions completion rate with engagement tracking
- Assessment completion rate with drop-off analysis
- Time to completion with step-by-step analytics
- Pathway distribution with outcome correlation
- **New**: Symptom tracking adoption rate from assessments
- **New**: Educational resource engagement post-assessment

### Clinical Quality Metrics
- Red flag detection accuracy with validation studies
- Risk stratification validation with clinical outcomes
- Treatment pathway appropriateness with follow-up data
- GP satisfaction with results quality and personalization
- **New**: Patient satisfaction with personalized recommendations
- **New**: Long-term symptom tracking engagement and clinical utility

### Platform Integration Success
- **New**: Assessment-to-SILVIA conversion rates
- **New**: Educational content engagement from personalized recommendations
- **New**: Symptom tracking usage patterns from assessment recommendations
- **New**: Clinical outcome improvements with integrated care pathway

---

*This document serves as the technical blueprint for the complete SILVIA Health platform flow, from GP initiation through patient completion, clinical review, and ongoing care integration with personalized symptom tracking and educational support.*
