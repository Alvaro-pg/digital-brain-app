# Contributing to Digital Brain

Thank you for your interest in contributing to Digital Brain! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** – Create your own copy of the project
2. **Clone your fork** – `git clone https://github.com/your-username/digital-brain-app.git`
3. **Install dependencies** – `npm install`
4. **Create a branch** – `git checkout -b feature/your-feature-name`

## Development Workflow

### Code Style

- Follow existing code patterns and conventions
- Keep components modular, focused, and reusable
- Use meaningful variable and function names
- Write self-documenting code with comments where necessary

### Component Guidelines

- Place React components in `src/components/`
- Place page-level components in `src/pages/`
- Keep components small and single-purpose
- Use TailwindCSS for styling

### Commit Messages

Write clear, concise commit messages:

```
feat: add category filtering functionality
fix: resolve sidebar navigation issue
docs: update installation instructions
style: format code with prettier
refactor: simplify memory card component
```

## Submitting Changes

1. **Test your changes** – Ensure `npm run dev` works without errors
2. **Run linting** – `npm run lint` and fix any issues
3. **Commit your changes** – Write a clear commit message
4. **Push to your fork** – `git push origin feature/your-feature-name`
5. **Open a Pull Request** – Describe your changes clearly

## Pull Request Guidelines

- Provide a clear description of what your PR does
- Reference any related issues
- Keep PRs focused on a single feature or fix
- Ensure your code follows the project's style

## Reporting Issues

When reporting bugs, please include:

- A clear description of the issue
- Steps to reproduce the behavior
- Expected vs actual behavior
- Browser and OS information if relevant

## Questions?

Feel free to open an issue for any questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.