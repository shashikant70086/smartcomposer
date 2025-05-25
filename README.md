# SmartCompose - AI Notification Composer

SmartCompose is a Next.js application that helps you compose, refine, and schedule various types of notifications using the power of Generative AI. It leverages Genkit for AI functionalities and ShadCN UI components for a modern user interface.

## Features

-   **AI-Powered Notification Generation**: Input a base message and select a tone (e.g., formal, friendly, urgent), and the AI will generate multiple notification variants.
-   **Channel Previews**: See how your notifications might look across different channels (Push, Email, SMS).
-   **Scheduling**: Schedule your crafted notifications (simulated via UI, actual backend scheduling not implemented in this version).
-   **Preset Management**: Save and load your favorite notification composer settings as presets.
-   **Theme Toggle**: Switch between light and dark modes.

## Tech Stack

-   **Frontend**: Next.js (App Router), React, TypeScript
-   **UI**: ShadCN UI, Tailwind CSS
-   **AI**: Genkit (with Google Gemini models)
-   **Styling**: Tailwind CSS, CSS Variables
-   **State Management**: React Hooks (useState, useEffect), React Hook Form
-   **Linting/Formatting**: ESLint, Prettier (implicitly via Next.js setup)

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)

## Getting Started

Follow these steps to get the project running locally:

### 1. Clone the Repository (if applicable)

If you're not already in a Firebase Studio environment where the code is present:

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies

Install the project dependencies using npm or yarn:

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

The application uses Google AI services via Genkit, which requires an API key.

1.  Create a `.env` file in the root of the project by copying the example (if one exists) or creating it from scratch.
    ```bash
    touch .env
    ```

2.  Add your Google AI (Gemini) API key to the `.env` file:
    ```env
    GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual API key. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

    **Note**: The `src/ai/dev.ts` file uses `dotenv` to load these variables during Genkit development.

### 4. Running the Application Locally

To run SmartCompose, you need to start two separate development servers:

*   **Next.js Development Server** (for the frontend application)
*   **Genkit Development Server** (for the AI flows)

Open two terminal windows or tabs in your project's root directory.

**Terminal 1: Start the Next.js App**

```bash
npm run dev
```
This will typically start the Next.js application on `http://localhost:9002` (as configured in `package.json`).

**Terminal 2: Start the Genkit Flows**

```bash
npm run genkit:dev
# or for auto-reloading on changes to flow files:
npm run genkit:watch
```
This will start the Genkit development server, usually on `http://localhost:3400`, and make the AI flows available for the Next.js application to call. You can also inspect and test your flows using the Genkit Developer UI at this address.

Once both servers are running, you can access the SmartCompose application in your browser at the address provided by the Next.js server (e.g., `http://localhost:9002`).

### 5. Using the Application

-   **Compose Notifications**: Enter a base message, select a tone, and choose target channels. Click "Generate Notifications" to get AI-powered variants.
-   **Preview**: Review the generated variants for each selected channel.
-   **Schedule**: Click "Schedule for [channel]" to open the scheduler modal. Select a date and time (this is a UI simulation; no actual scheduling backend is implemented).
-   **Presets**:
    -   Save your current composer settings (base message, tone, channels) as a preset using the "Save as Preset" button.
    -   Load existing presets using the "Load Preset" dropdown. Presets are stored in browser localStorage.
-   **Theme**: Toggle between light and dark themes using the sun/moon icon in the header.

## Building for Production

To create a production-ready build of the Next.js application:

```bash
npm run build
```
This command compiles and optimizes your Next.js application into the `.next` directory.

To run the production build locally (after building):

```bash
npm run start
```
This starts the Next.js production server. Note that for AI functionalities to work with a production build, Genkit flows would typically be deployed as well (e.g., as Cloud Functions or another serverless environment if not using Firebase App Hosting's integrated capabilities).

## Deployment

This application is structured for easy deployment, especially with Firebase App Hosting.

-   The `apphosting.yaml` file provides basic configuration for Firebase App Hosting.
-   The `package.json` includes the necessary `build` and `start` scripts that Firebase App Hosting will use.
-   Genkit flows can be deployed alongside your Next.js application if using an integrated environment or separately as server-side functions. Firebase Studio is designed to streamline this.

When deploying via Firebase Studio, the environment variables (like `GOOGLE_API_KEY`) should be configured in the hosting environment settings.

## Project Structure Key Files

-   `src/app/page.tsx`: Main page component for the SmartCompose UI.
-   `src/components/`: Contains all React UI components.
    -   `notification-composer.tsx`: Form for inputting notification details.
    -   `preview-display.tsx`: Displays generated notification variants.
    -   `scheduler-modal.tsx`: Modal for scheduling notifications.
    -   `ui/`: ShadCN UI components.
-   `src/ai/`: Contains Genkit AI-related code.
    -   `genkit.ts`: Genkit global AI object initialization.
    -   `dev.ts`: Entry point for `genkit start`.
    -   `flows/`: Directory for Genkit flows.
        -   `generate-notification-variants.ts`: Flow for generating notification text.
        -   `summarize-messages.ts`: (Example) Flow for summarizing messages.
-   `src/types/index.ts`: TypeScript type definitions.
-   `src/app/globals.css`: Global styles and Tailwind CSS theme customization.
-   `tailwind.config.ts`: Tailwind CSS configuration.
-   `next.config.ts`: Next.js configuration.
-   `.env`: Local environment variables (needs to be created with `GOOGLE_API_KEY`).
-   `README.md`: This file.

## Further Development

Potential areas for future improvement:

-   Implement actual backend scheduling and persistence for notifications.
-   Integrate the `summarize-messages` flow into the UI to provide insights.
-   Add more sophisticated AI features (e.g., A/B testing suggestions, performance prediction).
-   Expand channel-specific customization options.
-   Add user authentication and database storage for presets.
-   Improve error handling and provide more user feedback.
