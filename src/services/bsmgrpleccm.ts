import { supabase } from '@/lib/supabase';

export interface BSMGRPLECCM {
  comcode: string;
  doctype: string;
  doctypetext: string;
  isdeleted: number;
  ispassive: number;
}

export class BSMGRPLECCMError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BSMGRPLECCMError';
  }
}

class BSMGRPLECCMService {
  private handleError(error: any, defaultMessage: string): never {
    console.error(`BSMGRPLECCM error:`, error);
    if (error instanceof BSMGRPLECCMError) {
      throw error;
    }
    throw new BSMGRPLECCMError(defaultMessage);
  }

  async getAll(): Promise<BSMGRPLECCM[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccm')
        .select('*');

      if (error) {
        throw new BSMGRPLECCMError('Kayıtlar alınırken bir hata oluştu');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Kayıtlar alınırken bir hata oluştu');
    }
  }

  async create(record: BSMGRPLECCM): Promise<BSMGRPLECCM> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccm')
        .insert([record])
        .select()
        .single();

      if (error) {
        throw new BSMGRPLECCMError(error.message || 'Kayıt oluşturulurken bir hata oluştu');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt oluşturulurken bir hata oluştu');
    }
  }

  async update(comcode: string, doctype: string, record: Partial<BSMGRPLECCM>): Promise<BSMGRPLECCM> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccm')
        .update(record)
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .select()
        .single();

      if (error) {
        throw new BSMGRPLECCMError(error.message || 'Kayıt güncellenirken bir hata oluştu');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt güncellenirken bir hata oluştu');
    }
  }

  async delete(comcode: string, doctype: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrpleccm')
        .delete()
        .eq('comcode', comcode)
        .eq('doctype', doctype);

      if (error) {
        throw new BSMGRPLECCMError(error.message || 'Kayıt silinirken bir hata oluştu');
      }
    } catch (error) {
      this.handleError(error, 'Kayıt silinirken bir hata oluştu');
    }
  }

  async search(term: string): Promise<BSMGRPLECCM[]> {
    try {
      if (!term.trim()) {
        return this.getAll();
      }

      const { data, error } = await supabase
        .from('bsmgrpleccm')
        .select('*')
        .or(`comcode.ilike.%${term}%,doctype.ilike.%${term}%,doctypetext.ilike.%${term}%`);

      if (error) {
        throw new BSMGRPLECCMError('Kayıtlar aranırken bir hata oluştu');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Kayıtlar aranırken bir hata oluştu');
    }
  }

  async getByKeys(comcode: string, doctype: string): Promise<BSMGRPLECCM> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccm')
        .select('*')
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .single();

      if (error) {
        throw new BSMGRPLECCMError('Kayıt alınırken bir hata oluştu');
      }

      if (!data) {
        throw new BSMGRPLECCMError('Kayıt bulunamadı');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt alınırken bir hata oluştu');
    }
  }
}

export const bsmgrpleccmService = new BSMGRPLECCMService(); 