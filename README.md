
# ChainBreaker - A Web-Based Code-Breaking Game

ChainBreaker is an engaging, Mastermind-style code-breaking game designed to test your logic and deduction skills. The objective is to guess a secret 4-digit code within a set number of attempts and a time limit. With a sleek, modern interface and multiple difficulty levels, ChainBreaker offers a challenging experience for players of all skill levels.

This project is built with a modern technology stack, featuring a responsive design that works seamlessly on both desktop and mobile devices. It also includes placeholder features for future blockchain integration, allowing for on-chain scorekeeping and wallet connectivity.
## Features

*   **Classic Code-Breaking Gameplay**: Guess a secret 4-digit code using logic and feedback.
*   **Four Difficulty Levels**:
    *   **Easy**: 12 attempts, allows duplicate numbers.
    *   **Normal**: 10 attempts, allows duplicate numbers.
    *   **Hard**: 8 attempts, no duplicate numbers.
    *   **Expert**: 6 attempts, no duplicate numbers.
*   **Time Limit**: Each difficulty has a time limit to increase the challenge.
*   **Interactive UI**: A sleek, game-themed interface with clear feedback on each guess.
*   **Responsive Design**: Fully playable on both desktop and mobile devices.
*   **Leaderboard**: Track top scores across different difficulty levels.
*   **Light & Dark Mode**: Switch between themes for your preferred visual experience.
*   **Wallet Connection (Mocked)**: A "Connect Wallet" feature is included, preparing for future blockchain integration.

## Technology Stack

This project is built with a modern front-end stack that emphasizes performance and developer experience:

*   **Framework/Library**: [React](https://reactjs.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [shadcn-ui](https://ui.shadcn.com/)
*   **Routing**: [React Router DOM](https://reactrouter.com/)
*   **State Management**: [TanStack Query](https://tanstack.com/query/latest) (for asynchronous state) & React Hooks (for local state)
*   **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 18.x or later recommended) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL>
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd akintun-code-breaker-layout
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```

### Running the Application

Once the dependencies are installed, you can run the development server:

```sh
npm run dev
```

This will start the Vite development server, and you can view the application at `http://localhost:8080`.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode.
*   `npm run build`: Builds the app for production to the `dist` folder.
*   `npm run lint`: Lints the project files for code quality and errors.
*   `npm run preview`: Serves the production build locally to preview it.

## Project Structure

The project is organized with a clear and scalable structure:

```
akintun-code-breaker-layout/
├── public/              # Static assets like robots.txt
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── game/        # Components specific to the game (GuessRow, NumberPad)
│   │   ├── layout/      # App layout components (Header, AppShell)
│   │   ├── leaderboard/ # Components for the leaderboard page
│   │   ├── modals/      # Modal dialogs (Difficulty, GameResult)
│   │   └── ui/          # Base UI components from shadcn-ui
│   ├── hooks/           # Custom React hooks (e.g., use-mobile)
│   ├── lib/             # Utility functions (e.g., cn for classnames)
│   └── pages/           # Top-level page components for each route
│       ├── GameView.tsx
│       ├── LeaderboardView.tsx
│       └── RulesView.tsx
├── package.json         # Project dependencies and scripts
└── vite.config.ts       # Vite configuration
```
