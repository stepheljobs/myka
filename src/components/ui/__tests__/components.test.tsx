import { render, screen } from '@testing-library/react';
import { Button } from '../Button';
import { Card } from '../Card';
import { Input } from '../Input';
import Typography from '../Typography';
import Grid from '../Grid';
import Shape from '../Shapes';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('Neobrutalism Components', () => {
  describe('Button', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('applies variant classes correctly', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-brutal-green');
    });

    it('handles loading state', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Card', () => {
    it('renders children correctly', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies shadow classes', () => {
      render(<Card shadow="brutal">Content</Card>);
      const card = screen.getByText('Content').parentElement;
      expect(card).toHaveClass('shadow-brutal-xl');
    });
  });

  describe('Input', () => {
    it('renders with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<Input error="Required field" />);
      expect(screen.getByText('Required field')).toBeInTheDocument();
    });

    it('shows helper text', () => {
      render(<Input helperText="Enter your email" />);
      expect(screen.getByText('Enter your email')).toBeInTheDocument();
    });
  });

  describe('Typography', () => {
    it('renders different variants', () => {
      render(<Typography variant="h1">Heading</Typography>);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('applies color classes', () => {
      render(<Typography color="orange">Orange text</Typography>);
      const element = screen.getByText('Orange text');
      expect(element).toHaveClass('text-brutal-orange');
    });
  });

  describe('Grid', () => {
    it('renders children in grid layout', () => {
      render(
        <Grid cols={2}>
          <div>Item 1</div>
          <div>Item 2</div>
        </Grid>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('Shape', () => {
    it('renders different shapes', () => {
      render(<Shape shape="circle" color="orange">Content</Shape>);
      const shape = screen.getByText('Content').parentElement;
      expect(shape).toHaveClass('aspect-square', 'rounded-full', 'bg-brutal-orange');
    });
  });
});