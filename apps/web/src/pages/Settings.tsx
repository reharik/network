import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { config } from '../config';
import { useUserService } from '../hooks';

type SettingsState = {
  reminderHour: string;
  tz: string;
  weeklyDigest: boolean;
  firstName: string;
  lastName: string;
  email: string;
};

export const Settings = () => {
  const { getMe, updateProfile } = useUserService();

  const [state, setState] = useState<SettingsState>({
    reminderHour: config.defaultReminderTime,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weeklyDigest: true,
    firstName: '',
    lastName: '',
    email: '',
  });

  // Fetch user data
  const { data: userResult } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
  });

  // Update mutation
  const updateProfileMut = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      alert('Profile updated successfully');
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

    // Update user profile
    updateProfileMut.mutate({
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.subtext};
`;

const Input = styled.input`
  background: #0a0d17;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.text};
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
