import { render, screen, fireEvent } from '@testing-library/react';
import { AuthFormFields } from '@/components/auth/AuthFormFields';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  businessName: z.string().optional(),
  whatsappNumber: z.string().optional()
});

describe('AuthFormFields', () => {
  const onSubmit = vi.fn();

  const TestWrapper = ({ view }: { view: 'login' | 'signup' }) => {
    const form = useForm({
      resolver: zodResolver(schema),
      defaultValues: {
        email: '',
        password: '',
        businessName: '',
        whatsappNumber: ''
      }
    });

    return <AuthFormFields form={form} view={view} onSubmit={onSubmit} />;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form fields correctly', () => {
    render(<TestWrapper view="login" />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/business name/i)).not.toBeInTheDocument();
  });

  it('renders signup form fields correctly', () => {
    render(<TestWrapper view="signup" />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/whatsapp number/i)).toBeInTheDocument();
  });

  it('shows validation errors for invalid email', async () => {
    render(<TestWrapper view="login" />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('shows validation errors for short password', async () => {
    render(<TestWrapper view="login" />);

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.blur(passwordInput);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/must be at least 6 characters/i)).toBeInTheDocument();
  });
});