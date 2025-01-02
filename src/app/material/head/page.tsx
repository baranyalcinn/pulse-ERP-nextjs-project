'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { BSMGRPLEMATHEAD } from '@/services/general/types';
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
  supplytype: number;
  stunit: string;
  netweight: number;
  nwunit: string;
  brutweight: number;
  bwunit: string;
  isbom: number;
  bomdoctype: string;
  bomdocnum: string;
  isroute: number;
  rotdoctype: string;
  rotdocnum: string;
  isdeleted: number;
  ispassive: number;
};

export default function MaterialHeadPage() {
  const router = useRouter();
  const [data, setData] = React.useState<BSMGRPLEMATHEAD[]>([]);
  const [filteredData, setFilteredData] = useState<BSMGRPLEMATHEAD[]>([]);
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
      supplytype: 0,
      netweight: 0,
      brutweight: 0,
      isbom: 0,
      isroute: 0,
      isdeleted: 0,
      ispassive: 0
    }
  });

  // Verileri yükle
  async function loadData() {
    try {
      setIsLoading(true);
      const { data: materials, error } = await supabase
        .from('bsmgrplemathead')
        .select('*')
        .order('matdocnum');
        
      if (error) {
        console.error('Veri yükleme hatası:', error);
        throw error;
      }
      
      setData(materials || []);
      setFilteredData(materials || []);
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
      formData.bomdoctype = formData.bomdoctype.toUpperCase();
      formData.bomdocnum = formData.bomdocnum.toUpperCase();
      formData.rotdoctype = formData.rotdoctype.toUpperCase();
      formData.rotdocnum = formData.rotdocnum.toUpperCase();

      if (editingId) {
        const { error } = await supabase
          .from('bsmgrplemathead')
          .update(formData)
          .eq('matdocnum', editingId)
          .eq('comcode', formData.comcode);
          
        if (error) throw error;
        toast.success('Kayıt güncellendi');
      } else {
        // Önce aynı kayıt var mı kontrol et
        const { data: existing } = await supabase
          .from('bsmgrplemathead')
          .select('*')
          .eq('comcode', formData.comcode)
          .eq('matdocnum', formData.matdocnum)
          .single();

        if (existing) {
          toast.error('Bu kayıt zaten mevcut');
          return;
        }

        const { error } = await supabase
          .from('bsmgrplemathead')
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
  function handleEdit(item: BSMGRPLEMATHEAD) {
    setEditingId(item.matdocnum);
    setValue('comcode', item.comcode);
    setValue('matdoctype', item.matdoctype);
    setValue('matdocnum', item.matdocnum);
    setValue('matdocfrom', item.matdocfrom);
    setValue('matdocuntil', item.matdocuntil);
    setValue('supplytype', item.supplytype);
    setValue('stunit', item.stunit);
    setValue('netweight', item.netweight);
    setValue('nwunit', item.nwunit);
    setValue('brutweight', item.brutweight);
    setValue('bwunit', item.bwunit);
    setValue('isbom', item.isbom);
    setValue('bomdoctype', item.bomdoctype);
    setValue('bomdocnum', item.bomdocnum);
    setValue('isroute', item.isroute);
    setValue('rotdoctype', item.rotdoctype);
    setValue('rotdocnum', item.rotdocnum);
    setValue('isdeleted', item.isdeleted);
    setValue('ispassive', item.ispassive);
  }

  // Silme
  async function handleDelete(item: BSMGRPLEMATHEAD) {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bsmgrplemathead')
        .delete()
        .eq('matdocnum', item.matdocnum)
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

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <BackButton />
          <h1 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
            Malzeme Ana Bilgileri
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
            placeholder="Malzeme kodu veya tip ile ara..."
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              label="Malzeme Tipi"
              {...register('matdoctype', { required: 'Malzeme tipi zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.matdoctype && (
              <span className="text-red-500 text-sm">{errors.matdoctype.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Malzeme Kodu"
              {...register('matdocnum', { required: 'Malzeme kodu zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.matdocnum && (
              <span className="text-red-500 text-sm">{errors.matdocnum.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Tedarik Tipi"
              type="number"
              {...register('supplytype', { required: 'Tedarik tipi zorunlu' })}
            />
            {errors.supplytype && (
              <span className="text-red-500 text-sm">{errors.supplytype.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Net Ağırlık"
              type="number"
              step="0.01"
              {...register('netweight', { required: 'Net ağırlık zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Net Ağırlık Birimi"
              {...register('nwunit', { required: 'Net ağırlık birimi zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Brüt Ağırlık"
              type="number"
              step="0.01"
              {...register('brutweight', { required: 'Brüt ağırlık zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Brüt Ağırlık Birimi"
              {...register('bwunit', { required: 'Brüt ağırlık birimi zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Ürün Ağacı Var mı?"
              type="number"
              {...register('isbom', { required: 'Ürün ağacı bilgisi zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Rota Var mı?"
              type="number"
              {...register('isroute', { required: 'Rota bilgisi zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Silindi mi?"
              type="number"
              {...register('isdeleted', { required: 'Silindi bilgisi zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Pasif mi?"
              type="number"
              {...register('ispassive', { required: 'Pasif bilgisi zorunlu' })}
              disabled={isLoading}
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
              label="Stok Birimi"
              {...register('stunit', { required: 'Stok birimi zorunlu' })}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Ürün Ağacı Tipi"
              {...register('bomdoctype')}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Ürün Ağacı Kodu"
              {...register('bomdocnum')}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Rota Tipi"
              {...register('rotdoctype')}
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Rota Kodu"
              {...register('rotdocnum')}
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Şirket Kodu
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Malzeme Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Malzeme Kodu
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Tedarik Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Net Ağırlık
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Net Birim
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Brüt Ağırlık
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Brüt Birim
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Ürün Ağacı
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Rota
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Silindi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Pasif
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Geçerlilik Başlangıcı
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Geçerlilik Bitişi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Stok Birimi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Ürün Ağacı Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Ürün Ağacı Kodu
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Rota Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                  Rota Kodu
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredData.map((item) => (
                <tr
                  key={`${item.comcode}-${item.matdocnum}`}
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
                    {item.supplytype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.netweight}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.nwunit}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.brutweight}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.bwunit}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.isbom}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.isroute}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.isdeleted}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.ispassive}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matdocfrom}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.matdocuntil}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.stunit}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.bomdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.bomdocnum}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.rotdoctype}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.rotdocnum}
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