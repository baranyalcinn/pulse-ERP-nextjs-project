import { supabase } from '@/lib/supabase';

export interface BSMGRPLEBOM002 {
  comcode: string;
  doctype: string;
  docnum: string;
  docdate: string;
  docstatus: number;
  ispassive: number;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
}

export class BSMGRPLEBOM002Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BSMGRPLEBOM002Error';
  }
}

export const bsmgrplebom002Service = {
  async getAll(): Promise<BSMGRPLEBOM002[]> {
    const { data, error } = await supabase
      .from('bsmgrplebom002')
      .select('*')
      .order('createdat', { ascending: false });

    if (error) {
      throw new BSMGRPLEBOM002Error(error.message);
    }

    return data || [];
  },

  async getById(comcode: string, doctype: string, docnum: string): Promise<BSMGRPLEBOM002 | null> {
    const { data, error } = await supabase
      .from('bsmgrplebom002')
      .select('*')
      .eq('comcode', comcode)
      .eq('doctype', doctype)
      .eq('docnum', docnum)
      .single();

    if (error) {
      throw new BSMGRPLEBOM002Error(error.message);
    }

    return data;
  },

  async create(record: BSMGRPLEBOM002): Promise<void> {
    const { error } = await supabase
      .from('bsmgrplebom002')
      .insert([record]);

    if (error) {
      throw new BSMGRPLEBOM002Error(error.message);
    }
  },

  async update(comcode: string, doctype: string, docnum: string, record: BSMGRPLEBOM002): Promise<void> {
    const { error } = await supabase
      .from('bsmgrplebom002')
      .update(record)
      .eq('comcode', comcode)
      .eq('doctype', doctype)
      .eq('docnum', docnum);

    if (error) {
      throw new BSMGRPLEBOM002Error(error.message);
    }
  },

  async delete(comcode: string, doctype: string, docnum: string): Promise<void> {
    const { error } = await supabase
      .from('bsmgrplebom002')
      .delete()
      .eq('comcode', comcode)
      .eq('doctype', doctype)
      .eq('docnum', docnum);

    if (error) {
      throw new BSMGRPLEBOM002Error(error.message);
    }
  }
}; 