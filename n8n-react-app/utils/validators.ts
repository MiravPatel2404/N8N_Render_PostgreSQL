export const isValidId = (id: any): boolean => {
  return id !== null && id !== undefined && String(id).trim().length > 0;
};

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return input;
  // Basic trim and prevention of simple script injection patterns if rendered dangerously
  // Note: React escapes HTML by default, so this is mostly for data cleanliness.
  return input.trim();
};

export const validateRowData = (data: Record<string, any>): string | null => {
  if (!data) return "Data object is missing.";
  const keys = Object.keys(data);
  if (keys.length === 0) return "At least one field is required.";
  
  // Example: Check if all values are strings or numbers (simple validation)
  for (const key of keys) {
    if (key === 'id') continue; // ID might be auto-generated or validated separately
    if (data[key] === undefined || data[key] === null) {
      return `Field '${key}' cannot be null.`;
    }
  }
  return null;
};
