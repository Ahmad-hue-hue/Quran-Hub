---
project: Tajweed Learning Management System (LMS)
version: 1.0.0
stack: React.js (JSX), Tailwind CSS, shadcn/ui
architecture: Feature-based, Clean Code, Separation of Concerns
testing: React Testing Library
---

# Tajweed Learning Management System - Agent Instructions

## ⚠️ CRITICAL: Read This First

**BEFORE implementing ANY feature in this project, you MUST:**

1. ✅ **Check `/skills/public/` folder** for relevant skills
2. ✅ **Read the applicable SKILL.md files** completely  
3. ✅ **Follow the patterns, best practices, and guidelines** defined in those skills
4. ✅ **Apply the skill instructions** to this project's specific requirements

### Relevant Skills for This Project:

**Primary Skills** (check these first):
- **`Skills/public/frontend-design/SKILL.md`** - For ALL UI components, layouts, styling decisions, and visual design
- **`/skills/public/file-reading/SKILL.md`** - For reading uploaded files (schedule PDFs, logos, etc.)

**Additional Skills** (check as needed):
- Any other skills in `/skills/public/`, `/skills/private/`, or `/skills/examples/` that become relevant

### Implementation Order:
1. Read this AGENT.md completely
2. Identify which features you're implementing
3. Check relevant SKILL.md files for those features
4. Implement following skill guidelines + project requirements
5. Write tests following React Testing Library patterns

**DO NOT write code without consulting the appropriate skills first.**

---

## Project Overview

### Purpose
An online learning platform for teaching Qur'an recitation rules (Tajweed) across four progressive levels (Marhalat), featuring:
- Automated student registration with unique ID generation
- Role-based access control (Students, Teachers, Admin)
- Content management with admin-controlled lesson unlocking
- Gender-based teacher-student matching
- Activity tracking (quizzes, exams, results)
- Independent operation of each Marhala level

### Target Users
1. **Students** - Learning Tajweed rules at different levels
2. **Teachers** - Providing guidance and answering student questions
3. **Admin** - Managing the entire system (users, content, activities)

### Key Differentiators
- Auto-generated registration numbers with embedded metadata
- Gender-based access control for teacher-student interactions
- Four independent learning tracks (Marhalat) with unique curricula
- Admin has full control over content visibility and user management

---

## Tech Stack Requirements

### Required Technologies
- **Frontend Framework**: React.js 18+ (JSX syntax)
- **Styling**: Tailwind CSS 3+ (latest version)
- **Component Library**: shadcn/ui (latest version)
- **Testing**: React Testing Library
- **Routing**: React Router v6
- **State Management**: React Context API or Zustand
- **Form Handling**: React Hook Form + Zod validation

### Architecture Principles
1. **Feature-based folder structure** - Group by domain/feature, NOT file type
2. **Small components** - Single responsibility, focused, reusable
3. **Logic separation** - Business logic in custom hooks, UI in components
4. **Clean code** - Follow repository clean code standards
5. **Composition** - Prefer component composition over inheritance

---

## Required Folder Structure

```
src/
├── features/              # Feature-based modules
│   ├── auth/             # Authentication & registration
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Business logic
│   │   ├── utils/        # Helper functions
│   │   └── services/     # API calls
│   │
│   ├── student/          # Student dashboard & features
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── teacher/          # Teacher dashboard & features
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── admin/            # Admin dashboard & features
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── marhala/          # Marhala data & logic
│       ├── components/
│       ├── hooks/
│       ├── utils/
│       └── data/         # Marhala 1-4 curriculum data
│
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   └── shared/          # Shared reusable components
│
├── lib/
│   ├── utils.js         # Global utilities (cn helper, etc.)
│   └── constants.js     # App-wide constants
│
├── hooks/               # Global shared hooks
├── context/             # React Context providers
├── routes/              # Routing configuration
├── assets/              # Images, PDFs, static files
├── styles/              # Global styles
├── App.jsx
└── main.jsx
```

---

## Core System Requirements

### 1. User Roles & Permissions

#### Role Types
```
ROLES:
- ADMIN: Full system control
- TEACHER: View assigned students, answer questions
- STUDENT_M1: Self-registered Marhala 1 student
- STUDENT_M2: Admin-registered Marhala 2 student
- STUDENT_M3: Admin-registered Marhala 3 student
- STUDENT_M4: Admin-registered Marhala 4 student
```

#### Gender Codes
```
A = Male
B = Female
```

#### Permission Matrix

**Students:**
- View own profile and registration number
- Access unlocked lessons for their Marhala
- Submit quizzes and exams
- View own results
- Contact teachers (gender-matched only)
- View schedule for their Marhala

**Teachers:**
- View assigned students (same gender only)
- Read and respond to student questions
- View student progress
- Cannot modify content or user data

**Admin:**
- Add/remove students for Marhalat 2-4
- Add/remove teachers
- Unlock/lock lessons
- Create quizzes and exams
- View all user data
- Change own password (default: Admin/)
- Full system control

---

### 2. Registration System

#### Marhala 1 - Self Registration

**Process Flow:**
1. Student visits registration page
2. Fills form: Name, Phone Number, Gender
3. System validates input
4. System generates unique Registration Number
5. System creates account with generated credentials
6. Display registration number to student
7. Student can now login

**Registration Number Format:** `X.Y.Z.G`

- **X** = Marhala number (always 1 for self-registration)
- **Y** = Awamu/Session number (currently 5)
- **Z** = Sequential enrollment number (1, 2, 3, 4...)
- **G** = Gender code (A for Male, B for Female)

**Examples:**
- `1.5.1.A` - First male student, Marhala 1, Awamu 5
- `1.5.2.B` - Second student (female), Marhala 1, Awamu 5
- `1.5.15.A` - Fifteenth student (male), Marhala 1, Awamu 5

**Business Rules:**
- Sequential number starts at 1 for each Awamu
- Number increments for each new registration
- Gender code is case-sensitive (uppercase A or B)
- Registration number becomes the username
- Initial password can be the registration number or custom

#### Marhalat 2-4 - Admin/Teacher Registration

**Process Flow:**
1. Admin selects "Add Student" for specific Marhala
2. Enters: Name, Phone Number, Gender, Marhala
3. System generates registration number (same format)
4. System generates credentials
5. Admin provides credentials to student manually
6. Student logs in with provided credentials

**Registration Number Examples:**
- `2.5.1.A` - First male student in Marhala 2
- `3.5.5.B` - Fifth female student in Marhala 3
- `4.5.10.A` - Tenth male student in Marhala 4

---

### 3. Student Dashboard Requirements

#### Profile Section
**Display:**
- Welcome message with student name
- Registration number (prominently displayed)
- Current Marhala
- Instructions specific to their Marhala

#### Schedule Section
**Display:**
- Full schedule for current Awamu (5)
- Lessons (Darsa 1, 2, 3...)
- Quizzes (Zoezi)
- Exams (Mtihani)
- Results release dates
- Special sessions (Halaqah, Tadreeb - Marhalat 2-4 only)

**Features:**
- Highlight current week/activity
- Mark past activities
- Show upcoming activities
- Indicate activity type (lesson/quiz/exam)

#### Lessons Section
**Display:**
- List of all lessons for student's Marhala
- Lock/unlock status (controlled by admin)
- Completion status
- Lesson title and brief description

**Behavior:**
- Locked lessons: Show lock icon, disabled, grayed out
- Unlocked lessons: Clickable, accessible
- Completed lessons: Show checkmark, remain accessible

**Admin Control:**
- Admin can unlock lessons one by one
- Default: All lessons locked
- Unlocking is irreversible (or admin can re-lock)

#### Activity Section (Quizzes & Exams)
**Display:**
- Available quizzes and exams
- Submission deadlines
- Status: Not Started, In Progress, Submitted
- Score (if submitted and graded)

**Features:**
- Cannot submit after deadline
- Timer for timed assessments
- Save progress functionality
- Submit once (no retakes unless admin allows)

#### Results Section
**Display:**
- Historical quiz scores
- Exam results
- Overall progress percentage
- Grade for each Zoezi and Mtihani

**Data Shown:**
- Activity name
- Date submitted
- Score obtained
- Total possible score
- Percentage
- Status (Pass/Fail if applicable)

#### Teacher List Section
**Display:**
- Only teachers matching student's gender
- Teacher name
- Contact information (phone, email)
- Specialization/subject area

**Gender Filtering:**
- Male students see only male teachers
- Female students see only female teachers
- Filter applied automatically

#### Help/Support Section
**Features:**
- Submit questions to teachers
- View question history
- Teacher responses
- Only teachers of same gender receive questions

---

### 4. Teacher Dashboard Requirements

#### Profile Section
- Teacher name
- Contact information
- Assigned Marhalat
- Gender

#### Student Roster
**Display:**
- List of students (same gender only)
- Student names
- Registration numbers
- Marhalat
- Contact information

**Filtering:**
- By Marhala
- By progress status
- Search by name or RG number

#### Inquiry Panel
**Display:**
- Questions from students
- Student name and RG number
- Question timestamp
- Response status (Answered/Pending)

**Features:**
- Read questions
- Write responses
- Mark as answered
- View question history

**Gender Restriction:**
- Only see questions from same-gender students
- Cannot access opposite-gender student data

---

### 5. Admin Dashboard Requirements

#### Student Management
**Features:**
- View all students across all Marhalat
- Add new students (Marhalat 2-4 only)
- Remove students
- Reset passwords
- View student details
- Search and filter students

**Add Student Form:**
- Name (required)
- Phone Number (required)
- Gender (required)
- Marhala (2, 3, or 4)
- Auto-generate registration number
- Create initial credentials

**Student List Display:**
- Registration number
- Name
- Gender
- Marhala
- Date joined
- Status (Active/Inactive)
- Actions (Edit, Remove, Reset Password)

#### Teacher Management
**Features:**
- View all teachers
- Add new teachers
- Remove teachers
- Reset passwords
- Assign Marhalat to teachers

**Add Teacher Form:**
- Name (required)
- Email (required)
- Phone (required)
- Gender (required)
- Password (required)
- Marhalat (select multiple: 1, 2, 3, 4)
- Specialization (optional)

**Teacher List Display:**
- Name
- Gender
- Email
- Phone
- Assigned Marhalat
- Number of students
- Actions (Edit, Remove, Reset Password)

#### Content Control (Lesson Unlocking)
**Features:**
- View all lessons by Marhala
- Unlock/lock individual lessons
- Bulk unlock lessons
- See unlock status for each lesson

**Lesson Unlocker Interface:**
- Select Marhala (1, 2, 3, or 4)
- List all lessons for that Marhala
- Toggle switches for lock/unlock
- Visual indicators (locked/unlocked)
- Confirmation before locking unlocked lessons

**Default State:**
- All lessons locked initially
- Admin must manually unlock

#### Activity Creator (Quizzes & Exams)
**Features:**
- Create new quizzes (Zoezi)
- Create new exams (Mtihani)
- Edit existing activities
- Delete activities
- Set deadlines
- Assign to specific Marhala

**Activity Creation Form:**
- Title (required)
- Type (Quiz or Exam)
- Marhala (1, 2, 3, or 4)
- Description (optional)
- Deadline (date and time)
- Duration (minutes)
- Questions (add multiple)

**Question Builder:**
- Question text
- Answer type (Multiple choice, Text input, etc.)
- Options (for multiple choice)
- Correct answer
- Points value

#### Settings
**Features:**
- Change admin password
- System configuration
- Backup data
- View system logs

**Admin Credentials:**
- Default username: `Admin`
- Default password: `/`
- Must be changeable after first login

---

### 6. Marhala Independence System

Each of the four Marhalat operates **independently** with:

#### Separate Curricula

**Marhala 1 Subjects:**
1. Al-Isti'ādhah
2. Al-Basmālah
3. Tajwīd na yanayohusiana nayo
4. Al-Lahnu al-Jalī wa al-Khafī
5. Idh-hār Al halqī
6. Idghām + Iqlāb
7. Ikhfā'
8. Mīm Sākinah (Idh-hār)
9. Idghām Mithlayn + Ikhfā'

**Marhala 2 Subjects:**
1. Makhaarij (1)
2. Makhaarij (2)
3. Makhaarij (3)
4. Ṣifāt zenye ḍhwidd (Vinyume)
5. Ṣifāt zisizo na ḍhwidd (Vinyume)

**Marhala 3 Subjects:**
1. Ḥukm al-Mīm wa an-Nūn al-Mushaddadatayn (Ghunnah)
2. Aḥkām al-Mithlayn
3. Al-Mutajānisayn wa al-Mutaqāribayn
4. Tafkhīm na Tarqīq (ḥurūf al-isti'lā' na al-istifāl)
5. Bāb al-Lāmāt
6. Bāb al-Ḍhwād wa al-Dhwā'
7. Aḥwāl ar-Rā' (Darsa 7–8)
8. Bāb al-Lāmāt as-Sawākin

**Marhala 4 Subjects:**
1-3. Aḥkām al-Mudūd
4. Al-Waqf wa al-Ibtidā'
5. Bāb al-Maqāṭi' wa al-Mabādi'
6. Bāb at-Tā'āt
7. Hamzat al-Waṣl
8. Al-Ishmām wa ar-Rawm
9. Al-Adā'

#### Separate Schedules

**Marhala 1 Schedule (3 months, Awamu 5):**
- 9 Darsa (lessons)
- 2 Zoezi (quizzes)
- 1 Mtihani (final exam)
- No Halaqah or Tadreeb

**Marhala 2 Schedule:**
- 8 Darsa
- 2 Zoezi
- 1 Mtihani
- 3 Halaqah sessions
- 1 Tadreeb period

**Marhala 3 Schedule:**
- 9 Darsa
- 2 Zoezi
- 1 Mtihani
- 1 Halaqah
- 1 Tadreeb period

**Marhala 4 Schedule:**
- 9 Darsa
- 2 Zoezi
- 1 Mtihani
- 1 Halaqah
- 1 Tadreeb period

#### Independent Activities
- Each Marhala has its own quizzes and exams
- No overlap between Marhalat
- Separate result tracking
- Different grading criteria (if applicable)

#### No Cross-Marhala Interaction
- Students in Marhala 1 cannot see Marhala 2 content
- Teachers assigned to Marhala 2 don't see Marhala 3 students
- Admin manages each Marhala separately

---

## Data Structure Requirements

### Student Entity
```
Student:
  - id: unique identifier
  - name: string
  - phoneNumber: string
  - gender: 'A' | 'B'
  - rgNumber: string (format: X.Y.Z.G)
  - marhala: 1 | 2 | 3 | 4
  - awamu: number (currently 5)
  - role: student_marhala_X
  - password: hashed string
  - createdAt: timestamp
  - createdBy: 'self' | admin_id | teacher_id
  - lessons: {
      lessonId: {
        isUnlocked: boolean
        isCompleted: boolean
        completedAt: timestamp
      }
    }
  - activities: {
      activityId: {
        status: 'pending' | 'in_progress' | 'completed'
        score: number
        submittedAt: timestamp
      }
    }
```

### Teacher Entity
```
Teacher:
  - id: unique identifier
  - name: string
  - email: string
  - phone: string
  - gender: 'A' | 'B'
  - password: hashed string
  - marhalat: array of numbers [1, 2, 3, 4]
  - specialization: string (optional)
  - createdAt: timestamp
```

### Lesson Entity
```
Lesson:
  - id: unique identifier
  - marhala: 1 | 2 | 3 | 4
  - title: string
  - description: string
  - content: string (lesson material)
  - order: number (display order)
  - isLocked: boolean (admin controlled)
  - resources: array of URLs/file paths
  - createdAt: timestamp
```

### Activity Entity (Quiz/Exam)
```
Activity:
  - id: unique identifier
  - marhala: 1 | 2 | 3 | 4
  - type: 'quiz' | 'exam'
  - title: string
  - description: string
  - deadline: timestamp
  - duration: number (minutes)
  - questions: [
      {
        id: string
        question: string
        type: 'multiple_choice' | 'text'
        options: array (if multiple choice)
        correctAnswer: string
        points: number
      }
    ]
  - createdAt: timestamp
  - createdBy: admin_id
```

### Schedule Entry
```
ScheduleEntry:
  - id: unique identifier
  - marhala: 1 | 2 | 3 | 4
  - title: string (e.g., "Darsa 1", "Zoezi (1)")
  - type: 'darsa' | 'zoezi' | 'mtihani' | 'halaqah' | 'tadreeb' | 'matokeo'
  - date: string or date range
  - description: string (optional)
```

---

## Business Logic Requirements

### Registration Number Generation

**Algorithm:**
1. Identify Marhala (X)
2. Get current Awamu (Y) - currently 5
3. Query database for highest sequence number (Z) for this Marhala + Awamu
4. Increment Z by 1
5. Determine gender code (G) from form input
6. Concatenate: X.Y.Z.G
7. Validate uniqueness
8. Return registration number

**Edge Cases:**
- First student: sequence starts at 1
- Concurrent registrations: use locking or atomic increment
- Awamu change: sequence resets to 1
- Invalid gender input: default to 'A' or require selection

### Gender-Based Filtering

**Teacher List Filter:**
- Student gender = A → Show only teachers with gender = A
- Student gender = B → Show only teachers with gender = B

**Student Roster Filter (for Teachers):**
- Teacher gender = A → Show only students with gender = A
- Teacher gender = B → Show only students with gender = B

**Inquiry Routing:**
- Question from student with gender A → Only male teachers can see
- Question from student with gender B → Only female teachers can see

### Lesson Lock/Unlock Logic

**Default State:**
- All lessons locked when first created
- isLocked = true

**Admin Unlock:**
- Admin toggles isLocked to false
- All students in that Marhala can now access
- Cannot be reversed (or requires confirmation)

**Student Access:**
- If lesson.isLocked == true → Show lock icon, disable click
- If lesson.isLocked == false → Allow access, show content

### Activity Submission Rules

**Deadline Enforcement:**
- If current time > deadline → Disable submission
- Show "Deadline passed" message
- Cannot submit late (unless admin extends)

**Single Submission:**
- After first submission → Disable "Submit" button
- Show "Submitted" status
- Score displayed after grading

**Progress Saving:**
- Auto-save answers every 30 seconds
- Can exit and return before deadline
- Warning before time runs out

---

## UI/UX Requirements

### Design Language

**Color Scheme:**
Based on the provided logo (green circular design with Qur'an):
- Primary: Dark green (#1e5128 or similar)
- Secondary: Medium green (#4e9f3d or similar)
- Accent: Light green (#d8e9a8 or similar)
- Background: White or light neutral
- Text: Dark gray or black

**Typography:**
- Clean, readable fonts
- Support Arabic text where needed
- Hierarchy: Headings, body, captions

**Components:**
- Use shadcn/ui components
- Consistent spacing and sizing
- Accessible (WCAG 2.1 AA minimum)

### Responsiveness
- Mobile-first design
- Tablet optimization
- Desktop layouts
- Breakpoints: 640px, 768px, 1024px, 1280px (Tailwind defaults)

### Loading States
- Skeleton loaders for content
- Spinners for actions
- Progress indicators for long operations
- Disable buttons during submission

### Error Handling
- Clear error messages
- Field-level validation feedback
- System-level error pages (404, 500)
- Network error notifications

### Accessibility
- Keyboard navigation
- Screen reader support
- Focus indicators
- Alt text for images
- ARIA labels where needed

---

## Testing Requirements

### Unit Tests
- Test all utility functions
- Test custom hooks
- Test form validation logic
- Test data transformations

### Component Tests
- Test component rendering
- Test user interactions
- Test conditional rendering
- Test prop handling

### Integration Tests
- Test user flows (registration → login → dashboard)
- Test form submission
- Test navigation
- Test role-based access

### Test Coverage Goals
- Aim for 80%+ coverage
- Critical paths: 100% coverage
- Use React Testing Library best practices

---

## Assets & Resources

### Logo
- **File**: WhatsApp_Image_2026-04-12_at_7_22_49_AM.jpeg
- **Location**: To be placed in `/src/assets/images/`
- **Usage**: Header, login page, registration page, footer

### Schedule PDF
- **File**: Tajweed_Awamu_ya_5_.pdf
- **Location**: To be placed in `/src/assets/schedules/`
- **Usage**: Reference for building schedule data structures
- **Note**: May need to extract text/data programmatically

### Data Extraction Needed
From the schedule PDF, extract:
- All lesson dates and titles for each Marhala
- Quiz/exam dates
- Halaqah and Tadreeb dates (Marhalat 2-4)
- Result announcement dates

---

## Security Requirements

### Authentication
- Implement secure login system
- Hash all passwords (bcrypt or similar)
- Session management (JWT or session cookies)
- Logout functionality

### Authorization
- Role-based access control (RBAC)
- Route protection (protected routes)
- API endpoint protection
- Gender-based filtering enforcement

### Data Protection
- Validate all user inputs
- Sanitize data before storage
- Prevent SQL injection (if using SQL)
- XSS protection
- CSRF protection

### Password Security
- Minimum length: 8 characters
- Require complexity (or don't, based on use case)
- Hash before storage
- Allow password reset

---

## Development Guidelines

### Code Organization
- One component per file
- Logical feature grouping
- Consistent naming conventions
- Clear folder structure

### Naming Conventions
- Components: PascalCase (StudentDashboard.jsx)
- Hooks: camelCase with 'use' prefix (useAuth.js)
- Utils: camelCase (generateRgNumber.js)
- Constants: UPPER_SNAKE_CASE
- CSS classes: kebab-case or Tailwind utilities

### Comments & Documentation
- JSDoc for functions with complex logic
- Inline comments for non-obvious code
- README files for major features
- API documentation (if applicable)

### Version Control
- Meaningful commit messages
- Feature branches
- Pull request reviews
- Keep commits atomic

---

## Implementation Priority

### Phase 1: Core Authentication
1. Registration system (Marhala 1 self-registration)
2. Login system
3. Role-based routing
4. Basic student dashboard

### Phase 2: Content & Lessons
1. Marhala data structures
2. Lesson display
3. Admin lesson unlocking
4. Schedule display

### Phase 3: Activities & Assessment
1. Activity creation (admin)
2. Quiz taking interface
3. Exam interface
4. Results display

### Phase 4: User Management
1. Admin dashboard (student management)
2. Teacher management
3. Teacher dashboard
4. Student-teacher interaction

### Phase 5: Polish & Testing
1. UI/UX refinements
2. Comprehensive testing
3. Performance optimization
4. Accessibility improvements

---

## Non-Functional Requirements

### Performance
- Page load time < 2 seconds
- Interactive response < 100ms
- Optimize images and assets
- Code splitting for large components

### Scalability
- Handle 500+ students per Marhala
- Support 20+ teachers
- Efficient data queries
- Caching where appropriate

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader friendly
- Color contrast ratios

---

## Future Enhancements (Out of Scope for v1.0)

- Email/SMS notifications
- Mobile app version
- Offline mode
- Video lessons
- Discussion forums
- Advanced analytics
- Certificate generation
- Payment integration
- Multi-language support (beyond Swahili/Arabic)

---

## Questions for Clarification

Before starting development, confirm:

1. **Data Storage**: What backend/database will be used? (Firebase, Supabase, custom API?)
2. **Authentication**: Preferred auth provider? (Firebase Auth, Auth0, custom?)
3. **File Storage**: Where to store lesson content, user uploads? (Cloud storage?)
4. **Deployment**: Where will this be hosted? (Vercel, Netlify, custom server?)
5. **Domain**: Is there a custom domain for the application?

---

**Document Version**: 1.0.0  
**Last Updated**: April 13, 2026  
**Project Owner**: Ahmad Hassan  
**Development Team**: TBD
