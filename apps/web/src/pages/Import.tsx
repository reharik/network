import { DragEvent, useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importContacts, type ImportRow } from '../services/contactService';
import { qk } from '../services/keys';

const Section = styled.section`
  background: #0e1220;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 16px;
`;
const DropZone = styled.label`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
`;
const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #0f1424;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

type CsvRow = Record<string, string>;

const parseCsv = (text: string): CsvRow[] => {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const rec: CsvRow = {};
    headers.forEach((h, i) => {
      rec[h] = (cells[i] ?? '').trim();
    });
    return rec;
  });
};

// map CSV -> ImportRow your API expects
const mapRow = (r: CsvRow): ImportRow => ({
  firstName: r.firstName,
  lastName: r.lastName,
  email: r.email || undefined,
  phone: r.phone || undefined,
  notes: r.notes || undefined,
  tags: r.tags
    ? r.tags
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
    : [],
});

export const ImportPage = () => {
  const qc = useQueryClient();
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const importMut = useMutation({
    mutationFn: (r: ImportRow[]) => importContacts(r),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.contacts });
      alert('Import complete');
    },
  });

  const onFile = async (file: File | null) => {
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    const parsed = parseCsv(text);
    setRows(parsed);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    void onFile(file ?? null);
  };

  const mapped = rows.map(mapRow);

  return (
    <Section>
      <h2>Import Contacts (CSV)</h2>
      <p>
        Headers: <code>firstName,lastName,email,phone,notes,tags</code> (use{' '}
        <code>|</code> to separate multiple tags)
      </p>

      <DropZone onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
        <input
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
        />
        Drag & drop CSV here, or click to select
      </DropZone>

      {fileName && (
        <div>
          <strong>Selected:</strong> {fileName} — {rows.length} rows parsed
        </div>
      )}

      <Button
        disabled={!rows.length || importMut.isPending}
        onClick={() => importMut.mutate(mapped)}
      >
        {importMut.isPending ? 'Importing…' : `Import ${rows.length} contacts`}
      </Button>
    </Section>
  );
};
