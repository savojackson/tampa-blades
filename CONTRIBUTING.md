# 🤝 Contributing to Tampa Blades

Thank you for your interest in contributing to Tampa Blades! This document provides guidelines and information for contributors.

## 🚀 Quick Start for Contributors

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/tampa-blades.git
   cd tampa-blades
   ```
3. **Install dependencies**
   ```bash
   npm run setup
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make your changes**
6. **Test your changes**
7. **Submit a pull request**

## 📋 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Environment Setup
1. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp .env.example .env
   ```
2. Fill in your API keys (optional for basic development)
3. Set up database:
   ```bash
   cd backend
   npm run migrate
   ```

### Running in Development Mode
```bash
# Start both frontend and backend
npm run dev

# Or run separately
npm start           # Frontend
cd backend && npm run dev  # Backend
```

## 🏗️ Project Structure

```
tampa-blades/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── config/            # Configuration
│   └── utils/             # Utility functions
├── backend/               # Express backend
│   ├── routes/            # API routes
│   ├── database/          # Database layer
│   ├── middleware/        # Express middleware
│   └── utils/             # Backend utilities
├── public/                # Static assets
└── docs/                  # Documentation
```

## 📝 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for new frontend code
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Follow existing code style (Prettier configured)

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Use proper prop types
- Keep components focused and reusable

### Backend Code
- Use async/await for asynchronous operations
- Implement proper error handling
- Use middleware for common functionality
- Follow RESTful API principles

### Database
- Use migrations for schema changes
- Add proper indexes for performance
- Use transactions for related operations
- Follow naming conventions

## 🧪 Testing Guidelines

### Frontend Testing
```bash
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### Integration Testing
```bash
npm run test:integration
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Event creation and approval
- [ ] Map functionality
- [ ] Photo upload and gallery
- [ ] Admin panel (if applicable)

## 🎨 UI/UX Guidelines

### Design Principles
- **Skater-friendly**: Design for the skating community
- **Mobile-first**: Ensure mobile responsiveness
- **Accessibility**: Follow WCAG guidelines
- **Performance**: Optimize for fast loading

### Component Guidelines
- Use React Bootstrap components when possible
- Maintain consistent spacing and typography
- Implement proper loading states
- Add appropriate error messages

### Color Scheme
- Primary: Skate-inspired colors
- Secondary: Complementary colors
- Error: Clear error indicators
- Success: Positive feedback colors

## 🔍 Code Review Process

### Pull Request Guidelines
1. **Descriptive Title**: Clearly describe what the PR does
2. **Detailed Description**: Explain the changes and why they're needed
3. **Screenshots**: Include before/after screenshots for UI changes
4. **Testing**: Describe how you tested the changes
5. **Documentation**: Update relevant documentation

### PR Template
```markdown
## What does this PR do?
Brief description of changes

## Why is this change needed?
Explain the problem this solves

## How was this tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing
- [ ] Cross-browser testing

## Screenshots (if applicable)
Before/after images

## Checklist
- [ ] Code follows project standards
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Bug Reports

### Before Reporting
1. Check if the issue already exists
2. Try to reproduce the bug
3. Check with the latest version

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., macOS, Windows]
- Browser: [e.g., Chrome, Firefox]
- Version: [e.g., 1.0.0]

**Screenshots**
If applicable, add screenshots
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other ways to solve this problem

**Additional Context**
Any other relevant information
```

## 🏷️ Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

### Examples
```bash
feat(events): add event filtering by skill level
fix(map): resolve marker clustering issue
docs(readme): update installation instructions
style(components): fix linting errors
refactor(api): extract database queries to separate module
test(auth): add unit tests for login functionality
chore(deps): update React to version 18
```

## 📚 Documentation

### When to Update Documentation
- Adding new features
- Changing existing functionality
- Adding new API endpoints
- Modifying environment variables
- Updating deployment process

### Documentation Types
- **README.md**: Project overview and setup
- **API.md**: API documentation
- **DEPLOYMENT.md**: Deployment guide
- **CONTRIBUTING.md**: This file
- **Code comments**: Inline documentation

## 🎯 Areas for Contribution

### High Priority
- [ ] Mobile responsiveness improvements
- [ ] Performance optimizations
- [ ] Accessibility enhancements
- [ ] Test coverage improvements

### Medium Priority
- [ ] New skate spot features
- [ ] Enhanced event management
- [ ] Social features
- [ ] Admin panel improvements

### Good First Issues
- [ ] Documentation improvements
- [ ] UI polish and styling
- [ ] Bug fixes
- [ ] Translation support

## 🌟 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project credits page

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: For sensitive issues

### Response Times
- Bug reports: 24-48 hours
- Feature requests: 1 week
- Pull requests: 2-3 days

## 📜 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Celebrate diversity in the skating community

### Unacceptable Behavior
- Harassment or discrimination
- Spam or irrelevant content
- Sharing others' private information
- Inappropriate content

### Enforcement
Violations will result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to the maintainers.

## 🏁 Final Notes

### Quality Standards
- All code must pass CI checks
- Maintain backwards compatibility when possible
- Follow security best practices
- Write clear, maintainable code

### Release Process
1. Development in feature branches
2. Code review via pull requests
3. Testing in staging environment
4. Release to production
5. Post-release monitoring

Thank you for contributing to Tampa Blades! Together, we're building something awesome for the skating community. 🛹

---

**Happy coding and keep skating! 🛼**