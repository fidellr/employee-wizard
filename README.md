# Employee Wizard Form

A role-based 2-step wizard form application built with React and TypeScript, featuring async autocomplete, file upload, auto-save, and employee management.

#### DEMO: https://employee-wizard.netlify.app
## ✨ Features

- **Role-based Access Control**: Admin users access both steps, Ops users only Step 2
- **Async Autocomplete**: Department and location search with debounced API calls
- **Photo Upload**: Image upload with live preview and Base64 conversion
- **Auto-generated Employee ID**: Format `<3-letter dept>-<3-digit seq>` (e.g., ENG-001)
- **Draft Auto-save**: Automatically saves form data to localStorage every 2 seconds
- **Sequential Submit Flow**: Simulates bulk async submission with 3-second delays and progress tracking
- **Employee List Page**: Merged data display from two APIs with pagination
- **Responsive Design**: Fully responsive from 360px to 1440px+ screens
- **Vanilla CSS**: Clean BEM-style architecture with NO CSS frameworks

## 🛠 Tech Stack

- React 18 + TypeScript
- React Router for navigation
- json-server for mock APIs
- Vitest + React Testing Library for testing
- Pure vanilla CSS (no Tailwind, no UI libraries)

## 📋 Prerequisites

- Node.js 18+
- npm (recommended) or npm/yarn

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Application

You need to run **THREE separate terminals**:

#### Terminal 1: Frontend Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

#### Terminal 2: json-server Step 1 (Basic Info API - Port 4001)

```bash
npm run api:step1
```

#### Terminal 3: json-server Step 2 (Details API - Port 4002)

```bash
npm run api:step2
```

### Alternative: Using Docker Compose

If you have Docker installed, you can run both json-server instances with:

```bash
docker-compose up -d
```

Then in a separate terminal, run the frontend:

```bash
npm run dev
```

## 🎯 Usage Guide

### Accessing the Wizard

**Via URL Parameter:**

- Admin role: `http://localhost:5173/wizard?role=admin`
- Ops role: `http://localhost:5173/wizard?role=ops`

**Via UI Toggle:**

- Use the role selector buttons at the top of the wizard page

### Admin Workflow

**Step 1 - Basic Information (Admin Only)**

1. Enter full name
2. Enter email (with inline validation)
3. Search and select department (async autocomplete)
4. Select role from dropdown
5. Employee ID auto-generates based on department
6. Click "Next" to proceed to Step 2

**Step 2 - Details**

1. Upload photo (click to select, preview appears, converts to Base64)
2. Select employment type
3. Search and select office location (async autocomplete)
4. Add optional notes
5. Click "Submit"

### Ops Workflow

- Direct access to Step 2 only
- Same fields as Admin Step 2
- Submit directly without basic info
- Data stored with placeholders for missing basic info fields

### Draft Auto-save

- Form data automatically saves to localStorage every 2 seconds (debounced)
- Separate draft storage for Admin (`draft_admin`) and Ops (`draft_ops`)
- Drafts automatically restore on page reload
- Click "Clear Draft" to remove saved data for current role

### Submit Flow

When you click Submit, the application:

1. Shows progress bar
2. Logs: `⏳ Submitting basicInfo...` (Admin only)
3. Waits 3 seconds (simulated delay)
4. Logs: `✅ basicInfo saved!`
5. Logs: `⏳ Submitting details...`
6. Waits 3 seconds (simulated delay)
7. Logs: `✅ details saved!`
8. Logs: `🎉 All data processed successfully!`
9. Redirects to Employee List page

### Employee List

- View all submitted employees at `/employees`
- Data merged from both API endpoints (basicInfo + details)
- Pagination: 10 employees per page
- Missing fields show "—" placeholder (for Ops-only submissions)
- Click "+ Add Employee" to open the wizard

## 🧪 Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm test:ui
```

### Test Coverage

1. **AsyncAutocomplete.test.tsx**

   - Renders and fetches suggestions correctly
   - Shows loading state during fetch
   - Handles user selection

2. **SubmitFlow.test.tsx**
   - Sequential POST simulation
   - Progress state handling
   - Button state management during submission

## 🌐 API Endpoints

### Step 1 API (Port 4001)

- `GET /departments?name_like={query}` - Search departments
- `GET /basicInfo` - Get all basic info records
- `POST /basicInfo` - Submit basic info (3s delay)

### Step 2 API (Port 4002)

- `GET /locations?name_like={query}` - Search locations
- `GET /details` - Get all details records
- `POST /details` - Submit details (3s delay)

## 🎨 CSS Architecture

- **Pure vanilla CSS** - No frameworks or preprocessors
- **BEM naming convention** - Block\_\_Element--Modifier pattern
- **Mobile-first approach** - Base styles for mobile, media queries for larger screens
- **Responsive breakpoints**: 360px, 640px, 768px, 1440px
- **Consistent spacing** - Using rem units for scalability
- **Visual feedback** - Hover states, focus states, transitions
- **Accessibility** - Proper contrast ratios, semantic HTML

## 🔧 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Key Implementation Details

### Employee ID Generation

```typescript
// Format: <3-letter dept>-<3-digit seq>
// Example: ENG-001, LEN-002, OPS-003
const deptCode = department.substring(0, 3).toUpperCase();
const sequence = (existingCount + 1).toString().padStart(3, "0");
return `${deptCode}-${sequence}`;
```

### Auto-save Mechanism

- Debounced with 2-second delay
- Saves to localStorage with role-specific keys
- Automatically restores on component mount
- Clears after successful submission

### Data Merging Strategy

- Fetches from both APIs simultaneously
- Merges by `email` or `employeeId`
- Handles partial data (Ops-only submissions)
- Shows placeholders for missing fields

## 🐛 Troubleshooting

**Issue**: API calls failing

- **Solution**: Ensure both json-server instances are running on ports 4001 and 4002

**Issue**: Draft not saving

- **Solution**: Check browser localStorage is enabled and not full

**Issue**: Images not displaying

- **Solution**: Ensure uploaded images are valid image files (jpg, png, gif, etc.)

**Issue**: Build errors

- **Solution**: Run `npm install` to ensure all dependencies are installed

## 📄 License

MIT

## 👥 Contributing

This is a demonstration project. Feel free to fork and modify as needed.
