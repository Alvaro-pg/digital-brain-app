# Digital Brain – Frontend

A personal knowledge management system designed to capture, organize, and transform scattered information into structured, reusable knowledge. Built during HackUDC 2026.

## Overview

Digital Brain is a "second brain" application that helps users reduce cognitive friction when capturing and organizing information. Instead of interrupting your workflow to categorize notes immediately, Digital Brain provides a unified inbox for quick capture, with intelligent processing and organization later.

### Key Features

- **Unified Inbox** – Quick capture of text, links, ideas, code snippets, and media references
- **Smart Content Recognition** – Automatic identification of entry types (notes, tasks, links, code, etc.)
- **Knowledge Organization** – Transform raw entries into structured, connected knowledge
- **Visual Analytics** – Explore your knowledge base through interactive charts and graphs
- **Category Management** – Organize memories into customizable categories

## Tech Stack

- **React 19** – UI library
- **Vite** – Build tool and development server
- **TailwindCSS 4** – Styling
- **ECharts** – Data visualization
- **React Router** – Client-side routing

## Installation

Clone the repository:

```bash
git clone https://github.com/diegobousop/digital-brain-app.git
cd digital-brain-app
```

Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

> **Note:** This frontend requires the Digital Brain backend API running on `http://localhost:8000`.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React context providers
├── pages/            # Route page components
├── services/         # API service modules
└── assets/           # Static assets
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request.

## Authors

See [AUTHORS.md](AUTHORS.md) for the list of contributors.

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
