# TrustBox: Behavioral-Based Cyber Risk Scoring

TrustBox is a web-based platform designed to assess individual cybersecurity behavior and enhance online safety awareness. Built as an implementation of a capstone research project, the system evaluates users' digital habits through psychological models, password strength analysis, and URL heuristics to generate a **Personal Cyber Risk Score**, augmented with personalized AI-driven security recommendations.

## Core Features

1. **Behavioral Risk Assessment**: A guided questionnaire rooted in the Health Belief Model (HBM) and Protection Motivation Theory (PMT) to evaluate cybersecurity hygiene.
2. **Password Strength Analyzer**: A locally-executed tool (powered by `zxcvbn`) that measures password entropy, length, and dictionary vulnerabilities without transmitting credentials to a server.
3. **URL Safety Analyzer**: A heuristic scanner that detects structural anomalies, suspicious keywords, internal IPs, and link shorteners commonly associated with phishing attacks.
4. **AI Security Guidance**: Integration with Google's Generative AI to provide tailored, actionable advice based on the user's computed Cyber Risk Score.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom premium glassmorphism dark theme.
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/) with `@ai-sdk/google` (Gemini 2.5 Flash)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites
- Node.js 18+ and `pnpm` installed.
- A [Supabase](https://supabase.com/) project.
- A [Google AI Studio](https://aistudio.google.com/) API Key.

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   # Supabase Database Connection Details
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

   # Google Generative AI API Key
   GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."
   ```

3. **Initialize the Database:**
   Push the Drizzle ORM schema to your Supabase PostgreSQL instance:
   ```bash
   pnpm dlx drizzle-kit push
   ```

4. **Run the Development Server:**
   ```bash
   pnpm dev
   ```

5. **Open the Application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to start using TrustBox.

## Project Structure

- `app/`: Next.js App Router files, global styles, and Server Actions (`app/actions/assessment.ts`).
- `components/`: Modular React components (`AssessmentForm`, `PasswordChecker`, `UrlChecker`).
- `db/`: Drizzle ORM configuration and schema definitions (`db/schema.ts`).

## License
Created for educational capstone research purposes.
