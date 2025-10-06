# INR Tracker: Personal Finance Management App

INR Tracker is a comprehensive personal finance management application built with Next.js, React, and Tailwind CSS. It provides a suite of tools to help you take control of your financial health by tracking your income, expenses, assets, and liabilities.

![INR Tracker Dashboard](https://firebasestudio.ai/docs/inr-tracker-screenshot.png)

## Core Features

### 1. Unified Dashboard
Get a complete overview of your financial situation for any given month at a glance.
- **Monthly Summaries**: View your total income, total expenses, paid expenses, and unpaid expenses.
- **Visual Charts**: Interactive bar charts for income vs. expenses and a pie chart for expense categorization.
- **Credit Card Overview**: See your total credit card spending and a breakdown for each card.
- **AI-Powered Savings Forecast**: Get a projection of your next month's savings based on your historical data.
- **Recent Expenses**: Quickly review your latest paid and unpaid expenses.

### 2. Income Tracking
Log every source of income to understand your cash flow.
- **Add, Edit, Delete**: Easily manage your income entries.
- **Status Tracking**: Mark income as "Credited" or "Not Credited".
- **Recurring Income**: Set recurring income sources to automatically account for them in future months.

### 3. Expense Management
Keep a detailed record of where your money is going.
- **Standard Expenses**: Track individual expenses with categories, due dates, and "Paid"/"Unpaid" status.
- **Master Expenses**: Group related transactions under a single "Master Expense" (e.g., "Vacation" or "Wedding") to manage budgets for specific events. Each transaction within a master expense can have its own paid/unpaid status.
- **Budgeting**: The system automatically summarizes master expense totals (both paid and unpaid) in your main expense list.

### 4. Credit Card Hub
Manage all your credit cards from one place.
- **Centralized View**: See all your cards, their credit limits, and current monthly spending.
- **Transaction Logging**: Add, edit, or delete transactions for each card to maintain an accurate spending record.
- **Utilization Tracking**: The dashboard provides a progress bar to show your credit utilization for each card.

### 5. Net Worth Calculator
Track your wealth over time by logging your assets and liabilities.
- **Assets & Liabilities**: Easily add and manage items like bank balances, investments, property, loans, and outstanding credit.
- **Net Worth Growth Chart**: A historical line chart visualizes the growth of your net worth over time, with automatic monthly snapshots.

### 6. Dynamic Reporting
Generate insightful reports to analyze your spending habits.
- **Tabbed Views**: Switch between Daily, Monthly, and Yearly expense reports.
- **Interactive Charts**: Each report features a clear bar chart to help you visualize spending trends over different time periods.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **AI/Generative**: [Genkit](https://firebase.google.com/docs/genkit)
- **State Management**: React Context API
- **Authentication**: Firebase Authentication (Email/Password)
- **Data Persistence**: Firestore

## Getting Started

To get the project running locally, follow these steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/inr-tracker.git
    cd inr-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

Execute the following command to start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### User Credentials

You can log in with the following credentials:
- **Email**: `rajesh@example.com`, **Password**: `password123`

## Deployment

This Next.js application is configured for easy deployment with Firebase App Hosting.

1.  **Build the Project:**
    Create a production-ready build of your Next.js application.
    ```bash
    npm run build
    ```
    This will create an optimized build in the `.next` directory.

2.  **Deploy with Firebase CLI:**
    If you have the Firebase CLI installed, you can deploy the app directly.
    ```bash
    firebase deploy --only hosting
    ```

    Alternatively, connect your Git repository to the Firebase console for automated CI/CD deployments on every push to your main branch. The `apphosting.yaml` file is already configured for this.

After building, you can run the production server locally using:
```bash
npm run start
```
Your hosting provider will typically handle this step for you in a production environment.
