import { supabase } from '@/lib/supabase';

export interface BSMGRPLEBOMHEAD {
  comcode: string;
  bomdoctype: string;
  bomdocnum: string;
  bomdocfrom: Date;
  bomdocuntil: Date;
  matdoctype: string;
  matdocnum: string;
  quantity: number;
  isdeleted: number;
  ispassive: number;
  drawnum: string;
}

export class BSMGRPLEBOMHEADError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BSMGRPLEBOMHEADError';
  }
}

class BSMGRPLEBOMHEADService {
  private handleError(error: any, defaultMessage: string): never {
    console.error(`BSMGRPLEBOMHEAD error:`, error);
    if (error instanceof BSMGRPLEBOMHEADError) {
      throw error;
    }
    throw new BSMGRPLEBOMHEADError(defaultMessage);
  }

  async getAll(): Promise<BSMGRPLEBOMHEAD[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomhead')
        .select('*')
        .eq('isdeleted', 0);

      if (error) {
        throw new BSMGRPLEBOMHEADError('Kayıtlar alınırken bir hata oluştu');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Kayıtlar alınırken bir hata oluştu');
    }
  }

  async create(record: BSMGRPLEBOMHEAD): Promise<BSMGRPLEBOMHEAD> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomhead')
        .insert([record])
        .select()
        .single();

      if (error) {
        throw new BSMGRPLEBOMHEADError(error.message || 'Kayıt oluşturulurken bir hata oluştu');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt oluşturulurken bir hata oluştu');
    }
  }

  async update(comcode: string, bomdoctype: string, bomdocnum: string, record: Partial<BSMGRPLEBOMHEAD>): Promise<BSMGRPLEBOMHEAD> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomhead')
        .update(record)
        .eq('comcode', comcode)
        .eq('bomdoctype', bomdoctype)
        .eq('bomdocnum', bomdocnum)
        .select()
        .single();

      if (error) {
        throw new BSMGRPLEBOMHEADError(error.message || 'Kayıt güncellenirken bir hata oluştu');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt güncellenirken bir hata oluştu');
    }
  }

  async delete(comcode: string, bomdoctype: string, bomdocnum: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrplebomhead')
        .update({ isdeleted: 1 })
        .eq('comcode', comcode)
        .eq('bomdoctype', bomdoctype)
        .eq('bomdocnum', bomdocnum);

      if (error) {
        throw new BSMGRPLEBOMHEADError(error.message || 'Kayıt silinirken bir hata oluştu');
      }
    } catch (error) {
      this.handleError(error, 'Kayıt silinirken bir hata oluştu');
    }
  }

  async search(term: string): Promise<BSMGRPLEBOMHEAD[]> {
    try {
      if (!term.trim()) {
        return this.getAll();
      }

      const { data, error } = await supabase
        .from('bsmgrplebomhead')
        .select('*')
        .eq('isdeleted', 0)
        .or(`comcode.ilike.%${term}%,bomdoctype.ilike.%${term}%,bomdocnum.ilike.%${term}%,matdocnum.ilike.%${term}%,drawnum.ilike.%${term}%`);

      if (error) {
        throw new BSMGRPLEBOMHEADError('Kayıtlar aranırken bir hata oluştu');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Kayıtlar aranırken bir hata oluştu');
    }
  }

  async getByKeys(comcode: string, bomdoctype: string, bomdocnum: string): Promise<BSMGRPLEBOMHEAD> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomhead')
        .select('*')
        .eq('comcode', comcode)
        .eq('bomdoctype', bomdoctype)
        .eq('bomdocnum', bomdocnum)
        .eq('isdeleted', 0)
        .single();

      if (error) {
        throw new BSMGRPLEBOMHEADError('Kayıt alınırken bir hata oluştu');
      }

      if (!data) {
        throw new BSMGRPLEBOMHEADError('Kayıt bulunamadı');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt alınırken bir hata oluştu');
    }
  }
}

export const bsmgrplebomheadService = new BSMGRPLEBOMHEADService(); 