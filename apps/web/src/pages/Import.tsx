import { ImportContactsDTO } from '@network/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DragEvent, useState } from 'react';
import styled from 'styled-components';
import { useToast } from '../contexts/ToastContext';
import { useContactListService, useContactService } from '../hooks';
import { qk } from '../services/keys';

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

const parseVCard = (text: string): CsvRow[] => {
  const vcards = text.split('BEGIN:VCARD').filter(Boolean);
  return vcards.map((vcard) => {
    const lines = vcard.split(/\r?\n/).filter(Boolean);
    const rec: CsvRow = {};

    lines.forEach((line) => {
      if (line.startsWith('FN:')) {
        // Full name
        const fullName = line.substring(3).trim();
        const nameParts = fullName.split(' ');
        rec['Given Name'] = nameParts[0] || '';
        rec['Family Name'] = nameParts.slice(1).join(' ') || '';
      } else if (line.startsWith('N:')) {
        // Structured name (Last;First;Middle;Prefix;Suffix)
        const nameParts = line.substring(2).split(';');
        rec['Family Name'] = nameParts[0] || '';
        rec['Given Name'] = nameParts[1] || '';
      } else if (line.startsWith('TEL') || line.includes('.TEL')) {
        // Phone number (handles both TEL and item1.TEL formats)
        const phone = line.split(':')[1]?.trim();
        if (phone) {
          rec['Phone 1 - Value'] = phone;
        }
      } else if (line.startsWith('EMAIL') || line.includes('.EMAIL')) {
        // Email (handles both EMAIL and item1.EMAIL formats)
        const email = line.split(':')[1]?.trim();
        if (email) {
          rec['E-mail 1 - Value'] = email;
        }
      } else if (line.startsWith('ORG:')) {
        // Organization
        const org = line.substring(4).trim();
        if (org) {
          rec['Notes'] = `Organization: ${org}`;
        }
      } else if (line.startsWith('CATEGORIES:')) {
        // Categories/tags
        const categories = line.substring(11).trim();
        if (categories) {
          rec['Tags'] = categories;
        }
      }
    });

    return rec;
  });
};

// map CSV -> ImportRow your API expects
const mapRow = (r: CsvRow): ImportContactsDTO => {
  // Handle Google Takeout format
  const firstName = r['Given Name'] || r['First Name'] || r.firstName || '';
  const lastName = r['Family Name'] || r['Last Name'] || r.lastName || '';
  const email = r['E-mail 1 - Value'] || r['Email'] || r.email || undefined;
  const phone = r['Phone 1 - Value'] || r['Phone'] || r.phone || undefined;
  const notes = r['Notes'] || r.notes || undefined;

  // Handle tags - could be from various fields
  const tags = r.tags || r['Tags'] || r['Groups'] || '';

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email?.trim() || undefined,
    phone: phone?.trim() || undefined,
    notes: notes?.trim() || undefined,
    tags: tags || undefined,
  };
};

export const ImportPage = () => {
  const qc = useQueryClient();
  const { showToast } = useToast();
  const { importContacts } = useContactService();
  const { fetchContacts } = useContactListService();
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [filterText, setFilterText] = useState<string>('');
  const [duplicateRows, setDuplicateRows] = useState<Set<number>>(new Set());
  // Auto-filter contacts - no user controls needed

  const importMut = useMutation({
    mutationFn: (r: ImportContactsDTO[]) => importContacts(r),
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: qk.contacts });
        showToast('Import complete', 'success');
      } else {
        showToast('Failed to import contacts', 'error');
      }
    },
    onError: () => {
      showToast('Failed to import contacts', 'error');
    },
  });

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();

    // Detect file format and parse accordingly
    const parsed = text.includes('BEGIN:VCARD') ? parseVCard(text) : parseCsv(text);
    setRows(parsed);

    // Normalize for duplicate matching: canonical name (first+last, ignore empty) and contact method
    const canonicalName = (first: string | undefined, last: string | undefined) =>
      [first, last]
        .map((s) => (s ?? '').trim())
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    const norm = (s: string | undefined) => (s ?? '').trim().toLowerCase();
    const sameContactMethod = (
      aEmail: string | undefined,
      aPhone: string | undefined,
      bEmail: string | undefined,
      bPhone: string | undefined,
    ) => {
      if (aEmail && bEmail && norm(aEmail) === norm(bEmail)) return true;
      if (aPhone && bPhone && norm(aPhone) === norm(bPhone)) return true;
      return false;
    };

    const duplicateIndices = new Set<number>();
    const seenInFile = new Set<string>();

    try {
      const existingContactsResponse = await fetchContacts();
      if (!existingContactsResponse.success) {
        throw new Error(
          'Failed to fetch existing contacts: ' + existingContactsResponse.errors.join(', '),
        );
      }
      const existingContacts = existingContactsResponse.data.contacts as Array<{
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
      }>;

      parsed.forEach((row, index) => {
        const mapped = mapRow(row);
        const nameCanon = canonicalName(mapped.firstName, mapped.lastName);
        const fileKey = `${nameCanon}|${norm(mapped.email ?? '')}|${norm(mapped.phone ?? '')}`;

        // Within-file duplicate: same name + same email/phone already seen in this file
        if (seenInFile.has(fileKey)) {
          duplicateIndices.add(index);
          return;
        }
        seenInFile.add(fileKey);

        // Duplicate of an existing contact: same canonical name + same contact method
        const isDup = existingContacts.some(
          (contact) =>
            canonicalName(contact.firstName, contact.lastName) === nameCanon &&
            sameContactMethod(
              mapped.email,
              mapped.phone,
              contact.email,
              contact.phone,
            ),
        );
        if (isDup) {
          duplicateIndices.add(index);
        }
      });
    } catch (error) {
      console.error('Error checking for duplicates:', error);
    }
    setDuplicateRows(duplicateIndices);

    // Auto-select all valid contacts initially (excluding duplicates)
    const validIndices = new Set<number>();
    const hasAnyName = (r: ImportContactsDTO) =>
      (r.firstName?.trim() ?? '') !== '' || (r.lastName?.trim() ?? '') !== '';
    parsed.forEach((row, index) => {
      const mapped = mapRow(row);
      const hasContactMethod = mapped.email || mapped.phone;
      const isDuplicate = duplicateIndices.has(index);

      if (hasAnyName(mapped) && hasContactMethod && !isDuplicate) {
        validIndices.add(index);
      }
    });
    setSelectedRows(validIndices);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    void onFile(file ?? undefined);
  };

  const hasAnyName = (row: ImportContactsDTO) => (row.firstName?.trim() ?? '') !== '' || (row.lastName?.trim() ?? '') !== '';
  const mapped = rows.map(mapRow).filter(hasAnyName);

  // Filter contacts based on various criteria
  const filteredRows = rows.filter((row, index) => {
    const mapped = mapRow(row);

    // Auto-filter: Must have at least one name (first or last) AND contact method
    const hasName = hasAnyName(mapped);
    const hasContactMethod = mapped.email || mapped.phone;

    if (!hasName || !hasContactMethod) {
      return false;
    }

    // Auto-filter duplicates
    if (duplicateRows.has(index)) {
      return false;
    }

    // Auto-filter obvious spam patterns
    const email = mapped.email?.toLowerCase() || '';

    // Only filter very obvious spam patterns
    if (
      email.includes('@sale.craigslist') ||
      email.includes('@reply.craigslist') ||
      email.includes('noreply@') ||
      email.includes('no-reply@')
    ) {
      return false;
    }

    // Text search filter
    if (filterText) {
      const searchText =
        `${mapped.firstName} ${mapped.lastName} ${mapped.email || ''} ${mapped.phone || ''}`.toLowerCase();
      return searchText.includes(filterText.toLowerCase());
    }

    return true;
  });

  // Get selected contacts for import
  const selectedContacts = filteredRows
    .map((row, filteredIndex) => {
      const originalIndex = rows.indexOf(row);
      return { row, originalIndex };
    })
    .filter(({ originalIndex }) => selectedRows.has(originalIndex))
    .map(({ row }) => mapRow(row))
    .filter(hasAnyName);

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const selectAll = () => {
    const allValidIndices = new Set<number>();
    filteredRows.forEach((row, filteredIndex) => {
      const originalIndex = rows.indexOf(row);
      const mapped = mapRow(row);
      if (hasAnyName(mapped)) {
        allValidIndices.add(originalIndex);
      }
    });
    setSelectedRows(allValidIndices);
  };

  const selectNone = () => {
    setSelectedRows(new Set());
  };

  return (
    <Section>
      <h2>Import Contacts</h2>
      <p>
        Supports Google Takeout vCard (.vcf) files and CSV files.
        <br />
        <strong>Google Takeout:</strong> Upload the .vcf file directly
        <br />
        <strong>CSV format:</strong> Headers like{' '}
        <code>Given Name, Family Name, E-mail 1 - Value, Phone 1 - Value, Notes</code>
        <br />
        <strong>Custom CSV:</strong> <code>firstName,lastName,email,phone,notes,tags</code> (use{' '}
        <code>|</code> to separate multiple tags)
      </p>

      <DropZone onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
        <input
          type="file"
          accept=".csv,.vcf,text/csv,text/vcard"
          style={{ display: 'none' }}
          onChange={(e) => void onFile(e.target.files?.[0] ?? undefined)}
        />
        Drag & drop vCard (.vcf) or CSV file here, or click to select
      </DropZone>

      {fileName && (
        <div>
          <strong>Selected:</strong> {fileName} — {rows.length} rows parsed, {mapped.length} valid
          contacts
          {rows.length > filteredRows.length && (
            <span style={{ color: '#666' }}>
              {' '}
              ({rows.length - filteredRows.length} hidden: {duplicateRows.size} duplicates,{' '}
              {rows.length - filteredRows.length - duplicateRows.size} incomplete/spam)
            </span>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div>
            <FilterInput
              type="text"
              placeholder="Filter contacts by name, email, or phone..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <Button onClick={selectAll}>Select All</Button>
            <Button onClick={selectNone}>Select None</Button>
            <div style={{ marginLeft: 'auto', color: '#666' }}>
              {selectedContacts.length} of {filteredRows.length} selected
            </div>
          </div>

          <ContactList>
            {filteredRows.map((row, filteredIndex) => {
              const originalIndex = rows.indexOf(row);
              const mapped = mapRow(row);
              const isSelected = selectedRows.has(originalIndex);
              const isValid = hasAnyName(mapped);

              if (!isValid) return undefined;

              return (
                <ContactItem
                  key={originalIndex}
                  selected={isSelected}
                  onClick={() => toggleSelection(originalIndex)}
                >
                  <Checkbox
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelection(originalIndex)}
                  />
                  <ContactInfo>
                    <ContactName>
                      {[mapped.firstName, mapped.lastName].filter(Boolean).join(' ').trim() || '—'}
                    </ContactName>
                    <ContactDetails>
                      {mapped.email && <div>📧 {mapped.email}</div>}
                      {mapped.phone && <div>📞 {mapped.phone}</div>}
                      {mapped.notes && <div>📝 {mapped.notes}</div>}
                    </ContactDetails>
                  </ContactInfo>
                </ContactItem>
              );
            })}
          </ContactList>
        </>
      )}

      <Button
        disabled={!selectedContacts.length || importMut.isPending}
        onClick={() => importMut.mutate(selectedContacts)}
      >
        {importMut.isPending ? 'Importing…' : `Import ${selectedContacts.length} selected contacts`}
      </Button>
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

const FilterInput = styled.input`
  background: #0a0d17;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  margin-bottom: 16px;
`;

const ContactList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: #0a0d17;
`;

const ContactItem = styled.div<{ selected: boolean }>`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ selected }) => (selected ? '#1a2332' : 'transparent')};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: #1a2332;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input`
  margin: 0;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const ContactDetails = styled.div`
  font-size: 0.9em;
  color: ${({ theme }) => theme.colors.subtext};
  margin-top: 2px;
`;
