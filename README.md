# molt shadowX (Shadowban Analyzer)

A powerful tool designed to analyze Twitter (X) profiles for potential shadowban triggers and visibility issues. The application simulates profile data and evaluates content against known algorithmic suppression factors.

## Features

- **🛡️ Risk Analysis Engine**: Scans content for specific triggers including:
  - Commercial/Crypto keywords
  - Toxicity and aggressive language
  - Link spam and hashtag density
  - Bot-like behavior patterns
- **🤖 AI Data Simulation**: Uses **Groq API** (Llama 3.3 70B) to generate realistic mock tweet data for any given username, simulating how an analyzer would see a profile.
- **📊 Interactive Score Gauge**: Visual risk meter with detailed breakdown of deductions.
- **📱 Responsive Design**: Fully responsive UI built with Tailwind CSS, mimicking the native X interface.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Groq API (Llama 3.3 70B)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` (or the port shown in your terminal) to view the app.

## Usage

1. Enter a Twitter username (e.g., `@elonmusk` or any handle) in the input field.
2. Click **"Check Status"**.
3. View the generated risk analysis, score, and specific recommendations to improve account visibility.

---
*Note: This project is for educational and analytical purposes.*
