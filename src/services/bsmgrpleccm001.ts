import { supabase } from '@/lib/supabase';

export interface BSMGRPLECCM001 {
  comcode: string;
  doctype: string;
  doctypetext: string;
  ispassive: number;
}

export class BSMGRPLECCM001Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BSMGRPLECCM001Error';
  }
}

class BSMGRPLECCM001Service {
  private handleError(error: any, defaultMessage: string): never {
    console.error(`BSMGRPLECCM001 error:`, error);
    if (error instanceof BSMGRPLECCM001Error) {
      throw error;
    }
    throw new BSMGRPLECCM001Error(defaultMessage);
  }

  async getAll(): Promise<BSMGRPLECCM001[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccm001')
        .select('*');

      if (error) {
        throw new BSMGRPLECCM001Error('Kayıtlar alınırken bir hata oluştu');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Kayıtlar alınırken bir hata oluştu');
    }
  }

  async create(record: BSMGRPLECCM001): Promise<BSMGRPLECCM001> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccm001')
        .insert([record])
        .select()
        .single();

      if (error) {
        throw new BSMGRPLECCM001Error(error.message || 'Kayıt oluşturulurken bir hata oluştu');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt oluşturulurken bir hata oluştu');
    }
  }

  async update(comcode: string, doctype: string, record: Partial<BSMGRPLECCM001>): Promise<BSMGRPLECCM001> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccm001')
        .update(record)
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .select()
        .single();

      if (error) {
        throw new BSMGRPLECCM001Error(error.message || 'Kayıt güncellenirken bir hata oluştu');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt güncellenirken bir hata oluştu');
    }
  }

  async delete(comcode: string, doctype: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrpleccm001')
        .delete()
        .eq('comcode', comcode)
        .eq('doctype', doctype);

      if (error) {
        throw new BSMGRPLECCM001Error(error.message || 'Kayıt silinirken bir hata oluştu');
      }
    } catch (error) {
      this.handleError(error, 'Kayıt silinirken bir hata oluştu');
    }
  }

  async search(term: string): Promise<BSMGRPLECCM001[]> {
    try {
      if (!term.trim()) {
        return this.getAll();
      }

      const { data, error } = await supabase
        .from('bsmgrpleccm001')
        .select('*')
        .or(`comcode.ilike.%${term}%,doctype.ilike.%${term}%,doctypetext.ilike.%${term}%`);

      if (error) {
        throw new BSMGRPLECCM001Error('Kayıtlar aranırken bir hata oluştu');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Kayıtlar aranırken bir hata oluştu');
    }
  }

  async getByKeys(comcode: string, doctype: string): Promise<BSMGRPLECCM001> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccm001')
        .select('*')
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .single();

      if (error) {
        throw new BSMGRPLECCM001Error('Kayıt alınırken bir hata oluştu');
      }

      if (!data) {
        throw new BSMGRPLECCM001Error('Kayıt bulunamadı');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt alınırken bir hata oluştu');
    }
  }
}

export const bsmgrpleccm001Service = new BSMGRPLECCM001Service(); 