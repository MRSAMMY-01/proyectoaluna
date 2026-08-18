/**
 * seed-firestore.ts
 * Run ONCE to migrate the 6 mock products into Firestore.
 * After running, this file can be deleted or kept as documentation.
 *
 * Usage (from browser console while app is running and admin is logged in):
 *   import('./seed-firestore').then(m => m.seedProducts())
 *
 * Or import it temporarily in main.tsx, run once, then remove.
 */
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SEED_PRODUCTS } from '@/data/products';
import { FIRESTORE_COLLECTION } from '@/context/ProductsContext';

export async function seedProducts() {
  // Guard: skip if collection already has documents
  const existing = await getDocs(collection(db, FIRESTORE_COLLECTION));
  if (!existing.empty) {
    console.info(`[seed] Collection "${FIRESTORE_COLLECTION}" already has ${existing.size} docs. Skipping.`);
    return;
  }

  console.info('[seed] Seeding products to Firestore...');
  for (const product of SEED_PRODUCTS) {
    const { id: _id, ...data } = product; // strip local mock id — Firestore will auto-generate
    await addDoc(collection(db, FIRESTORE_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });
    console.info(`[seed] Added: ${data.name}`);
  }
  console.info('[seed] Done.');
}
