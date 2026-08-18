import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { Plus, Pencil, Trash2, X, LogOut, ShoppingBag, ArrowLeft, ImagePlus, Loader2, Upload } from 'lucide-react';
import { useProducts } from '@/context/ProductsContext';
import { type Product } from '@/data/products';

// ─── Cloudinary upload ───────────────────────────────────────────────────────
// Uses UNSIGNED upload preset — no API Secret involved.
// VITE_* vars are intentionally public (frontend-safe). Never add API Secret here.
const CLOUD_NAME   = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

const MAX_UPLOAD_BYTES = 280 * 1024; // 280 KB — tolerance margin above the 150KB compression target

/**
 * Uploads the ALREADY-COMPRESSED file to Cloudinary using an unsigned preset.
 * Receives EXCLUSIVELY the compressedFile produced by browser-image-compression.
 * The original (uncompressed) file must NEVER be passed here.
 *
 * TODO (cleanup): When this function is called with a new image for an existing
 * product, the OLD Cloudinary asset URL is orphaned. Implement a serverless/backend
 * function that accepts the old public_id and calls the Cloudinary Admin API
 * (authenticated server-side) to delete it — never expose the API Secret here.
 */
async function uploadImageToStorage(compressedFile: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Faltan variables de entorno: VITE_CLOUDINARY_CLOUD_NAME y/o VITE_CLOUDINARY_UPLOAD_PRESET'
    );
  }

  const formData = new FormData();
  formData.append('file', compressedFile);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cloudinary respondió con error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error('Cloudinary no devolvió secure_url. Respuesta inesperada.');
  }

  return data.secure_url as string;
}
// ─────────────────────────────────────────────────────────────────────────────

type CompressionInfo = {
  originalKB: number;
  compressedKB: number;
  reduction: number;
};

type FormState = {
  name: string;
  price: string;
  description: string;
  category: string;
  // imageFile: compressed WebP File ready for Cloudinary upload.
  // Lives only in React state — NEVER stored as a permanent URL anywhere.
  imageFile: File | null;
  previewUrl: string; // blob: URL for local preview only — revoked on cleanup
};

const emptyForm: FormState = {
  name: '',
  price: '',
  description: '',
  category: '',
  imageFile: null,
  previewUrl: '',
};

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.15,
  maxWidthOrHeight: 800,
  useWebWorker: true,
  fileType: 'image/webp' as const,
  initialQuality: 0.82,
};

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();

  const [showForm, setShowForm]           = useState(false);
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [form, setForm]                   = useState<FormState>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Compression state (selecting → processing)
  const [imgLoading, setImgLoading]           = useState(false);
  const [imgError, setImgError]               = useState('');
  const [compressionInfo, setCompressionInfo] = useState<CompressionInfo | null>(null);

  // Upload state (submit → Cloudinary)
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError]       = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort();

  // ── Memory management ─────────────────────────────────────────────────────
  const revokePreviousPreview = useCallback((url: string) => {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
  }, []);

  // ── Image compression handler ─────────────────────────────────────────────
  const handleImageFile = async (file: File) => {
    setImgError('');
    setUploadError('');
    setCompressionInfo(null);

    const isHeic =
      file.type === 'image/heic' ||
      file.type === 'image/heif' ||
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif');

    if (isHeic) {
      setImgError(
        'Formato HEIC no soportado. En tu iPhone ve a Configuración → Cámara → Formatos → "Más compatible" y saca la foto de nuevo.'
      );
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImgError('El archivo seleccionado no es una imagen válida. Por favor elige una foto.');
      return;
    }

    const originalKB = file.size / 1024;
    setImgLoading(true);

    try {
      // Compress — original `file` reference is immediately discarded after this
      const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);

      const compressedKB = compressedFile.size / 1024;
      const reduction    = (1 - compressedFile.size / file.size) * 100;

      revokePreviousPreview(form.previewUrl);
      const previewUrl = URL.createObjectURL(compressedFile);

      setForm((prev) => ({ ...prev, imageFile: compressedFile, previewUrl }));
      setCompressionInfo({ originalKB, compressedKB, reduction });
    } catch (err) {
      console.error('Compression error:', err);
      setImgError(
        'No se pudo procesar la imagen. Puede estar dañada o ser un formato no soportado. Intenta con otra foto.'
      );
    } finally {
      setImgLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    e.target.value = ''; // allow re-selecting same file
  };

  // ── Form lifecycle ────────────────────────────────────────────────────────
  const clearImageState = useCallback(() => {
    revokePreviousPreview(form.previewUrl);
    setImgError('');
    setUploadError('');
    setCompressionInfo(null);
    setImgLoading(false);
    setUploadingImage(false);
  }, [form.previewUrl, revokePreviousPreview]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setImgError('');
    setUploadError('');
    setCompressionInfo(null);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      price: String(p.price),
      description: p.description,
      category: p.category,
      imageFile: null,
      previewUrl: p.image, // existing remote URL — not a blob
    });
    setEditingId(p.id);
    setShowForm(true);
    setImgError('');
    setUploadError('');
    setCompressionInfo(null);
  };

  const closeForm = () => {
    clearImageState();
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ── Submit (async) ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(form.price);
    if (!form.name.trim() || !form.price.trim() || isNaN(priceNum) || priceNum < 0) return;

    setUploadError('');

    let imageUrl: string;

    // ── Determine final image URL based on 4 cases ────────────────────────
    if (form.imageFile) {
      // Cases A & D: new file selected (new product OR editing with new photo)

      // Pre-upload validation: enforce 150 KB hard limit as second protection
      if (form.imageFile.size > MAX_UPLOAD_BYTES) {
        setUploadError(
          `La imagen comprimida pesa ${Math.round(form.imageFile.size / 1024)} KB y supera el límite de 150 KB. ` +
          'Selecciona otra foto o intenta con una imagen más pequeña.'
        );
        return;
      }

      setUploadingImage(true);
      try {
        // Upload ONLY the compressed File — never the original
        imageUrl = await uploadImageToStorage(form.imageFile);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setUploadError(`No se pudo subir la imagen: ${msg}. El producto no fue guardado. Intenta de nuevo.`);
        setUploadingImage(false);
        // Do NOT save the product — form state is preserved for retry
        return;
      } finally {
        setUploadingImage(false);
      }

    } else if (editingId && !form.imageFile) {
      // Case C: editing without selecting a new photo — keep existing remote URL
      imageUrl = form.previewUrl;

    } else {
      // Case B: new product with no photo selected
      // Fallback placeholder — exceptional safety net only, not normal behavior.
      // IMPORTANT: blob: URLs are NEVER used here — only the remote placeholder.
      console.warn(
        '[AdminDashboard] Saving product without an image. ' +
        'Placeholder used as exceptional fallback. ' +
        'Connect uploadImageToStorage() to avoid this.'
      );
      imageUrl =
        'https://images.pexels.com/photos/8693642/pexels-photo-8693642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
    }

    const payload = {
      name:        form.name.trim(),
      price:       priceNum,
      image:       imageUrl,
      images:      [imageUrl],
      description: form.description.trim(),
      category:    form.category.trim() || 'General',
    };

    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await addProduct(payload);
    }
    closeForm();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setConfirmDelete(null);
  };

  const handleLogout = () => {
    // signOut() is called in AdminPage via Firebase auth
    onLogout();
  };

  const formatKB = (kb: number) =>
    kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;

  const isBusy = imgLoading || uploadingImage;

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Top bar */}
      <header className="bg-white border-b border-pink-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-pink-400 flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div className="leading-none">
              <p className="font-playfair font-bold text-lg text-rose-900"
                 style={{ fontFamily: "'Playfair Display', serif" }}>Aluna</p>
              <p className="text-[10px] tracking-[0.18em] text-pink-400 uppercase">Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-pink-400 hover:text-pink-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-pink-50 transition-all">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Ver tienda</span>
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-rose-700 hover:text-red-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-red-50 transition-all">
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-rose-900"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Gestión de Productos
            </h1>
            <p className="text-rose-700/60 text-sm mt-1">
              {products.length} {products.length === 1 ? 'producto' : 'productos'} en tu catálogo
            </p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 bg-pink-400 hover:bg-pink-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
            <Plus size={16} /> Agregar
          </button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
            <p className="text-rose-700/60">No hay productos. Agrega el primero con el botón "Agregar".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden flex flex-col">
                <div className="relative h-44 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-pink-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {p.category}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-playfair font-semibold text-rose-900 leading-snug">{p.name}</h3>
                  <p className="text-rose-700/60 text-xs mt-1 line-clamp-2 flex-grow">{p.description}</p>
                  <p className="text-lg font-bold text-pink-500 mt-2">${p.price.toLocaleString('es-CL')}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => openEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-pink-500 hover:text-white border border-pink-200 hover:bg-pink-400 text-sm font-medium py-2 rounded-xl transition-all">
                      <Pencil size={14} /> Editar
                    </button>
                    <button onClick={() => setConfirmDelete(p.id)} aria-label="Eliminar producto"
                      className="flex items-center justify-center gap-1.5 text-red-500 hover:text-white border border-red-200 hover:bg-red-500 text-sm font-medium py-2 px-3 rounded-xl transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Modal: Add / Edit ─────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/40 backdrop-blur-sm animate-fade-up"
             onClick={closeForm}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between p-5 border-b border-pink-100 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="font-playfair text-xl font-bold text-rose-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                {editingId ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button onClick={closeForm} aria-label="Cerrar" disabled={isBusy}
                className="text-rose-700/60 hover:text-rose-900 p-1.5 rounded-lg hover:bg-pink-50 transition-colors disabled:opacity-40">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-rose-900 mb-1.5">Nombre del producto</label>
                <input type="text" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Vestido floral de verano"
                  className="w-full bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
              </div>

              {/* Precio + Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-rose-900 mb-1.5">Precio (CLP)</label>
                  <input type="number" value={form.price} required min="0"
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="24990"
                    className="w-full bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-rose-900 mb-1.5">Categoría</label>
                  <input type="text" list="category-suggestions"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Ej: Vestidos"
                    className="w-full bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all" />
                  <datalist id="category-suggestions">
                    {existingCategories.map((cat) => <option key={cat} value={cat} />)}
                  </datalist>
                </div>
              </div>

              {/* Imagen */}
              <div>
                <label className="block text-sm font-medium text-rose-900 mb-1.5">Imagen del producto</label>

                <input ref={fileInputRef} type="file" accept="image/*" capture="environment"
                  className="hidden" onChange={handleFileChange} />

                {/* Trigger button — disabled during compression OR upload */}
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-pink-200 hover:border-pink-400 bg-pink-50 hover:bg-pink-50/80 text-pink-400 hover:text-pink-600 font-medium text-sm py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {imgLoading
                    ? <><Loader2 size={18} className="animate-spin" /> Procesando imagen...</>
                    : <><ImagePlus size={18} /> {form.previewUrl ? 'Cambiar imagen' : 'Seleccionar foto'}</>
                  }
                </button>

                {/* Compression error */}
                {imgError && (
                  <p className="mt-2 text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2 leading-relaxed">
                    {imgError}
                  </p>
                )}

                {/* Upload error — displayed below image section */}
                {uploadError && (
                  <p className="mt-2 text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2 leading-relaxed">
                    {uploadError}
                  </p>
                )}

                {/* Compression stats */}
                {compressionInfo && (
                  <p className="mt-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 font-medium">
                    ✓ {formatKB(compressionInfo.originalKB)} → {formatKB(compressionInfo.compressedKB)}{' '}
                    <span className="text-emerald-500">({compressionInfo.reduction.toFixed(1)}% menos)</span>
                  </p>
                )}

                {/* Local preview (blob: URL — never stored permanently) */}
                {form.previewUrl && !imgLoading && (
                  <img src={form.previewUrl} alt="Vista previa"
                    className="mt-3 w-full h-44 object-cover rounded-xl border border-pink-100"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-rose-900 mb-1.5">Descripción</label>
                <textarea value={form.description} rows={3}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Breve descripción del producto..."
                  className="w-full bg-pink-50 border border-pink-200 rounded-xl px-4 py-3 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} disabled={isBusy}
                  className="flex-1 border border-pink-200 text-rose-700 hover:bg-pink-50 font-semibold py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  Cancelar
                </button>
                <button type="submit" disabled={isBusy}
                  className="flex-1 bg-pink-400 hover:bg-pink-500 disabled:bg-pink-200 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                  {uploadingImage
                    ? <><Loader2 size={16} className="animate-spin" /> Subiendo imagen...</>
                    : editingId ? 'Guardar cambios' : 'Agregar producto'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Confirm delete ──────────────────────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/40 backdrop-blur-sm animate-fade-up"
             onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
               onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={26} className="text-red-500" />
            </div>
            <h3 className="font-playfair text-xl font-bold text-rose-900 mb-2">¿Eliminar producto?</h3>
            <p className="text-rose-700/60 text-sm mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-pink-200 text-rose-700 hover:bg-pink-50 font-semibold py-2.5 rounded-xl transition-all">
                Cancelar
              </button>
              <button onClick={() => handleDelete(confirmDelete)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-all shadow-sm">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



