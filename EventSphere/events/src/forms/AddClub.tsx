import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Apis } from '../apiserveices/api';

interface AddClubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddClubModal({ isOpen, onClose }: AddClubModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    banner: null as File | null,
    logo: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [logoPreview, setLogoPreview] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'banner') {
          setBannerPreview(reader.result as string);
        } else {
          setLogoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.banner || !formData.logo) {
        throw new Error('Please upload both banner and logo images');
      }
      await Apis.createClub(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl mx-4 relative overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Add New Club</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Club Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Club Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter club name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter club email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Create a password"
              />
            </div>

            {/* Image Uploads */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Banner Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Club Banner
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={e => handleFileChange(e, 'banner')}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="relative block cursor-pointer"
                  >
                    {bannerPreview ? (
                      <div className="relative rounded-lg overflow-hidden h-40">
                        <img
                          src={bannerPreview}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-400">Upload Banner</span>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Club Logo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={e => handleFileChange(e, 'logo')}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="relative block cursor-pointer"
                  >
                    {logoPreview ? (
                      <div className="relative rounded-lg overflow-hidden h-40">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-400">Upload Logo</span>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating Club...</span>
                </>
              ) : (
                <span>Create Club</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}