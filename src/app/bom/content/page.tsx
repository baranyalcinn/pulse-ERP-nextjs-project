"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { BackButton } from '@/components/ui/BackButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface BomContent {
  comcode: string;
  bomdoctype: string;
  bomdocnum: string;
  bomdocfrom: string;
  bomdocuntil: string;
  matdoctype: string;
  matdocnum: string;
  contentnum: number;
  component: string;
  compbomdoctype: string;
  compbomdocnum: string;
  quantity: number;
}

type FormData = {
  comcode: string;
  bomdoctype: string;
  bomdocnum: string;
  bomdocfrom: string;
  bomdocuntil: string;
  matdoctype: string;
  matdocnum: string;
  contentnum: number;
  component: string;
  compbomdoctype: string;
  compbomdocnum: string;
  quantity: number;
};

export default function BomContentPage() {
  const router = useRouter();
  const [data, setData] = React.useState<BomContent[]>([]);
  const [filteredData, setFilteredData] = useState<BomContent[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      contentnum: 0,
      quantity: 0
    }
  });

  // Verileri yükle
  async function loadData() {
    try {
      setIsLoading(true);
      const { data: contents, error } = await supabase
        .from('bsmgrplebomcontent')
        .select('*')
        .order('bomdocnum');
        
      if (error) {
        console.error('Veri yükleme hatası:', error);
        throw error;
      }
      
      setData(contents || []);
      setFilteredData(contents || []);
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
        ${item.bomdoctype}
        ${item.bomdocnum}
        ${item.matdoctype}
        ${item.matdocnum}
        ${item.component}
        ${item.compbomdoctype}
        ${item.compbomdocnum}
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
      formData.bomdoctype = formData.bomdoctype.toUpperCase();
      formData.bomdocnum = formData.bomdocnum.toUpperCase();
      formData.matdoctype = formData.matdoctype.toUpperCase();
      formData.matdocnum = formData.matdocnum.toUpperCase();
      formData.component = formData.component.toUpperCase();
      formData.compbomdoctype = formData.compbomdoctype.toUpperCase();
      formData.compbomdocnum = formData.compbomdocnum.toUpperCase();

      if (editingId) {
        const { error } = await supabase
          .from('bsmgrplebomcontent')
          .update(formData)
          .eq('bomdocnum', editingId)
          .eq('comcode', formData.comcode)
          .eq('contentnum', formData.contentnum);
          
        if (error) throw error;
        toast.success('Kayıt güncellendi');
      } else {
        // Önce aynı kayıt var mı kontrol et
        const { data: existing } = await supabase
          .from('bsmgrplebomcontent')
          .select('*')
          .eq('comcode', formData.comcode)
          .eq('bomdocnum', formData.bomdocnum)
          .eq('contentnum', formData.contentnum)
          .single();

        if (existing) {
          toast.error('Bu kayıt zaten mevcut');
          return;
        }

        const { error } = await supabase
          .from('bsmgrplebomcontent')
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
  function handleEdit(item: BomContent) {
    setEditingId(item.bomdocnum);
    setValue('comcode', item.comcode);
    setValue('bomdoctype', item.bomdoctype);
    setValue('bomdocnum', item.bomdocnum);
    setValue('bomdocfrom', item.bomdocfrom);
    setValue('bomdocuntil', item.bomdocuntil);
    setValue('matdoctype', item.matdoctype);
    setValue('matdocnum', item.matdocnum);
    setValue('contentnum', item.contentnum);
    setValue('component', item.component);
    setValue('compbomdoctype', item.compbomdoctype);
    setValue('compbomdocnum', item.compbomdocnum);
    setValue('quantity', item.quantity);
  }

  // Silme
  async function handleDelete(item: BomContent) {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bsmgrplebomcontent')
        .delete()
        .eq('bomdocnum', item.bomdocnum)
        .eq('comcode', item.comcode)
        .eq('contentnum', item.contentnum);
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
            Ürün Ağacı İçerikleri
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
            placeholder="Belge no veya bileşen ile ara..."
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
              label="Ürün Ağacı Belge Tipi"
              {...register('bomdoctype', { required: 'Belge tipi zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.bomdoctype && (
              <span className="text-red-500 text-sm">{errors.bomdoctype.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Ürün Ağacı Belge No"
              {...register('bomdocnum', { required: 'Belge no zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.bomdocnum && (
              <span className="text-red-500 text-sm">{errors.bomdocnum.message}</span>
            )}
          </div>

          <div>
            <Input
              type="date"
              label="Başlangıç Tarihi"
              {...register('bomdocfrom', { required: 'Başlangıç tarihi zorunlu' })}
            />
            {errors.bomdocfrom && (
              <span className="text-red-500 text-sm">{errors.bomdocfrom.message}</span>
            )}
          </div>

          <div>
            <Input
              type="date"
              label="Bitiş Tarihi"
              {...register('bomdocuntil', { required: 'Bitiş tarihi zorunlu' })}
            />
            {errors.bomdocuntil && (
              <span className="text-red-500 text-sm">{errors.bomdocuntil.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Malzeme Belge Tipi"
              {...register('matdoctype', { required: 'Malzeme belge tipi zorunlu' })}
            />
            {errors.matdoctype && (
              <span className="text-red-500 text-sm">{errors.matdoctype.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Malzeme Belge No"
              {...register('matdocnum', { required: 'Malzeme belge no zorunlu' })}
            />
            {errors.matdocnum && (
              <span className="text-red-500 text-sm">{errors.matdocnum.message}</span>
            )}
          </div>

          <div>
            <Input
              type="number"
              label="İçerik No"
              {...register('contentnum', { required: 'İçerik no zorunlu' })}
            />
            {errors.contentnum && (
              <span className="text-red-500 text-sm">{errors.contentnum.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Bileşen"
              {...register('component', { required: 'Bileşen zorunlu' })}
            />
            {errors.component && (
              <span className="text-red-500 text-sm">{errors.component.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Bileşen Ürün Ağacı Belge Tipi"
              {...register('compbomdoctype')}
            />
          </div>

          <div>
            <Input
              label="Bileşen Ürün Ağacı Belge No"
              {...register('compbomdocnum')}
            />
          </div>

          <div>
            <Input
              type="number"
              step="0.01"
              label="Miktar"
              {...register('quantity', { required: 'Miktar zorunlu' })}
            />
            {errors.quantity && (
              <span className="text-red-500 text-sm">{errors.quantity.message}</span>
            )}
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Şirket Kodu
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Belge Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Belge No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Başlangıç
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Bitiş
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Malzeme Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Malzeme No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  İçerik No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Bileşen
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Bileşen Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Bileşen No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Miktar
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredData.map((item) => (
                <tr
                  key={`${item.comcode}-${item.bomdocnum}-${item.contentnum}`}
                  className="hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.comcode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.bomdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.bomdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {new Date(item.bomdocfrom).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {new Date(item.bomdocuntil).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.contentnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.component}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.compbomdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.compbomdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.quantity}
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