import { ContactMethod } from '@network/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { config } from '../config';
import { useToast } from '../contexts/ToastContext';
import { useUserService } from '../hooks';
import { PhoneInput } from '../ui/PhoneInput';

const SCHEDULE_OPTIONS = [
  { label: '1 week', value: 7 },
  { label: '2 weeks', value: 14 },
  { label: '3 weeks', value: 21 },
  { label: '4 weeks', value: 28 },
  { label: '6 weeks', value: 42 },
  { label: '8 weeks', value: 56 },
  { label: '12 weeks', value: 84 },
  { label: '~1 month', value: 30 },
  { label: '~2 months', value: 60 },
] as const;

type SettingsState = {
  reminderHour: string;
  tz: string;
  weeklyDigest: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dailyGoal: number;
  defaultContactMessage: string;
  defaultIntervalDays: number;
  defaultPreferredMethod: string;
};

export const Settings = () => {
  const qc = useQueryClient();
  const { showToast } = useToast();
  const { getMe, updateProfile } = useUserService();

  const [state, setState] = useState<SettingsState>({
    reminderHour: config.defaultReminderTime,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weeklyDigest: true,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dailyGoal: 3,
    defaultContactMessage: config.defaultContactMessage,
    defaultIntervalDays: config.defaultIntervalDays,
    defaultPreferredMethod: config.defaultPreferredMethod || 'email',
  });

  // Fetch user data
  const { data: userResult } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
  });

  // Update mutation
  const updateProfileMut = useMutation({
    mutationFn: updateProfile,
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: ['user'] });
        showToast('Profile updated successfully', 'success');
      } else {
        const message =
          result.errors?.[0]?.message ?? 'Profile could not be updated. Please try again.';
        showToast(message, 'error');
      }
    },
    onError: () => {
      showToast('Failed to update profile', 'error');
    },
  });

  // Update state when user data loads
  useEffect(() => {
    if (userResult?.success && userResult.data) {
      const user = userResult.data;
      setState((prev) => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dailyGoal: user.dailyGoal ?? 3,
        defaultContactMessage: user.defaultContactMessage ?? config.defaultContactMessage,
        defaultIntervalDays: user.defaultIntervalDays ?? config.defaultIntervalDays,
        defaultPreferredMethod:
          user.defaultPreferredMethod ?? config.defaultPreferredMethod ?? 'email',
      }));
    }
  }, [userResult]);

  // Load local settings
  useEffect(() => {
    const raw = localStorage.getItem('settings');
    if (raw) {
      try {
        const s = JSON.parse(raw);
        setState((old) => ({
          ...old,
          reminderHour: s.reminderHour ?? old.reminderHour,
          tz: s.tz ?? old.tz,
          weeklyDigest: typeof s.weeklyDigest === 'boolean' ? s.weeklyDigest : old.weeklyDigest,
        }));
      } catch (err: unknown) {
        console.log(`************err************`);
        console.log(err);
        console.log(`********END err************`);
      }
    }
  }, []);

  const onSave = () => {
    // Save local settings
    localStorage.setItem(
      'settings',
      JSON.stringify({
        reminderHour: state.reminderHour,
        tz: state.tz,
        weeklyDigest: state.weeklyDigest,
      }),
    );

    // Update user profile and reach-out defaults
    updateProfileMut.mutate({
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phone: state.phone || undefined,
      dailyGoal: state.dailyGoal,
      defaultContactMessage: state.defaultContactMessage || undefined,
      defaultIntervalDays: state.defaultIntervalDays,
      defaultPreferredMethod: state.defaultPreferredMethod || undefined,
    });
  };

  return (
    <Section>
      <h2>Settings</h2>

      <h3>Profile</h3>
      <Row>
        <Label htmlFor="firstName">First name</Label>
        <Input
          id="firstName"
          value={state.firstName}
          onChange={(e) => setState((s) => ({ ...s, firstName: e.target.value }))}
        />
      </Row>
      <Row>
        <Label htmlFor="lastName">Last name</Label>
        <Input
          id="lastName"
          value={state.lastName}
          onChange={(e) => setState((s) => ({ ...s, lastName: e.target.value }))}
        />
      </Row>
      <Row>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={state.email}
          onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
        />
      </Row>
      <Row>
        <Label htmlFor="phone">Phone</Label>
        <PhoneInputWrapper>
          <PhoneInput
            id="phone"
            value={state.phone}
            onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
          />
        </PhoneInputWrapper>
      </Row>

      <h3>Reach-out defaults</h3>
      <Description>
        These apply to new contacts and to the Today page when no custom message is set.
      </Description>
      <Row>
        <Label htmlFor="dailyGoal">Daily goal</Label>
        <Input
          id="dailyGoal"
          type="number"
          min={0}
          max={500}
          value={state.dailyGoal}
          onChange={(e) =>
            setState((s) => ({ ...s, dailyGoal: Math.max(0, parseInt(e.target.value, 10) || 0) }))
          }
        />
      </Row>
      <Row>
        <Label htmlFor="defaultContactMessage">Default suggested message</Label>
        <Textarea
          id="defaultContactMessage"
          value={state.defaultContactMessage}
          onChange={(e) => setState((s) => ({ ...s, defaultContactMessage: e.target.value }))}
          placeholder="Use {{firstName}} for personalization"
          rows={3}
        />
      </Row>
      <Row>
        <Label htmlFor="defaultIntervalDays">Default contact schedule</Label>
        <Select
          id="defaultIntervalDays"
          value={state.defaultIntervalDays}
          onChange={(e) =>
            setState((s) => ({ ...s, defaultIntervalDays: parseInt(e.target.value, 10) }))
          }
        >
          {SCHEDULE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </Row>
      <Row>
        <Label htmlFor="defaultPreferredMethod">Default contact method</Label>
        <Select
          id="defaultPreferredMethod"
          value={state.defaultPreferredMethod}
          onChange={(e) => setState((s) => ({ ...s, defaultPreferredMethod: e.target.value }))}
        >
          {ContactMethod.toOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Row>

      <h3>Preferences</h3>
      <Row>
        <Label htmlFor="reminderHour">Daily reminder time</Label>
        <Input
          id="reminderHour"
          type="time"
          value={state.reminderHour}
          onChange={(e) => setState((s) => ({ ...s, reminderHour: e.target.value }))}
        />
      </Row>
      <Row>
        <Label htmlFor="tz">Time zone</Label>
        <Input
          id="tz"
          value={state.tz}
          onChange={(e) => setState((s) => ({ ...s, tz: e.target.value }))}
        />
      </Row>
      <Row>
        <Label htmlFor="weeklyDigest">Weekly email digest</Label>
        <input
          id="weeklyDigest"
          type="checkbox"
          checked={state.weeklyDigest}
          onChange={(e) => setState((s) => ({ ...s, weeklyDigest: e.target.checked }))}
        />
      </Row>
      <Row>
        <Button onClick={onSave} disabled={updateProfileMut.isPending}>
          {updateProfileMut.isPending ? 'Saving...' : 'Save'}
        </Button>
      </Row>
    </Section>
  );
};

// Styled Components
const Section = styled.section`
  background: #0e1220;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 18px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  gap: 16px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.subtext};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.subtext};
  font-size: 0.9rem;
  margin: -8px 0 0;
  grid-column: 1 / -1;
`;

const Input = styled.input`
  background: #0a0d17;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.text};
  min-width: 260px;
`;

const Select = styled.select`
  background: #0a0d17;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.text};
  min-width: 260px;
`;

const Textarea = styled.textarea`
  background: #0a0d17;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.text};
  min-width: 260px;
  resize: vertical;
`;

const PhoneInputWrapper = styled.div`
  min-width: 260px;
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #0f1424;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;
