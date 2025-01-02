'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { LOGIN } from '@/services/auth/types';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';

type FormData = {
  userid: number;
  username: string;
  password: string;
};

export default function UsersPage() {
  const [data, setData] = React.useState<LOGIN[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);

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
      const { data, error } = await supabase.from('login').select('*');
      if (error) throw error;
      setData(data || []);
    } catch (error: any) {
      toast.error('Veriler yüklenirken hata oluştu');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Sayfa yüklendiğinde verileri getir
  React.useEffect(() => {
    loadData();
  }, []);

  // Form gönderme
  const onSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);

      if (editingId) {
        const { error } = await supabase
          .from('login')
          .update(formData)
          .eq('userid', editingId);
        if (error) throw error;
        toast.success('Kayıt güncellendi');
      } else {
        const { error } = await supabase
          .from('login')
          .insert(formData);
        if (error) throw error;
        toast.success('Kayıt eklendi');
      }

      reset();
      setEditingId(null);
      await loadData();
    } catch (error: any) {
      toast.error('İşlem başarısız');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Düzenleme
  function handleEdit(item: LOGIN) {
    setEditingId(item.userid);
    setValue('userid', item.userid);
    setValue('username', item.username);
    setValue('password', item.password);
  }

  // Silme
  async function handleDelete(item: LOGIN) {
    if (!window.confirm('Silmek istediğinize emin misiniz?')) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('login')
        .delete()
        .eq('userid', item.userid);
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
        <h1 className="text-2xl font-semibold text-white">Kullanıcı Yönetimi</h1>
        <Button onClick={loadData} disabled={isLoading}>Yenile</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Input
              type="number"
              label="Kullanıcı ID"
              {...register('userid', { required: 'Kullanıcı ID zorunlu' })}
              disabled={!!editingId || isLoading}
            />
            {errors.userid && (
              <span className="text-red-500 text-sm">{errors.userid.message}</span>
            )}
          </div>

          <div>
            <Input
              label="Kullanıcı Adı"
              {...register('username', { required: 'Kullanıcı adı zorunlu' })}
              disabled={isLoading}
            />
            {errors.username && (
              <span className="text-red-500 text-sm">{errors.username.message}</span>
            )}
          </div>

          <div>
            <Input
              type="password"
              label="Şifre"
              {...register('password', { required: 'Şifre zorunlu' })}
              disabled={isLoading}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
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

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Yükleniyor...</span>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          Kayıt bulunamadı
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-4 text-white">Kullanıcı ID</th>
                <th className="p-4 text-white">Kullanıcı Adı</th>
                <th className="p-4 text-white">Şifre</th>
                <th className="p-4 text-white">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.userid} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-4 text-white">{item.userid}</td>
                  <td className="p-4 text-white">{item.username}</td>
                  <td className="p-4 text-white">********</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-sm text-gray-400">
            Toplam {data.length} kayıt bulundu
          </div>
        </div>
      )}
    </div>
  );
} 