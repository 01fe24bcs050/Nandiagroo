import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Palette,
  Plus,
  Trash2,
  Check,
  X,
  Save,
  RefreshCw,
  ArrowLeft,
  Edit3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultColors = {
  darkGreen: '#6FB381',
  lightGreen: '#6FB381',
  golden: '#6FB381',
  textPrimary: '#000000',
  textSecondary: '#000000',
  bgColor: '#EDEDED',
  bodyBg: '#EDEDED',
};

const colorLabels = {
  darkGreen: 'Primary Brand Green',
  lightGreen: 'Light Green',
  golden: 'Gold Accent',
  textPrimary: 'Primary Text',
  textSecondary: 'Secondary Text',
  bgColor: 'Page Background',
  bodyBg: 'Body Background',
};

export default function AdminTheme() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTheme, setEditingTheme] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    colors: { ...defaultColors },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchThemes();
  }, [user, navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchThemes = async () => {
    try {
      const response = await fetch(`${API_URL}/themes`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch themes');
      const data = await response.json();
      setThemes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/themes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create theme');
      await fetchThemes();
      setIsCreating(false);
      setFormData({ name: '', colors: { ...defaultColors } });
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/themes/${editingTheme._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          name: formData.name,
          colors: formData.colors,
        }),
      });
      if (!response.ok) throw new Error('Failed to update theme');
      await fetchThemes();
      setEditingTheme(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this theme?')) return;
    try {
      const response = await fetch(`${API_URL}/themes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete theme');
      await fetchThemes();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`${API_URL}/themes/${id}/activate`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to activate theme');
      await fetchThemes();
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const startEdit = (theme) => {
    setEditingTheme(theme);
    setFormData({
      name: theme.name,
      colors: { ...(theme.colors || defaultColors) },
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingTheme(null);
    setFormData({ name: '', colors: { ...defaultColors } });
  };

  const updateColor = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const applyPreview = () => {
    const root = document.documentElement;
    Object.entries(formData.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`, value);
    });
  };

  const resetPreview = () => {
    window.location.reload();
  };

  const ColorInput = ({ label, colorKey, value }) => (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => updateColor(colorKey, e.target.value)}
        className="w-10 h-10 rounded-lg border-2 border-darkGreen cursor-pointer"
      />
      <div className="flex-1">
        <p className="text-textPrimary text-sm font-medium">{label}</p>
        <p className="text-textSecondary text-xs font-mono">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 rounded-lg hover:bg-darkGreen hover:bg-opacity-20 transition-colors"
          >
            <ArrowLeft size={20} className="text-textPrimary" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary flex items-center gap-2">
              <Palette size={28} className="text-golden" />
              Theme Manager
            </h1>
            <p className="text-textSecondary text-sm mt-1">
              Create, edit, and manage color themes
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90 transition-all"
        >
          <Plus size={18} />
          New Theme
        </motion.button>
      </div>

      {/* Create / Edit Form */}
      {(isCreating || editingTheme) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-6 sm:p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-textPrimary">
              {isCreating ? 'Create New Theme' : 'Edit Theme'}
            </h2>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingTheme(null);
              }}
              className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-colors"
            >
              <X size={20} className="text-red-500" />
            </button>
          </div>

          <form onSubmit={isCreating ? handleCreate : handleUpdate} className="space-y-6">
            <div>
              <label className="block text-textPrimary text-sm font-medium mb-2">
                Theme Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-4 py-2 bg-gray-100 border border-darkGreen border-opacity-30 rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:border-darkGreen focus:ring-2 focus:ring-darkGreen focus:ring-opacity-20"
                placeholder="e.g., Forest Green, Dark Mode"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(colorLabels).map(([key, label]) => (
                <ColorInput
                  key={key}
                  label={label}
                  colorKey={key}
                  value={formData.colors[key] || defaultColors[key]}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2 bg-golden text-darkGreen rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : isCreating ? 'Create Theme' : 'Update Theme'}
              </button>
              <button
                type="button"
                onClick={applyPreview}
                className="inline-flex items-center gap-2 px-4 py-2 border border-darkGreen text-textPrimary rounded-lg font-semibold hover:bg-darkGreen hover:bg-opacity-10 transition-all"
              >
                <RefreshCw size={16} />
                Preview
              </button>
              <button
                type="button"
                onClick={resetPreview}
                className="inline-flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500 hover:bg-opacity-10 transition-all"
              >
                <X size={16} />
                Reset
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Themes List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-golden"></div>
        </div>
      ) : themes.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <Palette size={48} className="text-golden mx-auto mb-4 opacity-50" />
          <p className="text-textPrimary text-lg">No custom themes yet</p>
          <p className="text-textSecondary mt-2">Create your first theme to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <motion.div
              key={theme._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card-premium p-5 rounded-xl relative ${
                theme.isActive ? 'ring-2 ring-golden' : ''
              }`}
            >
              {theme.isActive && (
                <span className="absolute -top-2 -right-2 bg-golden text-darkGreen text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Check size={12} /> Active
                </span>
              )}

              <h3 className="text-lg font-bold text-textPrimary mb-3">{theme.name}</h3>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {Object.entries(theme.colors || {}).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-full h-8 rounded-md border border-gray-300 mb-1"
                      style={{ backgroundColor: value }}
                    />
                    <p className="text-[10px] text-textSecondary uppercase">{key}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!theme.isActive && (
                  <button
                    onClick={() => handleActivate(theme._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-golden text-darkGreen rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all"
                  >
                    <Check size={14} /> Activate
                  </button>
                )}
                <button
                  onClick={() => startEdit(theme)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-darkGreen text-textPrimary rounded-lg text-sm font-semibold hover:bg-darkGreen hover:bg-opacity-10 transition-all"
                >
                  <Edit3 size={14} /> Edit
                </button>
                {!theme.isActive && (
                  <button
                    onClick={() => handleDelete(theme._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-500 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-500 hover:bg-opacity-10 transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
