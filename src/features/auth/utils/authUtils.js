const SEQUENCE_KEY = 'rgSequences';
const CURRENT_AWAMU = 5;

export const getSequences = () => {
  const stored = localStorage.getItem(SEQUENCE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const saveSequences = (sequences) => {
  localStorage.setItem(SEQUENCE_KEY, JSON.stringify(sequences));
};

export const getNextSequence = (marhala, awamu = CURRENT_AWAMU) => {
  const sequences = getSequences();
  const key = `${marhala}.${awamu}`;
  const current = sequences[key] || 0;
  const next = current + 1;
  sequences[key] = next;
  saveSequences(sequences);
  return next;
};

export const generateRgNumber = (marhala, gender, awamu = CURRENT_AWAMU) => {
  const sequence = getNextSequence(marhala, awamu);
  return `${marhala}.${awamu}.${sequence}.${gender}`;
};

export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPassword = async (password, hashedPassword) => {
  const hashed = await hashPassword(password);
  return hashed === hashedPassword;
};

export const getGenderLabel = (code) => {
  return code === 'A' ? 'Mwanaume' : 'Mwanamke';
};

export const getRoleLabel = (marhala) => {
  return `student_m${marhala}`;
};