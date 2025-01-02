'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { BSMGRPLEGEN001 } from '@/services/general/types';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { BackButton } from '@/components/ui/BackButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { FiPlus, FiFilter } from 'react-icons/fi';

type FormData = {
  comcode: string;
  comtext: string;
  address1: string;
  address2?: string;
  citycode: string;
  countrycode: string;
};

export default function CompaniesPage() {
  const [data, setData] = React.useState<BSMGRPLEGEN001[]>([]);
  const [filteredData, setFilteredData] = useState<BSMGRPLEGEN001[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormData>();

  // Verileri yükle
  async function loadData() {
    try {
      setIsLoading(true);
      const { data: companies, error } = await supabase
        .from('bsmgrplegen001')
        .select('*')
        .order('comcode');
        
      if (error) {
        console.error('Veri yükleme hatası:', error);
        throw error;
      }
      
      setData(companies || []);
      setFilteredData(companies || []);
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
        ${item.comtext} 
        ${item.address1} 
        ${item.address2 || ''} 
        ${item.citycode} 
        ${item.countrycode}
      `.toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });

    setFilteredData(filtered);
  };

  // Form gönderme
  const onSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);

      // address2 boş ise undefined olarak ayarla
      const submitData = {
        ...formData,
        address2: formData.address2?.trim() || undefined
      };

      if (editingId) {
        const { error } = await supabase
          .from('bsmgrplegen001')
          .update(submitData)
          .eq('comcode', editingId);
          
        if (error) throw error;
        toast.success('Kayıt güncellendi');
      } else {
        const { error } = await supabase
          .from('bsmgrplegen001')
          .insert(submitData);
          
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
  function handleEdit(item: BSMGRPLEGEN001) {
    setEditingId(item.comcode);
    setValue('comcode', item.comcode);
    setValue('comtext', item.comtext);
    setValue('address1', item.address1);
    setValue('address2', item.address2 || '');
    setValue('citycode', item.citycode);
    setValue('countrycode', item.countrycode);
  }

  // Silme
  async function handleDelete(item: BSMGRPLEGEN001) {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bsmgrplegen001')
        .delete()
        .eq('comcode', item.comcode);
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

  // İstatistikler
  const stats = useMemo(() => {
    return {
      total: data.length,
      filtered: filteredData.length,
      hasFilter: searchQuery.trim() !== ''
    };
  }, [data.length, filteredData.length, searchQuery]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <BackButton />
          <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
            Şirket Kodları
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
            placeholder="Şirket kodu, adı veya adres ile ara..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              label="Şirket Adı"
              {...register('comtext', { required: 'Şirket adı zorunlu' })}
              disabled={isLoading}
            />
            {errors.comtext && (
              <span className="text-red-500 text-sm">{errors.comtext.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Adres 1"
              {...register('address1', { required: 'Adres 1 zorunlu' })}
              disabled={isLoading}
            />
            {errors.address1 && (
              <span className="text-red-500 text-sm">{errors.address1.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Adres 2 (Opsiyonel)"
              {...register('address2')}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Şehir Kodu"
              {...register('citycode')}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Ülke Kodu"
              {...register('countrycode')}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();
                setEditingId(null);
              }}
              disabled={isLoading}
            >
              İptal
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {editingId ? 'Güncelle' : 'Ekle'}
          </Button>
        </div>
      </form>

      {/* İstatistikler */}
      <div className="mb-4 text-sm text-gray-400">
        {stats.hasFilter ? (
          <span>
            Toplam {stats.total} kayıt içinde {stats.filtered} sonuç bulundu
          </span>
        ) : (
          <span>Toplam {stats.total} kayıt</span>
        )}
      </div>

      {/* Tablo */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Yükleniyor...</span>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
          <p className="text-gray-400">
            {searchQuery ? 'Arama kriterlerine uygun kayıt bulunamadı' : 'Kayıt bulunamadı'}
          </p>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700/50">
                  <th className="p-4 text-white font-semibold">Şirket Kodu</th>
                  <th className="p-4 text-white font-semibold">Şirket Adı</th>
                  <th className="p-4 text-white font-semibold">Adres 1</th>
                  <th className="p-4 text-white font-semibold">Adres 2</th>
                  <th className="p-4 text-white font-semibold">Şehir Kodu</th>
                  <th className="p-4 text-white font-semibold">Ülke Kodu</th>
                  <th className="p-4 text-white font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr 
                    key={item.comcode} 
                    className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="p-4 text-white">{item.comcode}</td>
                    <td className="p-4 text-white">{item.comtext}</td>
                    <td className="p-4 text-white">{item.address1}</td>
                    <td className="p-4 text-white">{item.address2}</td>
                    <td className="p-4 text-white">{item.citycode}</td>
                    <td className="p-4 text-white">{item.countrycode}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          onClick={() => handleEdit(item)}
                          disabled={isLoading}
                          className="hover:bg-blue-600/20"
                        >
                          Düzenle
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(item)}
                          disabled={isLoading}
                          className="hover:bg-red-600/20"
                        >
                          Sil
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 