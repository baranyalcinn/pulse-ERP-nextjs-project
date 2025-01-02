import { supabase } from '@/lib/supabase';

export interface Material {
  id: string;
  company_code: string;
  material_type: string;
  valid_from: string;
  valid_to: string;
  supply_type: string;
  is_deleted: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class MaterialError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'MaterialError';
  }
}

export const materialService = {
  // Bağlantı kontrolü
  checkConnection: async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from('materials').select('id').limit(1);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Supabase bağlantı hatası:', error);
      return false;
    }
  },

  // Tüm malzemeleri getir
  getAll: async (): Promise<Material[]> => {
    try {
      const isConnected = await materialService.checkConnection();
      if (!isConnected) {
        throw new MaterialError('Veritabanı bağlantısı kurulamadı');
      }

      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new MaterialError(
        'Malzemeler getirilirken hata oluştu',
        error
      );
    }
  },

  // Malzeme ara
  search: async (searchTerm: string): Promise<Material[]> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('is_deleted', false)
        .or(`
          company_code.ilike.%${searchTerm}%,
          material_type.ilike.%${searchTerm}%,
          supply_type.ilike.%${searchTerm}%
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new MaterialError(
        'Arama yapılırken hata oluştu',
        error
      );
    }
  },

  // Yeni malzeme ekle
  create: async (material: Omit<Material, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>): Promise<Material> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .insert([{ ...material, is_deleted: false }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Veri oluşturulamadı');
      
      return data;
    } catch (error: any) {
      throw new MaterialError(
        'Malzeme eklenirken hata oluştu',
        error
      );
    }
  },

  // Malzeme güncelle
  update: async (id: string, material: Partial<Omit<Material, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>>): Promise<Material> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .update({ ...material, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Güncellenecek kayıt bulunamadı');

      return data;
    } catch (error: any) {
      throw new MaterialError(
        'Malzeme güncellenirken hata oluştu',
        error
      );
    }
  },

  // Malzeme sil (soft delete)
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('materials')
        .update({ 
          is_deleted: true,
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      throw new MaterialError(
        'Malzeme silinirken hata oluştu',
        error
      );
    }
  },

  // Malzeme durumunu değiştir
  toggleStatus: async (id: string, isActive: boolean): Promise<Material> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Durum güncellenecek kayıt bulunamadı');

      return data;
    } catch (error: any) {
      throw new MaterialError(
        'Durum güncellenirken hata oluştu',
        error
      );
    }
  },
}; 