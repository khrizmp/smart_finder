import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'your-secret-key-2024'; // In production, use environment variables
const DB_NAME = 'UserDB';
const STORE_NAME = 'users';

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Initialize the database
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'email' });
        store.createIndex('email', 'email', { unique: true });
      }
    };
  });
};

export const createUser = async (name, email, password) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const user = {
      name,
      email,
      password: encrypt(password),
      created_at: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.add(user);

      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => {
        if (request.error.name === 'ConstraintError') {
          resolve({ success: false, error: 'Email already exists' });
        } else {
          resolve({ success: false, error: 'Registration failed' });
        }
      };
    });
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Registration failed' };
  }
};

export const verifyUser = async (email, password) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(email);

      request.onsuccess = () => {
        const user = request.result;
        if (!user) {
          resolve({ success: false, error: 'User not found' });
          return;
        }

        try {
          const decryptedPassword = decrypt(user.password);
          if (decryptedPassword === password) {
            resolve({
              success: true,
              user: {
                name: user.name,
                email: user.email,
                created_at: user.created_at
              }
            });
          } else {
            resolve({ success: false, error: 'Invalid password' });
          }
        } catch (error) {
          resolve({ success: false, error: 'Authentication failed' });
        }
      };

      request.onerror = () => {
        resolve({ success: false, error: 'Authentication failed' });
      };
    });
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Authentication failed' };
  }
};

export const getUserByEmail = async (email) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(email);

      request.onsuccess = () => {
        const user = request.result;
        if (user) {
          // Don't send the password back
          const { password, ...userData } = user;
          resolve(userData);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
};

export const updatePassword = async (email, newPassword) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const getRequest = store.get(email);

      getRequest.onsuccess = () => {
        const user = getRequest.result;
        if (!user) {
          resolve({ success: false, error: 'User not found' });
          return;
        }

        user.password = encrypt(newPassword);
        const updateRequest = store.put(user);

        updateRequest.onsuccess = () => resolve({ success: true });
        updateRequest.onerror = () => resolve({ success: false, error: 'Password update failed' });
      };

      getRequest.onerror = () => resolve({ success: false, error: 'User not found' });
    });
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: 'Password update failed' };
  }
}; 