'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { BSMGRPLEMATTEXT } from '@/services/general/types';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { BackButton } from '@/components/ui/BackButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

type FormData = {
  comcode: string;
  matdoctype: string;
  matdocnum: string;
  matdocfrom: string;
  matdocuntil: string;
  lancode: string;
  matstext: string;
  matltext: string;
};

export default function MaterialTextPage() {
  const router = useRouter();
  const [data, setData] = React.useState<BSMGRPLEMATTEXT[]>([]);
  const [filteredData, setFilteredData] = useState<BSMGRPLEMATTEXT[]>([]);
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
        .from('bsmgrplemattext')
        .select('*')
        .order('matdocnum');
        
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
        ${item.matdoctype}
        ${item.matdocnum}
        ${item.matstext}
        ${item.matltext}
      `.toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });

    setFilteredData(filtered);
  };

  // Form gönderme
  const onSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);

      // Kodları büyük harfe çevir
      formData.comcode = formData.comcode.toUpperCase();
      formData.matdoctype = formData.matdoctype.toUpperCase();
      formData.matdocnum = formData.matdocnum.toUpperCase();
      formData.lancode = formData.lancode.toUpperCase();

      if (editingId) {
        const { error } = await supabase
          .from('bsmgrplemattext')
          .update(formData)
          .eq('matdocnum', editingId)
          .eq('comcode', formData.comcode)
          .eq('lancode', formData.lancode);
          
        if (error) throw error;
        toast.success('Kayıt güncellendi');
      } else {
        // Önce aynı kayıt var mı kontrol et
        const { data: existing } = await supabase
          .from('bsmgrplemattext')
          .select('*')
          .eq('comcode', formData.comcode)
          .eq('matdocnum', formData.matdocnum)
          .eq('lancode', formData.lancode)
          .single();

        if (existing) {
          toast.error('Bu kayıt zaten mevcut');
          return;
        }

        const { error } = await supabase
          .from('bsmgrplemattext')
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
  function handleEdit(item: BSMGRPLEMATTEXT) {
    setEditingId(item.matdocnum);
    Object.keys(item).forEach((key) => {
      setValue(key as keyof FormData, item[key as keyof BSMGRPLEMATTEXT]);
    });
  }

  // Silme
  async function handleDelete(item: BSMGRPLEMATTEXT) {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bsmgrplemattext')
        .delete()
        .eq('matdocnum', item.matdocnum)
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
            Malzeme Açıklamaları
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
            placeholder="Malzeme kodu veya açıklama ile ara..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Şirket Kodu"
              {...register('comcode', { required: 'Şirket kodu zorunlu' })}
              disabled={!!editingId || isLoading}
            />
          </div>

          <div>
            <Input
              label="Malzeme Tipi"
              {...register('matdoctype', { required: 'Malzeme tipi zorunlu' })}
              disabled={!!editingId || isLoading}
            />
          </div>

          <div>
            <Input
              label="Malzeme Kodu"
              {...register('matdocnum', { required: 'Malzeme kodu zorunlu' })}
              disabled={!!editingId || isLoading}
            />
          </div>

          <div>
            <Input
              type="date"
              label="Geçerlilik Başlangıcı"
              {...register('matdocfrom', { required: 'Geçerlilik başlangıcı zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              type="date"
              label="Geçerlilik Bitişi"
              {...register('matdocuntil', { required: 'Geçerlilik bitişi zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Dil Kodu"
              {...register('lancode', { required: 'Dil kodu zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Kısa Açıklama"
              {...register('matstext', { required: 'Kısa açıklama zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Uzun Açıklama"
              {...register('matltext', { required: 'Uzun açıklama zorunlu' })}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-4">
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
          <Button type="submit" disabled={isLoading}>
            {editingId ? 'Güncelle' : 'Kaydet'}
          </Button>
        </div>
      </form>

      {/* Tablo */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Kayıtlar
              {stats.hasFilter && (
                <span className="ml-2 text-sm text-gray-400">
                  ({stats.filtered}/{stats.total})
                </span>
              )}
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50">
                <th>Şirket Kodu</th>
                <th>Malzeme Tipi</th>
                <th>Malzeme Kodu</th>
                <th>Geçerlilik Başlangıcı</th>
                <th>Geçerlilik Bitişi</th>
                <th>Dil Kodu</th>
                <th>Kısa Açıklama</th>
                <th>Uzun Açıklama</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredData.map((item) => (
                <tr
                  key={`${item.comcode}-${item.matdocnum}-${item.lancode}`}
                  className="hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.comcode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matdocfrom}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matdocuntil}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.lancode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matstext}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matltext}
                  </td>
                  <td className="px-4 py-3 text-sm text-right space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(item)}
                      disabled={isLoading}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item)}
                      disabled={isLoading}
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
    </div>
  );
} 