# Task Manager Application

A full-stack task management application built with Astro, Svelte, Prisma, and TailwindCSS.

## Prerequisites

- Node.js (LTS version recommended)
- npm
- SQLite


## Tech Stack

- [Astro](https://astro.build/) - Web Framework
- [Svelte](https://svelte.dev/) - UI Components
- [Prisma](https://www.prisma.io/) - Database ORM
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Vitest](https://vitest.dev/) - Testing
- [OpenAI API](https://openai.com/) - AI Integration

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd irregular-iron
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   
Create a `.env` file in the root directory with:

```env
DATABASE_URL="file:./prisma/dev.db"
OPENAI_API_KEY="your-openai-api-key"
```

4. Initialize the database:

```bash
npx prisma migrate dev
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:4321`

## Testing

Run tests:

```bash
npm run test
```

Run tests in CI mode:

```bash
npm run test:run
```

## Build

To build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
/
├── prisma/             # Database schema and migrations
├── src/
│   ├── actions/        # Server actions and API
│   ├── components/     # UI components
│   ├── interfaces/     # TypeScript interfaces
│   ├── layouts/        # Page layouts
│   ├── pages/          # Application routes
│   └── styles/         # Global styles
└── tests/             # Test files
```

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete
- Filter tasks by priority and completion status
- AI-powered task description generation
- Priority levels (low, medium, high)
- Due date tracking

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
