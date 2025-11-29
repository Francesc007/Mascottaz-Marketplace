"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  ArrowLeft,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon
} from "lucide-react";
import StorageService from "../../../lib/storage";
import Footer from "../../../components/Footer";

export default function SellerProductsPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [categories] = useState(["Alimentos", "Juguetes", "Accesorios", "Higiene", "Servicios"]);
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    subcategoria: "",
    stock: "",
    imagen: "",
    activo: true
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    loadProducts();
  }, [supabase]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/seller/login");
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id_vendedor", user.id)
        .order("fecha_creacion", { ascending: false });

      if (error) {
        console.error("Error cargando productos:", error);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError("Por favor selecciona un archivo de imagen válido");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe exceder 5MB");
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setFormError("Por favor selecciona una imagen");
      return;
    }

    setUploadingImage(true);
    setFormError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFormError("No estás autenticado");
        return;
      }

      const result = await StorageService.uploadImage(imageFile, user.id, 'products');

      if (result.success) {
        setFormData({ ...formData, imagen: result.url });
        setFormSuccess("Imagen subida exitosamente");
        setTimeout(() => setFormSuccess(""), 3000);
      } else {
        setFormError(result.error || "Error al subir la imagen");
      }
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      setFormError("Error al subir la imagen. Intenta de nuevo.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setFormError("No estás autenticado");
        return;
      }

      const productData = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        categoria: formData.categoria || null,
        subcategoria: formData.subcategoria || null,
        stock: parseInt(formData.stock) || 0,
        imagen: formData.imagen || null,
        id_vendedor: user.id,
        activo: formData.activo
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        setFormSuccess("Producto actualizado exitosamente");
      } else {
        // Validar límite de 10 productos (MVP)
        const { data: existingProducts } = await supabase
          .from("products")
          .select("id")
          .eq("id_vendedor", user.id);

        if (existingProducts && existingProducts.length >= 10) {
          setFormError("Has alcanzado el límite de 10 productos para el MVP. Elimina un producto existente para agregar uno nuevo.");
          setUploading(false);
          return;
        }

        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;
        setFormSuccess("Producto creado exitosamente");
      }

      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        subcategoria: "",
        stock: "",
        imagen: "",
        activo: true
      });
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview("");
      setShowForm(false);
      
      await loadProducts();
      setTimeout(() => setFormSuccess(""), 3000);
    } catch (err) {
      console.error("Error guardando producto:", err);
      setFormError(err.message || "Error al guardar el producto");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      precio: product.precio?.toString() || "",
      categoria: product.categoria || "",
      subcategoria: product.subcategoria || "",
      stock: product.stock?.toString() || "",
      imagen: product.imagen || "",
      activo: product.activo !== false
    });
    setImageFile(null);
    setImagePreview(product.imagen || "");
    setShowForm(true);
    setFormError("");
    setFormSuccess("");
  };

  const handleDelete = async (productId) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;
      await loadProducts();
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("Error al eliminar el producto");
    }
  };

  const toggleProductStatus = async (product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ activo: !product.activo })
        .eq("id", product.id);

      if (error) throw error;
      await loadProducts();
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fffaf0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fffaf0' }}>
      <header className="shadow-sm" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-screen-2xl mx-auto px-2 md:px-4">
          <div className="flex flex-col items-center py-4">
            <div className="flex items-center justify-center mb-4">
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/MASCOTTAZ.png"
                  alt="Mascottaz logo"
                  width={300}
                  height={100}
                  className="h-[90px] w-[300px] object-contain"
                  priority
                />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="w-full flex items-center justify-between py-3 px-8" style={{ backgroundColor: 'var(--interaction-blue)' }}>
          <div className="max-w-screen-2xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/seller/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                <Package className="w-6 h-6" style={{ color: 'var(--brand-blue)' }} />
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)' }}>
                Productos
              </h1>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingProduct(null);
                setFormData({
                  nombre: "",
                  descripcion: "",
                  precio: "",
                  categoria: "",
                  subcategoria: "",
                  stock: "",
                  imagen: "",
                  activo: true
                });
                setImageFile(null);
                setImagePreview("");
                setFormError("");
                setFormSuccess("");
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Producto</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-2 md:px-4 py-8">
        {formError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 text-sm">{formError}</p>
          </div>
        )}

        {formSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-green-800 text-sm">{formSuccess}</p>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Formulario de producto */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--brand-blue)' }}>
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  setFormData({
                    nombre: "",
                    descripcion: "",
                    precio: "",
                    categoria: "",
                    subcategoria: "",
                    stock: "",
                    imagen: "",
                    activo: true
                  });
                  setImageFile(null);
                  setImagePreview("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Alimento Premium para Perros"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    required
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe tu producto..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategoría
                  </label>
                  <input
                    type="text"
                    value={formData.subcategoria}
                    onChange={(e) => setFormData({ ...formData, subcategoria: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Alimento seco"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen del Producto
                  </label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-300">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
                        <ImageIcon className="w-5 h-5" />
                        <span>Seleccionar Imagen</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                      {imageFile && (
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={uploadingImage}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Upload className="w-5 h-5" />
                          {uploadingImage ? "Subiendo..." : "Subir Imagen"}
                        </button>
                      )}
                      {formData.imagen && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, imagen: "" });
                            setImagePreview("");
                            setImageFile(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <X className="w-5 h-5" />
                          Eliminar
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="O ingresa una URL de imagen"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Producto activo (visible para compradores)</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? "Guardando..." : editingProduct ? "Actualizar Producto" : "Crear Producto"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de productos */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--brand-blue)' }}>
              Mis Productos ({filteredProducts.length})
            </h3>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No tienes productos aún</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Agregar Primer Producto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
                      {product.imagen ? (
                        <Image
                          src={product.imagen}
                          alt={product.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                        product.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg mb-1">{product.nombre}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.descripcion}</p>
                    <p className="text-xl font-bold mb-4" style={{ color: 'var(--brand-blue)' }}>
                      ${product.precio?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => toggleProductStatus(product)}
                        className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title={product.activo ? "Desactivar" : "Activar"}
                      >
                        {product.activo ? "Ocultar" : "Mostrar"}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
