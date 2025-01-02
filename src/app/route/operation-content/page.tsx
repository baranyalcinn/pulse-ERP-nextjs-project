'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { BSMGRPLEROTOPRCONTENT } from '@/services/general/types';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { BackButton } from '@/components/ui/BackButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

type FormData = BSMGRPLEROTOPRCONTENT;

export default function RouteOperationContentPage() {
  const router = useRouter();
  const [data, setData] = React.useState<BSMGRPLEROTOPRCONTENT[]>([]);
  const [filteredData, setFilteredData] = useState<BSMGRPLEROTOPRCONTENT[]>([]);
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
      oprnum: 0,
      setuptime: 0,
      machinetime: 0,
      labourtime: 0
    }
  });

  // Verileri yükle
  async function loadData() {
    try {
      setIsLoading(true);
      const { data: contents, error } = await supabase
        .from('bsmgrplerotoprcontent')
        .select('*')
        .order('rotdocnum');
        
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
        ${item.rotdoctype}
        ${item.rotdocnum}
        ${item.matdoctype}
        ${item.matdocnum}
        ${item.wcmdoctype}
        ${item.wcmdocnum}
        ${item.oprdoctype}
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
      formData.rotdoctype = formData.rotdoctype.toUpperCase();
      formData.rotdocnum = formData.rotdocnum.toUpperCase();
      formData.matdoctype = formData.matdoctype.toUpperCase();
      formData.matdocnum = formData.matdocnum.toUpperCase();
      formData.wcmdoctype = formData.wcmdoctype.toUpperCase();
      formData.wcmdocnum = formData.wcmdocnum.toUpperCase();
      formData.oprdoctype = formData.oprdoctype.toUpperCase();

      if (editingId) {
        const { error } = await supabase
          .from('bsmgrplerotoprcontent')
          .update(formData)
          .eq('rotdocnum', editingId)
          .eq('comcode', formData.comcode)
          .eq('oprnum', formData.oprnum);
          
        if (error) throw error;
        toast.success('Kayıt güncellendi');
      } else {
        // Önce aynı kayıt var mı kontrol et
        const { data: existing } = await supabase
          .from('bsmgrplerotoprcontent')
          .select('*')
          .eq('comcode', formData.comcode)
          .eq('rotdocnum', formData.rotdocnum)
          .eq('oprnum', formData.oprnum)
          .single();

        if (existing) {
          toast.error('Bu kayıt zaten mevcut');
          return;
        }

        const { error } = await supabase
          .from('bsmgrplerotoprcontent')
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
  function handleEdit(item: BSMGRPLEROTOPRCONTENT) {
    setEditingId(item.rotdocnum);
    Object.keys(item).forEach((key) => {
      setValue(key as keyof FormData, item[key as keyof BSMGRPLEROTOPRCONTENT]);
    });
  }

  // Silme
  async function handleDelete(item: BSMGRPLEROTOPRCONTENT) {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bsmgrplerotoprcontent')
        .delete()
        .eq('rotdocnum', item.rotdocnum)
        .eq('comcode', item.comcode)
        .eq('oprnum', item.oprnum);
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
            Rota-Operasyon İlişkileri
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
            placeholder="Rota kodu, malzeme veya operasyon ile ara..."
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
              label="Rota Tipi"
              {...register('rotdoctype', { required: 'Rota tipi zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.rotdoctype && (
              <span className="text-red-500 text-sm">{errors.rotdoctype.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Rota Kodu"
              {...register('rotdocnum', { required: 'Rota kodu zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.rotdocnum && (
              <span className="text-red-500 text-sm">{errors.rotdocnum.message}</span>
            )}
          </div>

          <div>
            <Input
              type="date"
              label="Geçerlilik Başlangıcı"
              {...register('bomdocfrom', { required: 'Başlangıç tarihi zorunlu' })}
            />
            {errors.bomdocfrom && (
              <span className="text-red-500 text-sm">{errors.bomdocfrom.message}</span>
            )}
          </div>

          <div>
            <Input
              type="date"
              label="Geçerlilik Bitişi"
              {...register('bomdocuntil', { required: 'Bitiş tarihi zorunlu' })}
            />
            {errors.bomdocuntil && (
              <span className="text-red-500 text-sm">{errors.bomdocuntil.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Malzeme Tipi"
              {...register('matdoctype', { required: 'Malzeme tipi zorunlu' })}
            />
            {errors.matdoctype && (
              <span className="text-red-500 text-sm">{errors.matdoctype.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Malzeme Kodu"
              {...register('matdocnum', { required: 'Malzeme kodu zorunlu' })}
            />
            {errors.matdocnum && (
              <span className="text-red-500 text-sm">{errors.matdocnum.message}</span>
            )}
          </div>

          <div>
            <Input
              type="number"
              label="Operasyon No"
              {...register('oprnum', { required: 'Operasyon no zorunlu' })}
            />
            {errors.oprnum && (
              <span className="text-red-500 text-sm">{errors.oprnum.message}</span>
            )}
          </div>

          <div>
            <Input
              label="İş Merkezi Tipi"
              {...register('wcmdoctype', { required: 'İş merkezi tipi zorunlu' })}
            />
            {errors.wcmdoctype && (
              <span className="text-red-500 text-sm">{errors.wcmdoctype.message}</span>
            )}
          </div>

          <div>
            <Input
              label="İş Merkezi Kodu"
              {...register('wcmdocnum', { required: 'İş merkezi kodu zorunlu' })}
            />
            {errors.wcmdocnum && (
              <span className="text-red-500 text-sm">{errors.wcmdocnum.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Operasyon Tipi"
              {...register('oprdoctype', { required: 'Operasyon tipi zorunlu' })}
            />
            {errors.oprdoctype && (
              <span className="text-red-500 text-sm">{errors.oprdoctype.message}</span>
            )}
          </div>

          <div>
            <Input
              type="number"
              step="0.01"
              label="Hazırlık Süresi"
              {...register('setuptime', { required: 'Hazırlık süresi zorunlu' })}
            />
            {errors.setuptime && (
              <span className="text-red-500 text-sm">{errors.setuptime.message}</span>
            )}
          </div>

          <div>
            <Input
              type="number"
              step="0.01"
              label="Makine Süresi"
              {...register('machinetime', { required: 'Makine süresi zorunlu' })}
            />
            {errors.machinetime && (
              <span className="text-red-500 text-sm">{errors.machinetime.message}</span>
            )}
          </div>

          <div>
            <Input
              type="number"
              step="0.01"
              label="İşçilik Süresi"
              {...register('labourtime', { required: 'İşçilik süresi zorunlu' })}
            />
            {errors.labourtime && (
              <span className="text-red-500 text-sm">{errors.labourtime.message}</span>
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
                  Rota Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Rota Kodu
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Geçerlilik Başlangıcı
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Geçerlilik Bitişi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Malzeme Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Malzeme Kodu
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Operasyon No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  İş Merkezi Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  İş Merkezi Kodu
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Operasyon Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Hazırlık Süresi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Makine Süresi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  İşçilik Süresi
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredData.map((item) => (
                <tr
                  key={`${item.comcode}-${item.rotdocnum}-${item.oprnum}`}
                  className="hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.comcode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.rotdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.rotdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.bomdocfrom}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.bomdocuntil}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.oprnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.wcmdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.wcmdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.oprdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.setuptime}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.machinetime}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.labourtime}
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