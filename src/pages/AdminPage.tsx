import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminLogin    from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';

/**
 * AdminPage — session guard using Firebase Auth.
 *
 * Three render states:
 *   checking (null)  → blank while Firebase resolves the persisted session
 *   unauthenticated  → shows AdminLogin
 *   authenticated    → shows AdminDashboard
 *
 * onAuthStateChanged fires immediately on mount with the cached user (if any),
 * so there is no need for a manual localStorage check. The session persists
 * across page reloads automatically via Firebase's IndexedDB persistence.
 */
export default function AdminPage() {
  const [user, setUser]       = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // null = logged out, User = logged in
    });
    return unsubscribe; // cleanup listener on unmount
  }, []);

  // Still resolving — render nothing to avoid flash of login screen
  if (user === undefined) return null;

  if (!user) {
    return <AdminLogin />;
  }

  const handleLogout = async () => {
    await signOut(auth);
    // onAuthStateChanged will fire with null and re-render to login automatically
  };

  return <AdminDashboard onLogout={handleLogout} />;
}
