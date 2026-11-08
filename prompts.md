
# PairWise Speech - App Generation Prompts

This document outlines the step-by-step prompts required to build the PairWise Speech application.

### Step 1: Initial Project Setup and Branding

**Prompt:**
"Initialize a new Next.js application named 'PairWise Speech'. The core purpose of the app is to be an intelligent tool for Speech Language Pathologists (SLPs) to generate therapy targets.

Configure the project with TypeScript, Tailwind CSS, and ShadCN UI.

Apply the following style guidelines:
- **Primary Color**: Calming blue (#64B5F6)
- **Background Color**: Light gray (#EEEEEE)
- **Accent Color**: Soft green (#81C784)
- **Font**: 'PT Sans' (sans-serif) for body and headlines.

Update `src/app/globals.css` to reflect these colors using HSL variables. Update `tailwind.config.ts` to use the 'PT Sans' font. Update `src/app/layout.tsx` to apply the font and set the metadata title to 'PairWise Speech' and the description to 'An intelligent tool for Speech Language Pathologists to generate therapy targets.' Create a placeholder `Logo` component in `src/components/logo.tsx`."

---

### Step 2: Build the Landing Page & Authentication Modals

**Prompt:**
"Create the landing page (`src/app/page.tsx`). It should feature:
1.  A header (`src/components/landing-header.tsx`) with the logo, navigation links for 'Features' and 'Approaches', and 'Login' / 'Sign Up' buttons.
2.  A hero section with a headline 'Smarter Speech Therapy Starts Here,' a descriptive paragraph, a 'Get Started' button, and a placeholder image.
3.  A 'Core Features' section highlighting the app's capabilities.
4.  An 'Evidence-Based Approaches' section. Make each approach a clickable card. When clicked, it should open a dialog modal displaying a detailed description, an example, and a protocol walkthrough for that approach.
5.  A simple footer with copyright info and links to Terms/Privacy pages.
6.  The 'Login' and 'Sign Up' buttons in the header should open dialog modals containing their respective forms, instead of navigating to separate pages. Create reusable `LoginForm` and `SignupForm` components for this purpose (`src/components/login-form.tsx`, `src/components/signup-form.tsx`).
7.  Create basic placeholder pages for `/terms` and `/privacy`."

---

### Step 3: Create the Main Application Dashboard

**Prompt:**
"Create the main application dashboard.
1.  Set up a new route group for the dashboard at `/dashboard`.
2.  Create a layout (`src/app/dashboard/layout.tsx`) that includes a collapsible sidebar and a main content area with a header.
3.  The sidebar should have navigation links for 'Generator' and 'Saved Lists' with appropriate icons.
4.  The header (`src/components/app-header.tsx`) should include a user profile dropdown menu with an avatar and a 'Log out' option.
5.  The main page of the dashboard (`src/app/dashboard/page.tsx`) should contain the primary feature: the `SpeechTool` component.
6.  Create the initial `SpeechTool` component (`src/components/speech-tool.tsx`). This component will be a large form for generating speech targets. Initially, it should contain a dropdown for 'Phonological Error or Process' and a radio group for 'Therapy Approach'."

---

### Step 4: Implement AI Target Generation Flows

**Prompt:**
"Create the core AI functionality for generating speech therapy targets. For each of the following therapy approaches, create a separate Genkit AI flow file. Each flow should accept a `phonologicalError` and other optional parameters (like `syllableLength`, `phonemePosition`, `phoneticInventory`, `stimulableSounds`) and return a list of target words/pairs along with a `rationale` that explains why the target was chosen and cites the source of its logic (e.g., Weiner, 1981).

1.  **Minimal Pairs**: `src/ai/flows/generate-minimal-pairs.ts`
2.  **Maximal Pairs**: `src/ai/flows/generate-maximal-pairs.ts`
3.  **Multiple Oppositions**: `src/ai/flows/generate-multiple-oppositions.ts`
4.  **Cycles Approach**: `src/ai/flows/generate-cycles-targets.ts`
5.  **Complexity Approach**: `src/ai/flows/generate-complexity-targets.ts`

Integrate these flows into the `SpeechTool` component. The form submission should call the appropriate flow based on the selected 'Therapy Approach' and display the results in a results card."

---

### Step 5: Enhance the Generator Form

**Prompt:**
"Enhance the `SpeechTool` form with more clinical options.
1.  Add dropdowns for 'Syllable Length' and 'Phoneme Position'.
2.  Add an 'Advanced Options' accordion. Inside, replace the basic multi-select inputs for 'Phonetic Inventory' and 'Stimulable Sounds' with a more user-friendly, grid-based `PhonemeSelector` component (`src/components/phoneme-selector.tsx`) that uses rounded-square buttons for each phoneme.
3.  Add an option for 'Custom Phoneme Substitution' in the 'Phonological Error' dropdown. When selected, it should reveal two new dropdowns for the user to specify the 'Target Phoneme' and the 'Error Phoneme'.
4.  Expand the list of pre-defined phonological errors to include 'Weak Syllable Deletion', 'Reduplication', and 'Backing'."

---

### Step 6: Add Advanced Clinical Features to Results

**Prompt:**
"Add advanced clinical features to the results display in the `SpeechTool` component.
1.  **Rationale Popover**: For each generated target, add an 'info' icon. When hovered or clicked, it should show a popover containing the AI-generated `rationale` for that specific target.
2.  **Trial Counter**: Add a simple counter with '+' and '-' buttons next to each target word/pair to allow SLPs to track production trials during a session.
3.  **Sonority Difference Calculation**: Create a new AI flow `calculateSonorityDifference` (`src/ai/flows/calculate-sonority-difference.ts`). This flow must correctly calculate the sonority of initial consonant clusters by summing the values of individual consonants. In the `SpeechTool` component, call this flow for each generated pair and display the 'Sonority Diff' in a badge. The badge should show the rationale on hover.
4.  **IPA Transcription**: Create a new AI flow `transcribeToIpa` (`src/ai/flows/transcribe-to-ipa.ts`). In the results card header, add a toggle switch labeled 'Show IPA'. When enabled, all generated words should be converted to their International Phonetic Alphabet representation by calling this new flow."
