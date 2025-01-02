'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { BSMGRPLEWCMHEAD } from '@/services/general/types';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { BackButton } from '@/components/ui/BackButton';
import { SearchBar } from '@/components/ui/SearchBar';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

type FormData = BSMGRPLEWCMHEAD;

export default function WorkCenterHeadPage() {
  const router = useRouter();
  const [data, setData] = React.useState<BSMGRPLEWCMHEAD[]>([]);
  const [filteredData, setFilteredData] = useState<BSMGRPLEWCMHEAD[]>([]);
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
      ispassive: 0,
      isdeleted: 0,
      worktime: 0
    }
  });

  // Verileri yükle
  async function loadData() {
    try {
      setIsLoading(true);
      const { data: wcmhead, error } = await supabase
        .from('bsmgrplewcmhead')
        .select('*')
        .order('wcmdocnum');
        
      if (error) {
        console.error('Veri yükleme hatası:', error);
        throw error;
      }
      
      setData(wcmhead || []);
      setFilteredData(wcmhead || []);
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
        ${item.wcmdoctype}
        ${item.wcmdocnum}
        ${item.mainwcmdoctype}
        ${item.mainwcmdocnum}
        ${item.ccmdoctype}
        ${item.ccmdocnum}
      `.toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });

    setFilteredData(filtered);
  };

  // Form gönderme
  const onSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);

      // Şirket kodu ve diğer kodlar büyük harfe çevrilsin
      formData.comcode = formData.comcode.toUpperCase();
      formData.wcmdoctype = formData.wcmdoctype.toUpperCase();
      formData.wcmdocnum = formData.wcmdocnum.toUpperCase();
      formData.mainwcmdoctype = formData.mainwcmdoctype?.toUpperCase();
      formData.mainwcmdocnum = formData.mainwcmdocnum?.toUpperCase();
      formData.ccmdoctype = formData.ccmdoctype?.toUpperCase();
      formData.ccmdocnum = formData.ccmdocnum?.toUpperCase();

      if (editingId) {
        const { error } = await supabase
          .from('bsmgrplewcmhead')
          .update(formData)
          .eq('wcmdocnum', editingId)
          .eq('comcode', formData.comcode)
          .eq('wcmdoctype', formData.wcmdoctype);
          
        if (error) throw error;
        toast.success('Kayıt güncellendi');
      } else {
        // Önce aynı kayıt var mı kontrol et
        const { data: existing } = await supabase
          .from('bsmgrplewcmhead')
          .select('*')
          .eq('comcode', formData.comcode)
          .eq('wcmdoctype', formData.wcmdoctype)
          .eq('wcmdocnum', formData.wcmdocnum)
          .single();

        if (existing) {
          toast.error('Bu kayıt zaten mevcut');
          return;
        }

        const { error } = await supabase
          .from('bsmgrplewcmhead')
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
  function handleEdit(item: BSMGRPLEWCMHEAD) {
    setEditingId(item.wcmdocnum);
    setValue('comcode', item.comcode);
    setValue('wcmdoctype', item.wcmdoctype);
    setValue('wcmdocnum', item.wcmdocnum);
    setValue('wcmdocfrom', item.wcmdocfrom);
    setValue('wcmdocuntil', item.wcmdocuntil);
    setValue('mainwcmdoctype', item.mainwcmdoctype);
    setValue('mainwcmdocnum', item.mainwcmdocnum);
    setValue('ccmdoctype', item.ccmdoctype);
    setValue('ccmdocnum', item.ccmdocnum);
    setValue('worktime', item.worktime);
    setValue('isdeleted', item.isdeleted);
    setValue('ispassive', item.ispassive);
  }

  // Silme
  async function handleDelete(item: BSMGRPLEWCMHEAD) {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bsmgrplewcmhead')
        .delete()
        .eq('wcmdocnum', item.wcmdocnum)
        .eq('comcode', item.comcode)
        .eq('wcmdoctype', item.wcmdoctype);
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
            İş Merkezi Ana Bilgileri
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
            placeholder="İş merkezi kodu veya açıklama ile ara..."
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
              label="İş Merkezi Tipi"
              {...register('wcmdoctype', { required: 'İş merkezi tipi zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.wcmdoctype && (
              <span className="text-red-500 text-sm">{errors.wcmdoctype.message}</span>
            )}
          </div>

          <div>
            <Input
              label="İş Merkezi Kodu"
              {...register('wcmdocnum', { required: 'İş merkezi kodu zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.wcmdocnum && (
              <span className="text-red-500 text-sm">{errors.wcmdocnum.message}</span>
            )}
          </div>

          <div>
            <Input
              type="date"
              label="Geçerlilik Başlangıcı"
              {...register('wcmdocfrom', { required: 'Başlangıç tarihi zorunlu' })}
            />
            {errors.wcmdocfrom && (
              <span className="text-red-500 text-sm">{errors.wcmdocfrom.message}</span>
            )}
          </div>

          <div>
            <Input
              type="date"
              label="Geçerlilik Bitişi"
              {...register('wcmdocuntil', { required: 'Bitiş tarihi zorunlu' })}
            />
            {errors.wcmdocuntil && (
              <span className="text-red-500 text-sm">{errors.wcmdocuntil.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Ana İş Merkezi Tipi"
              {...register('mainwcmdoctype')}
            />
          </div>

          <div>
            <Input
              label="Ana İş Merkezi Kodu"
              {...register('mainwcmdocnum')}
            />
          </div>

          <div>
            <Input
              label="Maliyet Merkezi Tipi"
              {...register('ccmdoctype')}
            />
          </div>

          <div>
            <Input
              label="Maliyet Merkezi Kodu"
              {...register('ccmdocnum')}
            />
          </div>

          <div>
            <Input
              type="number"
              label="Çalışma Süresi"
              {...register('worktime', { 
                valueAsNumber: true,
                min: { value: 0, message: 'Çalışma süresi 0 dan küçük olamaz' }
              })}
            />
            {errors.worktime && (
              <span className="text-red-500 text-sm">{errors.worktime.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Silindi
            </label>
            <select
              {...register('isdeleted')}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm px-4 py-2 text-white"
            >
              <option value={0}>Hayır</option>
              <option value={1}>Evet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Durum
            </label>
            <select
              {...register('ispassive')}
              className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm px-4 py-2 text-white"
            >
              <option value={0}>Aktif</option>
              <option value={1}>Pasif</option>
            </select>
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
                  İş Merkezi Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  İş Merkezi Kodu
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Geçerlilik Başlangıcı
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Geçerlilik Bitişi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Ana İş Merkezi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Maliyet Merkezi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Çalışma Süresi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Durum
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredData.map((item) => (
                <tr
                  key={`${item.comcode}-${item.wcmdoctype}-${item.wcmdocnum}`}
                  className="hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.comcode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.wcmdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.wcmdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.wcmdocfrom}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.wcmdocuntil}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.mainwcmdoctype} - {item.mainwcmdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.ccmdoctype} - {item.ccmdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.worktime}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.ispassive === 1 ? (
                      <span className="text-red-400">Pasif</span>
                    ) : (
                      <span className="text-green-400">Aktif</span>
                    )}
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