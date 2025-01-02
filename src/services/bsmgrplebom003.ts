import { supabase } from '@/lib/supabase';

export interface BSMGRPLEBOM003 {
  comcode: string;
  doctype: string;
  docnum: string;
  linenum: number;
  itemcode: string;
  itemname: string;
  quantity: number;
  unit: string;
  ispassive: number;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
}

export class BSMGRPLEBOM003Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BSMGRPLEBOM003Error';
  }
}

export const bsmgrplebom003Service = {
  async getAll(): Promise<BSMGRPLEBOM003[]> {
    const { data, error } = await supabase
      .from('bsmgrplebom003')
      .select('*')
      .order('createdat', { ascending: false });

    if (error) {
      throw new BSMGRPLEBOM003Error(error.message);
    }

    return data || [];
  },

  async getById(comcode: string, doctype: string, docnum: string, linenum: number): Promise<BSMGRPLEBOM003 | null> {
    const { data, error } = await supabase
      .from('bsmgrplebom003')
      .select('*')
      .eq('comcode', comcode)
      .eq('doctype', doctype)
      .eq('docnum', docnum)
      .eq('linenum', linenum)
      .single();

    if (error) {
      throw new BSMGRPLEBOM003Error(error.message);
    }

    return data;
  },

  async create(record: BSMGRPLEBOM003): Promise<void> {
    const { error } = await supabase
      .from('bsmgrplebom003')
      .insert([record]);

    if (error) {
      throw new BSMGRPLEBOM003Error(error.message);
    }
  },

  async update(comcode: string, doctype: string, docnum: string, linenum: number, record: BSMGRPLEBOM003): Promise<void> {
    const { error } = await supabase
      .from('bsmgrplebom003')
      .update(record)
      .eq('comcode', comcode)
      .eq('doctype', doctype)
      .eq('docnum', docnum)
      .eq('linenum', linenum);

    if (error) {
      throw new BSMGRPLEBOM003Error(error.message);
    }
  },

  async delete(comcode: string, doctype: string, docnum: string, linenum: number): Promise<void> {
    const { error } = await supabase
      .from('bsmgrplebom003')
      .delete()
      .eq('comcode', comcode)
      .eq('doctype', doctype)
      .eq('docnum', docnum)
      .eq('linenum', linenum);

    if (error) {
      throw new BSMGRPLEBOM003Error(error.message);
    }
  }
}; 