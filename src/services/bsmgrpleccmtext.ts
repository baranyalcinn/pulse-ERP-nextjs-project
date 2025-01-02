import { supabase } from '@/lib/supabase';

export interface BSMGRPLECCMTEXT {
  comcode: string;
  ccmdoctype: string;
  ccmdocnum: string;
  ccmdocfrom: Date;
  ccmdocuntil: Date;
  lancode: string;
  ccmstext: string;
  ccmltext: string;
  isdeleted: number;
  ispassive: number;
}

export class BSMGRPLECCMTEXTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BSMGRPLECCMTEXTError';
  }
}

export const bsmgrpleccmtextService = {
  async getAll(): Promise<BSMGRPLECCMTEXT[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccmtext')
        .select('*')
        .order('comcode', { ascending: true });

      if (error) {
        throw new BSMGRPLECCMTEXTError(error.message);
      }

      return data || [];
    } catch (error) {
      if (error instanceof BSMGRPLECCMTEXTError) {
        throw error;
      }
      throw new BSMGRPLECCMTEXTError('CCM Text verileri alınırken bir hata oluştu.');
    }
  },

  async getByKeys(comcode: string, ccmdoctype: string, ccmdocnum: string, lancode: string): Promise<BSMGRPLECCMTEXT | null> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccmtext')
        .select('*')
        .eq('comcode', comcode)
        .eq('ccmdoctype', ccmdoctype)
        .eq('ccmdocnum', ccmdocnum)
        .eq('lancode', lancode)
        .single();

      if (error) {
        throw new BSMGRPLECCMTEXTError(error.message);
      }

      return data;
    } catch (error) {
      if (error instanceof BSMGRPLECCMTEXTError) {
        throw error;
      }
      throw new BSMGRPLECCMTEXTError('CCM Text verisi alınırken bir hata oluştu.');
    }
  },

  async create(data: BSMGRPLECCMTEXT): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrpleccmtext')
        .insert([data]);

      if (error) {
        throw new BSMGRPLECCMTEXTError(error.message);
      }
    } catch (error) {
      if (error instanceof BSMGRPLECCMTEXTError) {
        throw error;
      }
      throw new BSMGRPLECCMTEXTError('CCM Text oluşturulurken bir hata oluştu.');
    }
  },

  async update(comcode: string, ccmdoctype: string, ccmdocnum: string, lancode: string, data: BSMGRPLECCMTEXT): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrpleccmtext')
        .update(data)
        .eq('comcode', comcode)
        .eq('ccmdoctype', ccmdoctype)
        .eq('ccmdocnum', ccmdocnum)
        .eq('lancode', lancode);

      if (error) {
        throw new BSMGRPLECCMTEXTError(error.message);
      }
    } catch (error) {
      if (error instanceof BSMGRPLECCMTEXTError) {
        throw error;
      }
      throw new BSMGRPLECCMTEXTError('CCM Text güncellenirken bir hata oluştu.');
    }
  },

  async delete(comcode: string, ccmdoctype: string, ccmdocnum: string, lancode: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrpleccmtext')
        .delete()
        .eq('comcode', comcode)
        .eq('ccmdoctype', ccmdoctype)
        .eq('ccmdocnum', ccmdocnum)
        .eq('lancode', lancode);

      if (error) {
        throw new BSMGRPLECCMTEXTError(error.message);
      }
    } catch (error) {
      if (error instanceof BSMGRPLECCMTEXTError) {
        throw error;
      }
      throw new BSMGRPLECCMTEXTError('CCM Text silinirken bir hata oluştu.');
    }
  },

  async search(searchTerm: string): Promise<BSMGRPLECCMTEXT[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrpleccmtext')
        .select('*')
        .or(
          `comcode.ilike.%${searchTerm}%,` +
          `ccmdoctype.ilike.%${searchTerm}%,` +
          `ccmdocnum.ilike.%${searchTerm}%,` +
          `lancode.ilike.%${searchTerm}%,` +
          `ccmstext.ilike.%${searchTerm}%,` +
          `ccmltext.ilike.%${searchTerm}%`
        )
        .order('comcode', { ascending: true });

      if (error) {
        throw new BSMGRPLECCMTEXTError(error.message);
      }

      return data || [];
    } catch (error) {
      if (error instanceof BSMGRPLECCMTEXTError) {
        throw error;
      }
      throw new BSMGRPLECCMTEXTError('CCM Text arama sırasında bir hata oluştu.');
    }
  }
}; 