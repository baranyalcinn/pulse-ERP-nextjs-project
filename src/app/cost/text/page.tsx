'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { BSMGRPLECCMTEXT } from '@/services/general/types';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { BackButton } from '@/components/ui/BackButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

type FormData = BSMGRPLECCMTEXT;

export default function CostTextPage() {
  const router = useRouter();
  const [data, setData] = React.useState<BSMGRPLECCMTEXT[]>([]);
  const [filteredData, setFilteredData] = useState<BSMGRPLECCMTEXT[]>([]);
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
  } = useForm<FormData>();

  // Verileri yükle
  async function loadData() {
    try {
      setIsLoading(true);
      const { data: texts, error } = await supabase
        .from('bsmgrpleccmtext')
        .select('*')
        .order('ccmdocnum');
        
      if (error) {
        console.error('Veri yükleme hatası:', error);
        throw error;
      }
      
      setData(texts || []);
      setFilteredData(texts || []);
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
        ${item.ccmdoctype}
        ${item.ccmdocnum}
        ${item.lancode}
        ${item.ccmstext}
        ${item.ccmltext}
      `.toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });

    setFilteredData(filtered);
  };

  // Form gönderme
  const onSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);

      // Şirket kodu, belge tipi ve dil kodu büyük harfe çevrilsin
      formData.comcode = formData.comcode.toUpperCase();
      formData.ccmdoctype = formData.ccmdoctype.toUpperCase();
      formData.lancode = formData.lancode.toUpperCase();

      if (editingId) {
        const { error } = await supabase
          .from('bsmgrpleccmtext')
          .update(formData)
          .eq('ccmdocnum', editingId)
          .eq('comcode', formData.comcode)
          .eq('lancode', formData.lancode);
          
        if (error) throw error;
        toast.success('Kayıt güncellendi');
      } else {
        // Önce aynı kayıt var mı kontrol et
        const { data: existing } = await supabase
          .from('bsmgrpleccmtext')
          .select('*')
          .eq('comcode', formData.comcode)
          .eq('ccmdocnum', formData.ccmdocnum)
          .eq('lancode', formData.lancode)
          .single();

        if (existing) {
          toast.error('Bu kayıt zaten mevcut');
          return;
        }

        const { error } = await supabase
          .from('bsmgrpleccmtext')
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
  function handleEdit(item: BSMGRPLECCMTEXT) {
    setEditingId(item.ccmdocnum);
    setValue('comcode', item.comcode);
    setValue('ccmdoctype', item.ccmdoctype);
    setValue('ccmdocnum', item.ccmdocnum);
    setValue('ccmdocfrom', item.ccmdocfrom);
    setValue('ccmdocuntil', item.ccmdocuntil);
    setValue('lancode', item.lancode);
    setValue('ccmstext', item.ccmstext);
    setValue('ccmltext', item.ccmltext);
  }

  // Silme
  async function handleDelete(item: BSMGRPLECCMTEXT) {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bsmgrpleccmtext')
        .delete()
        .eq('ccmdocnum', item.ccmdocnum)
        .eq('comcode', item.comcode)
        .eq('lancode', item.lancode);
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
            Maliyet Merkezi Açıklamaları
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
            placeholder="Belge no veya açıklama ile ara..."
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
              label="Belge Tipi"
              {...register('ccmdoctype', { required: 'Belge tipi zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.ccmdoctype && (
              <span className="text-red-500 text-sm">{errors.ccmdoctype.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Belge No"
              {...register('ccmdocnum', { required: 'Belge no zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.ccmdocnum && (
              <span className="text-red-500 text-sm">{errors.ccmdocnum.message}</span>
            )}
          </div>

          <div>
            <Input
              type="date"
              label="Geçerlilik Başlangıç"
              {...register('ccmdocfrom', { required: 'Geçerlilik başlangıç tarihi zorunlu' })}
              disabled={isLoading}
            />
            {errors.ccmdocfrom && (
              <span className="text-red-500 text-sm">{errors.ccmdocfrom.message}</span>
            )}
          </div>

          <div>
            <Input
              type="date"
              label="Geçerlilik Bitiş"
              {...register('ccmdocuntil', { required: 'Geçerlilik bitiş tarihi zorunlu' })}
              disabled={isLoading}
            />
            {errors.ccmdocuntil && (
              <span className="text-red-500 text-sm">{errors.ccmdocuntil.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Dil Kodu"
              {...register('lancode', { required: 'Dil kodu zorunlu' })}
              disabled={isLoading}
            />
            {errors.lancode && (
              <span className="text-red-500 text-sm">{errors.lancode.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Kısa Açıklama"
              {...register('ccmstext', { required: 'Kısa açıklama zorunlu' })}
              disabled={isLoading}
            />
            {errors.ccmstext && (
              <span className="text-red-500 text-sm">{errors.ccmstext.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Uzun Açıklama"
              {...register('ccmltext', { required: 'Uzun açıklama zorunlu' })}
              disabled={isLoading}
            />
            {errors.ccmltext && (
              <span className="text-red-500 text-sm">{errors.ccmltext.message}</span>
            )}
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
                  <th className="p-4 text-white font-semibold">Belge Tipi</th>
                  <th className="p-4 text-white font-semibold">Belge No</th>
                  <th className="p-4 text-white font-semibold">Geçerlilik Başlangıç</th>
                  <th className="p-4 text-white font-semibold">Geçerlilik Bitiş</th>
                  <th className="p-4 text-white font-semibold">Dil Kodu</th>
                  <th className="p-4 text-white font-semibold">Kısa Açıklama</th>
                  <th className="p-4 text-white font-semibold">Uzun Açıklama</th>
                  <th className="p-4 text-white font-semibold">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr 
                    key={`${item.ccmdocnum}-${item.lancode}`} 
                    className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="p-4 text-white">{item.comcode}</td>
                    <td className="p-4 text-white">{item.ccmdoctype}</td>
                    <td className="p-4 text-white">{item.ccmdocnum}</td>
                    <td className="p-4 text-white">{item.ccmdocfrom}</td>
                    <td className="p-4 text-white">{item.ccmdocuntil}</td>
                    <td className="p-4 text-white">{item.lancode}</td>
                    <td className="p-4 text-white">{item.ccmstext}</td>
                    <td className="p-4 text-white">{item.ccmltext}</td>
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