# Test Setup

This folder contains test configuration and utilities for Vitest with React Testing Library.

## Contents

- `setup.ts` - Global test setup including:
  - Jest-DOM matchers for Vitest
  - `window.matchMedia` mock for responsive components

## Test Stack

- **Vitest** - Fast unit test framework compatible with Vite
- **React Testing Library** - Testing utilities focused on user behavior
- **user-event** - Simulates user interactions (clicks, typing, etc.)
- **jsdom** - Browser environment simulation

## Running Tests

```bash
npm run test           # Run all tests once
npm run test:watch     # Run in watch mode
npm run test:coverage  # Run with coverage report
```

## Test File Conventions

- Test files are co-located with source files
- Use `*.test.ts` for utility tests
- Use `*.test.tsx` for component tests

## Writing Tests

Example component test:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<MyComponent onClick={onClick} />)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

## Coverage

Coverage reports are generated in the `coverage/` folder (git-ignored). Target is 50%+ statement coverage.
