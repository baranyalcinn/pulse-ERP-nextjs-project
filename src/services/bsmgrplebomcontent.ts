import { supabase } from '@/lib/supabase';

export interface BSMGRPLEBOMCONTENT {
  comcode: string;
  bomdoctype: string;
  bomdocnum: string;
  bomdocfrom: Date;
  bomdocuntil: Date;
  matdoctype: string;
  matdocnum: string;
  contentnum: number;
  component: string;
  compbomdoctype: string;
  compbomdocnum: string;
  quantity: number;
  isdeleted: number;
  ispassive: number;
}

export class BSMGRPLEBOMCONTENTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BSMGRPLEBOMCONTENTError';
  }
}

class BSMGRPLEBOMCONTENTService {
  private handleError(error: any, defaultMessage: string): never {
    console.error(`BSMGRPLEBOMCONTENT error:`, error);
    if (error instanceof BSMGRPLEBOMCONTENTError) {
      throw error;
    }
    throw new BSMGRPLEBOMCONTENTError(defaultMessage);
  }

  async getAll(): Promise<BSMGRPLEBOMCONTENT[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomcontent')
        .select('*');

      if (error) {
        throw new BSMGRPLEBOMCONTENTError('Kayıtlar alınırken bir hata oluştu');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Kayıtlar alınırken bir hata oluştu');
    }
  }

  async create(record: BSMGRPLEBOMCONTENT): Promise<BSMGRPLEBOMCONTENT> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomcontent')
        .insert([record])
        .select()
        .single();

      if (error) {
        throw new BSMGRPLEBOMCONTENTError(error.message || 'Kayıt oluşturulurken bir hata oluştu');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt oluşturulurken bir hata oluştu');
    }
  }

  async update(comcode: string, bomdoctype: string, bomdocnum: string, contentnum: number, record: Partial<BSMGRPLEBOMCONTENT>): Promise<BSMGRPLEBOMCONTENT> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomcontent')
        .update(record)
        .eq('comcode', comcode)
        .eq('bomdoctype', bomdoctype)
        .eq('bomdocnum', bomdocnum)
        .eq('contentnum', contentnum)
        .select()
        .single();

      if (error) {
        throw new BSMGRPLEBOMCONTENTError(error.message || 'Kayıt güncellenirken bir hata oluştu');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt güncellenirken bir hata oluştu');
    }
  }

  async delete(comcode: string, bomdoctype: string, bomdocnum: string, contentnum: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrplebomcontent')
        .delete()
        .eq('comcode', comcode)
        .eq('bomdoctype', bomdoctype)
        .eq('bomdocnum', bomdocnum)
        .eq('contentnum', contentnum);

      if (error) {
        throw new BSMGRPLEBOMCONTENTError(error.message || 'Kayıt silinirken bir hata oluştu');
      }
    } catch (error) {
      this.handleError(error, 'Kayıt silinirken bir hata oluştu');
    }
  }

  async search(term: string): Promise<BSMGRPLEBOMCONTENT[]> {
    try {
      if (!term.trim()) {
        return this.getAll();
      }

      const { data, error } = await supabase
        .from('bsmgrplebomcontent')
        .select('*')
        .or(`comcode.ilike.%${term}%,bomdoctype.ilike.%${term}%,bomdocnum.ilike.%${term}%,component.ilike.%${term}%`);

      if (error) {
        throw new BSMGRPLEBOMCONTENTError('Kayıtlar aranırken bir hata oluştu');
      }

      return data || [];
    } catch (error) {
      this.handleError(error, 'Kayıtlar aranırken bir hata oluştu');
    }
  }

  async getByKeys(comcode: string, bomdoctype: string, bomdocnum: string, contentnum: number): Promise<BSMGRPLEBOMCONTENT> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomcontent')
        .select('*')
        .eq('comcode', comcode)
        .eq('bomdoctype', bomdoctype)
        .eq('bomdocnum', bomdocnum)
        .eq('contentnum', contentnum)
        .single();

      if (error) {
        throw new BSMGRPLEBOMCONTENTError('Kayıt alınırken bir hata oluştu');
      }

      if (!data) {
        throw new BSMGRPLEBOMCONTENTError('Kayıt bulunamadı');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'Kayıt alınırken bir hata oluştu');
    }
  }
}

export const bsmgrplebomcontentService = new BSMGRPLEBOMCONTENTService(); 