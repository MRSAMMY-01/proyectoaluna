import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/data/products';

// ─── Firestore collection name ────────────────────────────────────────────────
// Used here and must match the Firestore Security Rules you configure.
export const FIRESTORE_COLLECTION = 'products';

interface ProductsContextValue {
  products:      Product[];
  loading:       boolean;
  error:         string | null;
  addProduct:    (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  // ── Real-time listener via onSnapshot ─────────────────────────────────────
  // Fires immediately with cached data (offline support) and again on any
  // remote change — no page reload needed for catalog to reflect admin changes.
  useEffect(() => {
    const q = query(
      collection(db, FIRESTORE_COLLECTION),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Product[] = snapshot.docs.map((d) => ({
          id:          d.id,
          name:        d.data().name        ?? '',
          price:       d.data().price       ?? 0,
          image:       d.data().image       ?? '',
          images:      d.data().images      ?? [],
          description: d.data().description ?? '',
          category:    d.data().category    ?? '',
        }));
        setProducts(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('[ProductsContext] Firestore error:', err);
        setError('No se pudo cargar el catálogo. Verifica tu conexión e intenta recargar la página.');
        setLoading(false);
      }
    );

    return unsubscribe; // detach listener on unmount
  }, []);

  // ── CRUD operations ───────────────────────────────────────────────────────
  // All mutations are async — callers (AdminDashboard) should await them.
  // onSnapshot will propagate the change to the catalog automatically.

  const addProduct = async (product: Omit<Product, 'id'>) => {
    await addDoc(collection(db, FIRESTORE_COLLECTION), {
      ...product,
      createdAt: serverTimestamp(),
    });
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    await updateDoc(doc(db, FIRESTORE_COLLECTION, id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, FIRESTORE_COLLECTION, id));
  };

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
