import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FormInput } from '../ui/FormInput';
import { Button, Card, VStack } from '../ui/Primitives';

const ErrorBanner = styled.div`
  padding: 12px 16px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.9rem;
`;

export const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const success = await signup(email, password, firstName || undefined, lastName || undefined);

    if (!success) {
      setError('An account with this email already exists or signup failed');
    } else {
      // Redirect to home page on successful signup
      navigate('/');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              sign in to your existing account
            </a>
          </p>
        </div>

        <Card>
          <VStack gap={3}>
            <h2 className="text-2xl font-bold text-center">Sign Up</h2>

            <form onSubmit={handleSubmit}>
              <VStack gap={3}>
                {error && <ErrorBanner>{error}</ErrorBanner>}

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="First Name"
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFirstName(e.target.value)
                    }
                    placeholder="First name (optional)"
                  />

                  <FormInput
                    label="Last Name"
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLastName(e.target.value)
                    }
                    placeholder="Last name (optional)"
                  />
                </div>

                <FormInput
                  label="Email address"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />

                <FormInput
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Enter your password (min 8 characters)"
                  minLength={8}
                />

                <FormInput
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm your password"
                />

                <div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </Button>
                </div>
              </VStack>
            </form>
          </VStack>
        </Card>
      </div>
    </div>
  );
};
