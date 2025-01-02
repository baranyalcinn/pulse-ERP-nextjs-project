import { supabase } from '@/lib/supabase';

export interface BSMGRPLEBOM001 {
  comcode: string;
  doctype: string;
  doctypetext: string;
  ispassive: number;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
}

export class BSMGRPLEBOM001Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BSMGRPLEBOM001Error';
  }
}

export const bsmgrplebom001Service = {
  async getAll(): Promise<BSMGRPLEBOM001[]> {
    const { data, error } = await supabase
      .from('bsmgrplebom001')
      .select('*')
      .order('createdat', { ascending: false });

    if (error) {
      throw new BSMGRPLEBOM001Error(error.message);
    }

    return data || [];
  },

  async getById(comcode: string, doctype: string): Promise<BSMGRPLEBOM001 | null> {
    const { data, error } = await supabase
      .from('bsmgrplebom001')
      .select('*')
      .eq('comcode', comcode)
      .eq('doctype', doctype)
      .single();

    if (error) {
      throw new BSMGRPLEBOM001Error(error.message);
    }

    return data;
  },

  async create(record: BSMGRPLEBOM001): Promise<void> {
    const { error } = await supabase
      .from('bsmgrplebom001')
      .insert([record]);

    if (error) {
      throw new BSMGRPLEBOM001Error(error.message);
    }
  },

  async update(comcode: string, doctype: string, record: BSMGRPLEBOM001): Promise<void> {
    const { error } = await supabase
      .from('bsmgrplebom001')
      .update(record)
      .eq('comcode', comcode)
      .eq('doctype', doctype);

    if (error) {
      throw new BSMGRPLEBOM001Error(error.message);
    }
  },

  async delete(comcode: string, doctype: string): Promise<void> {
    const { error } = await supabase
      .from('bsmgrplebom001')
      .delete()
      .eq('comcode', comcode)
      .eq('doctype', doctype);

    if (error) {
      throw new BSMGRPLEBOM001Error(error.message);
    }
  }
}; 