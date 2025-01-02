import { supabase } from '@/lib/supabase';

export interface BSMGRPLECCMHEAD {
  comcode: string;
  ccmdoctype: string;
  ccmdocnum: string;
  ccmdocfrom: Date;
  ccmdocuntil: Date;
  mainccmdoctype: string;
  mainccmdocnum: string;
  isdeleted: number;
  ispassive: number;
}

export class BSMGRPLECCMHEADError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BSMGRPLECCMHEADError';
  }
}

class BSMGRPLECCMHEADService {
  private handleError(error: any, defaultMessage: string): never {
    console.error(`BSMGRPLECCMHEAD error:`, error);
    if (error instanceof BSMGRPLECCMHEADError) {
      throw error;
    }
    throw new BSMGRPLECCMHEADError(defaultMessage);
  }

  async getAll(): Promise<BSMGRPLECCMHEAD[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccmhead')
        .select('*')
        .eq('isdeleted', 0);

      if (error) {
        throw new BSMGRPLECCMHEADError('Kayıtlar alınırken bir hata oluştu');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Kayıtlar alınırken bir hata oluştu');
    }
  }

  async create(record: BSMGRPLECCMHEAD): Promise<BSMGRPLECCMHEAD> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccmhead')
        .insert([record])
        .select()
        .single();

      if (error) {
        throw new BSMGRPLECCMHEADError(error.message || 'Kayıt oluşturulurken bir hata oluştu');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt oluşturulurken bir hata oluştu');
    }
  }

  async update(comcode: string, ccmdoctype: string, ccmdocnum: string, record: Partial<BSMGRPLECCMHEAD>): Promise<BSMGRPLECCMHEAD> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccmhead')
        .update(record)
        .eq('comcode', comcode)
        .eq('ccmdoctype', ccmdoctype)
        .eq('ccmdocnum', ccmdocnum)
        .select()
        .single();

      if (error) {
        throw new BSMGRPLECCMHEADError(error.message || 'Kayıt güncellenirken bir hata oluştu');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt güncellenirken bir hata oluştu');
    }
  }

  async delete(comcode: string, ccmdoctype: string, ccmdocnum: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrpleccmhead')
        .update({ isdeleted: 1 })
        .eq('comcode', comcode)
        .eq('ccmdoctype', ccmdoctype)
        .eq('ccmdocnum', ccmdocnum);

      if (error) {
        throw new BSMGRPLECCMHEADError(error.message || 'Kayıt silinirken bir hata oluştu');
      }
    } catch (error) {
      this.handleError(error, 'Kayıt silinirken bir hata oluştu');
    }
  }

  async search(term: string): Promise<BSMGRPLECCMHEAD[]> {
    try {
      if (!term.trim()) {
        return this.getAll();
      }

      const { data, error } = await supabase
        .from('bsmgrpleccmhead')
        .select('*')
        .eq('isdeleted', 0)
        .or(`comcode.ilike.%${term}%,ccmdoctype.ilike.%${term}%,ccmdocnum.ilike.%${term}%,mainccmdoctype.ilike.%${term}%,mainccmdocnum.ilike.%${term}%`);

      if (error) {
        throw new BSMGRPLECCMHEADError('Kayıtlar aranırken bir hata oluştu');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Kayıtlar aranırken bir hata oluştu');
    }
  }

  async getByKeys(comcode: string, ccmdoctype: string, ccmdocnum: string): Promise<BSMGRPLECCMHEAD> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccmhead')
        .select('*')
        .eq('comcode', comcode)
        .eq('ccmdoctype', ccmdoctype)
        .eq('ccmdocnum', ccmdocnum)
        .eq('isdeleted', 0)
        .single();

      if (error) {
        throw new BSMGRPLECCMHEADError('Kayıt alınırken bir hata oluştu');
      }

      if (!data) {
        throw new BSMGRPLECCMHEADError('Kayıt bulunamadı');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt alınırken bir hata oluştu');
    }
  }
}

export const bsmgrpleccmheadService = new BSMGRPLECCMHEADService(); 