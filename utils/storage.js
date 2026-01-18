import Cookies from 'js-cookie';

const DB_KEY = 'schedule_manager_v2';
const THEME_KEY = 'schedule_theme_pref'; // Key mới cho theme
const COOKIE_EXPIRY = 400;

const defaultTable = {
  id: 'default',
  name: 'Học kỳ 1',
  year: '2024 - 2025',
  data: {},
  config: {
    maxPeriods: 10,
    breaks: [{ after: 5, label: '==== NGHỈ TRƯA ====' }]
  }
};

// --- DATA LOGIC ---
export const getStorage = () => {
  const raw = Cookies.get(DB_KEY);
  if (!raw) {
    // Migrate code cũ (như bài trước)
    const oldData = Cookies.get('user_schedule_data');
    if (oldData) {
      try {
        const migrated = {
          activeId: 'default',
          tables: { default: { ...defaultTable, data: JSON.parse(oldData) } }
        };
        saveStorage(migrated);
        return migrated;
      } catch (e) {}
    }
    return { activeId: 'default', tables: { default: defaultTable } };
  }
  return JSON.parse(raw);
};

export const saveStorage = (data) => {
  Cookies.set(DB_KEY, JSON.stringify(data), { expires: COOKIE_EXPIRY });
};

// --- THEME LOGIC ---
export const getTheme = () => {
  return Cookies.get(THEME_KEY) || 'light';
};

export const saveTheme = (theme) => {
  Cookies.set(THEME_KEY, theme, { expires: COOKIE_EXPIRY });
};