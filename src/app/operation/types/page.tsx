'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { BSMGRPLEOPR001 } from '@/services/general/types';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { BackButton } from '@/components/ui/BackButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

type FormData = BSMGRPLEOPR001;

export default function OperationTypesPage() {
  const router = useRouter();
  const [data, setData] = React.useState<BSMGRPLEOPR001[]>([]);
  const [filteredData, setFilteredData] = useState<BSMGRPLEOPR001[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // İstatistikler
  const stats = useMemo(() => {
    return {
      total: data.length,
      filtered: filteredData.length,
      hasFilter: searchQuery.trim() !== ''
    };
  }, [data.length, filteredData.length, searchQuery]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      ispassive: 0
    }
  });

  // Verileri yükle
  async function loadData() {
    try {
      setIsLoading(true);
      const { data: types, error } = await supabase
        .from('bsmgrpleopr001')
        .select('*')
        .order('doctype');
        
      if (error) {
        console.error('Veri yükleme hatası:', error);
        throw error;
      }
      
      setData(types || []);
      setFilteredData(types || []);
    } catch (error: any) {
      toast.error('Veriler yüklenirken hata oluştu');
      console.error('Hata detayı:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Sayfa yüklendiğinde verileri getir
  React.useEffect(() => {
    loadData();
  }, []);

  // Arama işlemi
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredData(data);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = data.filter(item => {
      const searchableText = `
        ${item.comcode} 
        ${item.doctype}
        ${item.doctypetext}
      `.toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });

    setFilteredData(filtered);
  };

  // Form gönderme
  const onSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);

      // Şirket kodu ve tip kodu büyük harfe çevrilsin
      formData.comcode = formData.comcode.toUpperCase();
      formData.doctype = formData.doctype.toUpperCase();

      if (editingId) {
        const { error } = await supabase
          .from('bsmgrpleopr001')
          .update(formData)
          .eq('doctype', editingId)
          .eq('comcode', formData.comcode);
          
        if (error) throw error;
        toast.success('Kayıt güncellendi');
      } else {
        // Önce aynı kayıt var mı kontrol et
        const { data: existing } = await supabase
          .from('bsmgrpleopr001')
          .select('*')
          .eq('comcode', formData.comcode)
          .eq('doctype', formData.doctype)
          .single();

        if (existing) {
          toast.error('Bu kayıt zaten mevcut');
          return;
        }

        const { error } = await supabase
          .from('bsmgrpleopr001')
          .insert(formData);
          
        if (error) throw error;
        toast.success('Kayıt eklendi');
      }

      reset();
      setEditingId(null);
      await loadData();
    } catch (error: any) {
      console.error('İşlem hatası:', error);
      toast.error(error.message || 'İşlem başarısız');
    } finally {
      setIsLoading(false);
    }
  };

  // Düzenleme
  function handleEdit(item: BSMGRPLEOPR001) {
    setEditingId(item.doctype);
    setValue('comcode', item.comcode);
    setValue('doctype', item.doctype);
    setValue('doctypetext', item.doctypetext);
    setValue('ispassive', item.ispassive);
  }

  // Silme
  async function handleDelete(item: BSMGRPLEOPR001) {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bsmgrpleopr001')
        .delete()
        .eq('doctype', item.doctype);
      if (error) throw error;
      toast.success('Kayıt silindi');
      await loadData();
    } catch (error: any) {
      toast.error('Silme işlemi başarısız');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <BackButton />
          <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
            Operasyon Tipleri
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => {
              reset();
              setEditingId(null);
            }}
            className="flex items-center space-x-2"
            variant="secondary"
          >
            <FiPlus className="text-lg" />
            <span>Yeni Kayıt</span>
          </Button>
          <Button onClick={loadData} disabled={isLoading}>Yenile</Button>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Tip kodu veya açıklama ile ara..."
            className="w-full"
          />
        </div>
        <Button
          variant="secondary"
          className="flex items-center space-x-2"
          onClick={() => {/* Filtre modalını aç */}}
        >
          <FiFilter />
          <span>Filtrele</span>
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl mb-6 border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Input
              label="Şirket Kodu"
              {...register('comcode', { required: 'Şirket kodu zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.comcode && (
              <span className="text-red-500 text-sm">{errors.comcode.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Tip Kodu"
              {...register('doctype', { required: 'Tip kodu zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.doctype && (
              <span className="text-red-500 text-sm">{errors.doctype.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Tip Açıklaması"
              {...register('doctypetext', { required: 'Tip açıklaması zorunlu' })}
              disabled={isLoading}
            />
            {errors.doctypetext && (
              <span className="text-red-500 text-sm">{errors.doctypetext.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Durum
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register('ispassive')}
                  value={0}
                  className="form-radio text-blue-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-gray-300">Aktif</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register('ispassive')}
                  value={1}
                  className="form-radio text-blue-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-gray-300">Pasif</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              setEditingId(null);
            }}
            disabled={isLoading}
          >
            Temizle
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Kaydet'}
          </Button>
        </div>
      </form>

      {/* Tablo */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Şirket Kodu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tip Kodu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Tip Açıklaması
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredData.map((item) => (
                <tr
                  key={`${item.comcode}-${item.doctype}`}
                  className="hover:bg-gray-700/50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.comcode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.doctype}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.doctypetext}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.ispassive === 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.ispassive === 0 ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(item)}
                      className="mr-2"
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item)}
                    >
                      Sil
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="mt-4 text-sm text-gray-400">
        {stats.hasFilter ? (
          <p>
            Toplam {stats.total} kayıttan {stats.filtered} tanesi gösteriliyor.
          </p>
        ) : (
          <p>Toplam {stats.total} kayıt gösteriliyor.</p>
        )}
      </div>
    </div>
  );
} 