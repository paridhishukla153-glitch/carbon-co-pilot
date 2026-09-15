# EcoPulse Impact

Build a complete, production-quality hackathon MVP called **EcoPulse**.

Do not create a static UI mockup. Build a genuinely functional full-stack web application with working frontend, database, authentication, calculations, state updates, challenges, gamification, AI nudges, and dashboards.

The application must be deployable to **Vercel** after development in Lovable.

========================================================
1. PRODUCT
========================================================

PRODUCT NAME:
EcoPulse

TAGLINE:
"Measure less. Change more."

ONE-LINE DESCRIPTION:
EcoPulse is a personalized carbon-behavior coach that turns everyday lifestyle data into measurable CO₂e footprints, personalized AI nudges, sustainable challenges, verified actions, rewards, community competition, and aggregated civic sustainability insights.

CORE DIFFERENTIATOR:

Traditional carbon calculators mostly:

MEASURE → REPORT

EcoPulse closes the behavioral loop:

CAPTURE → CALCULATE → UNDERSTAND → NUDGE → ACT → VERIFY → REWARD → COMPARE

The objective is not simply to tell users how much carbon they emit.

The objective is to help them actually reduce it.

========================================================
2. IMPORTANT DEVELOPMENT RULES
========================================================

1. Build the application directly. Do not merely describe how to build it.
2. Inspect the existing project before changing anything.
3. Reuse existing functionality if it is useful.
4. Do not repeatedly ask for permission for normal implementation decisions.
5. Make sensible engineering decisions yourself.
6. Do not leave core functionality as TODOs.
7. Every important visible button must perform a real action.
8. Keep frontend, database, calculations and AI logically connected.
9. Do not fabricate external API integrations.
10. Clearly label simulated/demo data.
11. Never expose API keys in frontend code.
12. Carbon calculations must be deterministic.
13. AI generates recommendations, not carbon calculations.
14. Build with clean reusable components.
15. Make the application responsive.
16. Include loading, empty, success and error states.
17. Fix errors instead of simply reporting them.
18. Ensure npm run build works before considering the project complete.
19. Optimize the application for a 3-minute hackathon demo.
20. Do not stop after scaffolding.

========================================================
3. TECH STACK
========================================================

FRONTEND:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React
- Recharts

BACKEND / DATA:

- Supabase
- Supabase PostgreSQL
- Supabase Authentication
- Supabase Row Level Security
- Supabase Edge Functions or Vercel-compatible server-side functions when server-side logic/API secrets are required

AI:

- Use OpenAI API if OPENAI_API_KEY exists.
- Otherwise support Gemini if GEMINI_API_KEY exists.
- If neither exists, use a deterministic MOCK AI provider.
- Clearly label mock AI in development/demo mode.
- Never expose API keys to the browser.

OCR:

Create an abstraction for electricity bill OCR.

If a real OCR integration is unavailable, implement a demo/mock OCR flow that behaves realistically and clearly labels the result as demo OCR.

DEPLOYMENT:

The frontend and server-side functionality must be compatible with Vercel.

Create:

.env.example

with:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=

Never hardcode secrets.

========================================================
4. VISUAL DESIGN
========================================================

Make EcoPulse look like a premium climate-tech startup.

STYLE:

- sophisticated
- minimal
- clean
- modern
- trustworthy
- data-driven
- friendly without looking childish

COLOR DIRECTION:

- off-white / very light neutral backgrounds
- deep green
- charcoal
- muted mint accents
- restrained use of color

Use gradients sparingly.

Avoid:

- excessive gradients
- cartoon leaves everywhere
- generic stock photos
- excessive animations
- childish gamification
- huge cards containing tiny amounts of information

Use:

- strong typography
- clean charts
- subtle shadows
- tasteful borders
- compact but spacious dashboard layout
- subtle micro-interactions

The application should look credible enough for a startup demo.

========================================================
5. APPLICATION ROUTES
========================================================

PUBLIC:

/
 /login
 /signup

USER:

/dashboard
/footprint
/activity
/nudges
/challenges
/leaderboard
/campus
/profile

CIVIC:

/civic

Protect authenticated routes.

========================================================
6. LANDING PAGE
========================================================

Hero:

"Measure less.
Change more."

Subtitle:

"EcoPulse turns everyday habits into personalized climate actions, local challenges, and measurable CO₂ reduction."

Buttons:

"Start tracking"
"See how it works"

Sections:

1. The problem
2. How EcoPulse works
3. Personalized AI nudges
4. Behavioral challenges
5. Community accountability
6. Measurable impact
7. Civic sustainability intelligence
8. Call to action

Explain the distinction between:

Carbon measurement

and

Behavioral change.

Use this core message:

"Most platforms tell you your footprint. EcoPulse tells you what to change next."

========================================================
7. AUTHENTICATION
========================================================

Implement Supabase authentication.

Support:

- signup
- login
- logout
- session persistence
- protected routes

Create a demo-friendly login.

If Supabase is not configured, provide a development/demo mode that allows the application to be explored without breaking.

Never hardcode production credentials.

========================================================
8. DATABASE
========================================================

Create Supabase tables:

profiles
activities
emission_factors
footprints
nudges
nudge_feedback
challenges
challenge_participants
challenge_actions
badges
user_badges
communities
community_members
civic_metrics

Use:

- UUID IDs
- timestamps
- foreign keys
- appropriate indexes
- Row Level Security

Privacy:

Users must only access their own personal activity, footprint and profile data.

Community dashboards must expose aggregate information.

Civic dashboards must expose only anonymized aggregated information.

========================================================
9. CARBON CALCULATION ENGINE
========================================================

This is extremely important.

DO NOT ask the AI to calculate carbon emissions.

Create a deterministic calculation engine.

Core formula:

CO₂e = activity quantity × emission factor

Create configurable emission factors.

Support:

TRANSPORT:

car
motorcycle
bus
train
bicycle
walking

ENERGY:

electricity
LPG

FOOD:

vegetarian
dairy
chicken
fish
red meat

Store:

activity_type
quantity
unit
emission_factor
co2e
timestamp
source

Every calculation must be reproducible.

Display the calculation transparently.

Example:

Electricity usage:

184 kWh

× configured regional emission factor

= estimated CO₂e

Do not claim scientific precision beyond the emission factor/data quality.

========================================================
10. FOOTPRINT VS REDUCTION
========================================================

Do NOT confuse:

CURRENT EMISSIONS

with

CO₂ AVOIDED.

Track separately:

baseline emissions
current emissions
estimated reduction
verified reduction where applicable

If there is insufficient data for a genuine counterfactual, label it:

"Estimated reduction"

Do not fabricate exact reductions.

The key product metric should be:

"CO₂e avoided through verified actions"

========================================================
11. DASHBOARD
========================================================

Create a premium user dashboard.

Header:

"Good morning 👋"

Metrics:

CURRENT FOOTPRINT
24.8 kg CO₂e

WEEKLY CHANGE
↓ 11%

CO₂e AVOIDED
3.1 kg

ECO POINTS
420

STREAK
7 days

CAMPUS RANK
#18

These values may initially come from seeded demo data but must be connected to application state/database.

Main chart:

Weekly CO₂e footprint.

Show at least 8 weeks of historical data.

Breakdown:

Transport
Energy
Food
Other

Show:

"Your biggest source"

Example:

Transport

Then show the AI recommendation.

Example:

"Two of your five car trips this week were under 3 km. Replace two with walking or cycling next week."

Buttons:

"Take this challenge"
"Why this recommendation?"

Also show:

Recent activity
Active challenges
Recent badges

========================================================
12. ACTIVITY LOGGING
========================================================

Create an excellent activity logging interface.

Tabs:

Transport
Energy
Food

TRANSPORT:

mode
distance
number of trips
date

ENERGY:

electricity kWh
date

FOOD:

food category
quantity
date

After submission:

1. Validate input.
2. Calculate CO₂e deterministically.
3. Store activity.
4. Update footprint.
5. Update dashboard.
6. Update charts.
7. Update relevant recommendations.

Allow:

edit
delete

Show calculation explanation after submission.

========================================================
13. MY FOOTPRINT PAGE
========================================================

Create detailed footprint analytics.

Display:

Current week
Previous week
Monthly footprint
Estimated reduction

Charts:

- weekly footprint
- category breakdown
- monthly trend
- transport trend
- energy trend
- food trend

Section:

"Where your footprint comes from"

Rank emission categories.

Also display:

"Your biggest opportunity"

based on the user's actual behavior.

========================================================
14. ELECTRICITY BILL OCR
========================================================

Add:

"Scan electricity bill"

Allow image upload.

Attempt to extract:

billing period
electricity consumption
kWh
bill amount if visible

Show extracted values before final submission.

Clearly label:

"Detected by OCR"

Then after confirmation:

"Calculated"

If OCR confidence is low, require confirmation.

If a real OCR service is unavailable, use a mock/demo OCR service.

Never pretend mock OCR is real OCR.

========================================================
15. AI NUDGE ENGINE
========================================================

This is the main differentiating feature.

Create an AI service that receives a structured behavior summary.

Example:

{
  "weekly_emissions": 24.8,
  "previous_week_emissions": 27.9,
  "top_source": "transport",
  "car_km": 64,
  "short_car_trips": 5,
  "walking_km": 11,
  "electricity_kwh": 184,
  "diet_pattern": "mixed",
  "user_goal": "reduce emissions without spending money",
  "previous_nudges": [],
  "completed_nudges": []
}

The AI must generate:

title
message
reason
action_type
difficulty

Rules:

- personalized
- practical
- achievable
- non-judgmental
- maximum 25 words for the main nudge
- no generic advice
- no guilt
- no invented numbers
- no invented emission factors
- no invented savings

If numerical reduction is shown, it must come from the deterministic carbon engine.

Example:

"You made five short car trips this week. Replace two with walking or cycling next week."

Nudge page:

Today's recommendation
Why you're seeing it
Potential impact
Difficulty
Take challenge
Not relevant
Regenerate

Track:

shown
accepted
rejected
completed

========================================================
16. AI PERSONALIZATION
========================================================

Track feedback.

If the user repeatedly rejects cycling recommendations, reduce similar recommendations.

If the user repeatedly completes public transit challenges, recommend related actions.

If a user has high energy emissions, prioritize energy actions.

If transport is the biggest source, prioritize transport actions.

Build a simple recommendation ranking system around:

impact
difficulty
user behavior
previous feedback
user preference
novelty

========================================================
17. CHALLENGE SYSTEM
========================================================

Create challenges:

CAR-FREE FRIDAY
WALK & CYCLE WEEK
ENERGY SMART
MEAT-FREE MEALS
PUBLIC TRANSIT WEEK

Each challenge displays:

title
description
difficulty
participants
deadline
potential reduction
Eco Points
progress

Actions:

Join challenge
Log action
Complete

Challenge state must persist.

========================================================
18. ACTION VERIFICATION
========================================================

Do not award points simply because the user clicks "Complete."

Create verification methods:

manual
activity_data
simulated_data

Store:

verification_method
verification_status
evidence
timestamp

For the hackathon MVP, simulated activity verification is acceptable.

Clearly label simulated data.

Where activity data supports the action, automatically detect whether a challenge can be completed.

========================================================
19. GAMIFICATION
========================================================

Implement:

Eco Points
streaks
levels
badges

Badges:

First Step
7-Day Streak
Car-Free Champion
Energy Saver
Community Leader
100 kg CO₂ Avoided

Example points:

Activity logged: +5
Challenge completed: +50
Verified sustainable action: +25
7-day streak: +100

Points must update dynamically.

Streaks must update dynamically.

========================================================
20. LEADERBOARD
========================================================

Create:

Campus leaderboard
Community leaderboard

Do NOT rank users purely by lowest emissions.

Rank based on:

CO₂ avoided
verified actions
challenge participation

Filters:

This week
This month
All time

Show:

rank
avatar/initials
name
CO₂ avoided
Eco Points
verified actions

The current user's rank must update when data changes.

========================================================
21. CAMPUS SUSTAINABILITY HUB
========================================================

Create a community dashboard.

Demo campus:

Banasthali Campus

Metrics:

Participants
CO₂ avoided
Sustainable actions
Challenge participation

Show:

Weekly CO₂ avoided
Participation trend
Transport shift
Top communities

Demo communities:

Hostel A
Hostel B
Hostel C

Show active campus challenges.

Clearly label synthetic/demo data.

========================================================
22. CIVIC DASHBOARD
========================================================

Create a separate dashboard intended for:

"City Sustainability Officer"

This dashboard must ONLY use aggregated/anonymized data.

Never expose:

individual users
personal activities
personal locations
individual emissions

Display:

Active participants
CO₂e avoided
Transport shift
Walking/cycling increase
Energy reduction
Challenge participation

Create a visual synthetic heatmap/grid showing aggregate activity.

Label:

"Aggregated demo data"

Charts:

Transport adoption
Walking/cycling
Energy consumption
Community participation
CO₂ avoided

This is a secondary value proposition:

EcoPulse can provide aggregated behavioral sustainability insights for institutions and smart-city programs.

========================================================
23. USER PROFILE
========================================================

Profile page:

Name
Email
Campus
Community
Primary goal

Preferences:

Reduce emissions
Save money
Walk more
Use public transit
Reduce energy
Eat lower-carbon meals

Allow users to select goals.

Use these goals in AI personalization.

========================================================
24. COMPONENT ARCHITECTURE
========================================================

Create reusable components:

Navbar
Sidebar
MetricCard
CarbonChart
EmissionBreakdown
ActivityCard
ActivityForm
NudgeCard
ChallengeCard
ProgressBar
Leaderboard
BadgeCard
CommunityStats
CivicMetricCard
Heatmap
Modal
Toast
LoadingState
EmptyState
ErrorState

Keep components modular.

Do not create one massive component.

========================================================
25. DEMO DATA
========================================================

Seed internally consistent demo data.

Create:

1 demo user
30+ activities
8 weeks footprint history
5 challenges
20 leaderboard users
3 communities
multiple badges
multiple nudges
civic aggregate metrics

Use realistic Indian context:

km
kWh
₹
hostels
campuses
public buses
motorcycles
Indian food categories

Do not present synthetic data as real-world data.

Clearly identify demo data where necessary.

========================================================
26. DEMO USER
========================================================

Create a demo-friendly experience.

Example:

demo@ecopulse.local

Password:

demo123

If Supabase auth makes this unsuitable, create an equivalent demo mode.

Do not expose production credentials.

========================================================
27. API / SERVICE STRUCTURE
========================================================

Implement service functions/endpoints for:

health
dashboard
activities
footprint calculation
footprint history
footprint breakdown
OCR
nudges
nudge feedback
challenges
challenge participation
challenge progress
challenge completion
leaderboard
community
civic metrics
profile

Keep business logic separate from UI.

========================================================
28. PRIVACY
========================================================

Treat personal behavioral data as private.

Use Supabase Row Level Security.

Users can read/write their own:

activities
footprints
nudges
profile
challenge progress

Community data must be aggregated.

Civic data must be anonymized and aggregated.

Never expose individual user location information.

========================================================
29. EXTERNAL INTEGRATIONS
========================================================

Design the application so these can be integrated later:

Google Fit
Apple Health
Google Maps
real electricity bill OCR
live civic datasets

For the MVP, DO NOT pretend these integrations are active if they are not.

Instead create clear adapter interfaces.

Example:

ActivityDataProvider

with:

DemoActivityProvider
FutureGoogleFitProvider
FutureAppleHealthProvider

This makes the architecture credible without making false claims.

========================================================
30. ERROR HANDLING
========================================================

Handle:

- database unavailable
- authentication failure
- invalid form
- AI unavailable
- AI timeout
- OCR failure
- invalid upload
- duplicate challenge completion
- empty dashboard
- missing data

Never expose stack traces to users.

Show useful messages.

========================================================
31. VERCEL DEPLOYMENT
========================================================

The application MUST be deployable to Vercel.

Use a Vercel-compatible React/Vite structure.

Any server-side AI/API logic must keep secrets server-side.

Never put:

OPENAI_API_KEY
GEMINI_API_KEY

inside client-side JavaScript.

Use environment variables.

Create:

.env.example

Document all required variables.

Ensure:

npm install
npm run build

work successfully.

Do not depend on local-only services for the core production experience.

========================================================
32. README
========================================================

Create a professional README containing:

Project name
Problem
Solution
Core innovation
Features
Architecture
Tech stack
Database schema
AI architecture
Carbon calculation methodology
Privacy approach
Local development
Environment variables
Supabase setup
Vercel deployment
Demo account
Limitations
Future integrations

========================================================
33. TESTING
========================================================

Test:

carbon calculations
activity creation
footprint aggregation
challenge joining
challenge completion
points updates
leaderboard updates
AI fallback
authentication
dashboard data loading

Fix all obvious errors.

========================================================
34. HACKATHON DEMO
========================================================

Optimize for this exact 3-minute flow:

STEP 1:
Login.

STEP 2:
Dashboard shows:

24.8 kg CO₂e
↓ 11% this week

STEP 3:
Show that transport is the user's biggest source.

STEP 4:
Open AI Nudges.

Show:

"You made five short car trips this week. Replace two with walking or cycling next week."

STEP 5:
Click:

"Take this challenge"

STEP 6:
Join:

"Car-Free Friday"

STEP 7:
Log a sustainable activity / simulated verified activity.

STEP 8:
Challenge progress updates.

STEP 9:
Eco Points increase.

STEP 10:
Leaderboard position changes.

STEP 11:
Open Campus Sustainability Hub.

Show aggregate impact.

STEP 12:
Open Civic Dashboard.

Show anonymized aggregate trends.

Everything in this flow must actually work.

========================================================
35. PRODUCT POSITIONING
========================================================

The UI and copy should reinforce this competitive distinction:

Commons:
spending-based carbon estimation.

Capture:
mobility-focused tracking.

JouleBug / Earth Hero:
habit/action systems with standardized recommendations.

Klima:
offsetting and climate contributions.

EcoPulse:

MULTI-MODAL DATA
+
DETERMINISTIC CARBON CALCULATION
+
GENERATIVE PERSONALIZATION
+
BEHAVIORAL FEEDBACK
+
LOCAL COMMUNITY ACCOUNTABILITY
+
VERIFIED ACTIONS
+
CIVIC AGGREGATION

Do not make unsupported claims about competitors.

========================================================
36. NORTH-STAR METRIC
========================================================

The product's central impact metric should be:

"CO₂e Avoided Through Verified Actions"

Secondary metrics:

Verified sustainable actions
Challenge completion
Community participation
Weekly reduction
Active users

The product should communicate:

"We don't just measure the footprint.
We measure the change."

========================================================
37. FINAL QA
========================================================

Before declaring the application complete, verify:

[ ] Landing page works
[ ] Signup/login works
[ ] Logout works
[ ] Dashboard loads
[ ] Dashboard data is connected
[ ] Activity can be added
[ ] Activity can be edited
[ ] Activity can be deleted
[ ] Carbon calculations work
[ ] Footprint updates
[ ] Charts update
[ ] AI nudge works
[ ] Mock AI works without API key
[ ] AI does not invent numerical savings
[ ] Challenge can be joined
[ ] Challenge progress updates
[ ] Verification works
[ ] Eco Points update
[ ] Streak updates
[ ] Badges update
[ ] Leaderboard updates
[ ] Campus dashboard works
[ ] Civic dashboard works
[ ] Civic dashboard is aggregated
[ ] OCR flow works or has graceful demo fallback
[ ] Mobile layout works
[ ] Loading states exist
[ ] Error states exist
[ ] Empty states exist
[ ] No broken buttons
[ ] No exposed secrets
[ ] .env.example exists
[ ] README exists
[ ] npm run build succeeds
[ ] No obvious console errors
[ ] No obvious Supabase errors

========================================================
38. FINAL INSTRUCTION
========================================================

BUILD THE APPLICATION.

Do not stop at a design.

Do not give me a tutorial.

Do not tell me what I could implement later.

Implement the complete MVP now.

If a real external integration requires credentials that are not available, implement a clearly labeled demo adapter and make the architecture integration-ready.

After implementation:

1. Run the application.
2. Test the main user flow.
3. Fix errors.
4. Run the production build.
5. Fix build errors.
6. Verify that the application is ready to connect to GitHub and deploy to Vercel.

At the end, provide:

- what was actually implemented
- exact local run commands
- required environment variables
- Supabase setup requirements
- Vercel deployment steps
- demo login
- 3-minute hackathon demo script
- known limitations

Only list features that are genuinely implemented.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6fedca6d-213b-45fc-8011-cfd9b4c0a45d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
