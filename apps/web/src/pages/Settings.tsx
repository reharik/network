import { useEffect, useState } from 'react';
import styled from 'styled-components';

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

type SettingsState = {
  reminderHour: string;
  tz: string;
  weeklyDigest: boolean;
};

export const Settings = () => {
  const [state, setState] = useState<SettingsState>({
    reminderHour: '09:00',
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weeklyDigest: true,
  });

  useEffect(() => {
    const raw = localStorage.getItem('settings');
    if (raw) {
      try {
        const s = JSON.parse(raw);
        setState((old) => ({
          reminderHour: s.reminderHour ?? old.reminderHour,
          tz: s.tz ?? old.tz,
          weeklyDigest:
            typeof s.weeklyDigest === 'boolean'
              ? s.weeklyDigest
              : old.weeklyDigest,
        }));
      } catch (err: unknown) {
        console.log(`************err************`);
        console.log(err);
        console.log(`********END err************`);
      }
    }
  }, []);

  const onSave = () => {
    localStorage.setItem('settings', JSON.stringify(state));
    alert('Settings saved');
  };

  return (
    <Section>
      <h2>Settings</h2>
      <Row>
        <Label htmlFor="reminderHour">Daily reminder time</Label>
        <Input
          id="reminderHour"
          type="time"
          value={state.reminderHour}
          onChange={(e) =>
            setState((s) => ({ ...s, reminderHour: e.target.value }))
          }
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
          onChange={(e) =>
            setState((s) => ({ ...s, weeklyDigest: e.target.checked }))
          }
        />
      </Row>
      <Row>
        <Button onClick={onSave}>Save</Button>
      </Row>
    </Section>
  );
};
