import { supabase } from '@/lib/supabase';
import { BSMGRPLEBOM001, BSMGRPLEBOMHEAD, BSMGRPLEBOMCONTENT, BOMError } from './types';

// BOM Tipleri Servisi
export const bomTypeService = {
  async getAll(): Promise<BSMGRPLEBOM001[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebom001')
        .select('*')
        .order('comcode, doctype');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM tipleri alınamadı', error?.code);
    }
  },

  async getByKeys(comcode: string, doctype: string): Promise<BSMGRPLEBOM001> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebom001')
        .select('*')
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .single();

      if (error) throw error;
      if (!data) throw new BOMError('BOM tipi bulunamadı');
      return data;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM tipi alınamadı', error?.code);
    }
  },

  async create(bomType: BSMGRPLEBOM001): Promise<BSMGRPLEBOM001> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebom001')
        .insert([bomType])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM tipi oluşturulamadı', error?.code);
    }
  },

  async update(comcode: string, doctype: string, bomType: BSMGRPLEBOM001): Promise<BSMGRPLEBOM001> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebom001')
        .update(bomType)
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM tipi güncellenemedi', error?.code);
    }
  },

  async delete(comcode: string, doctype: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrplebom001')
        .delete()
        .eq('comcode', comcode)
        .eq('doctype', doctype);

      if (error) throw error;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM tipi silinemedi', error?.code);
    }
  }
};

// BOM Başlık Servisi
export const bomHeaderService = {
  async getAll(): Promise<BSMGRPLEBOMHEAD[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomhead')
        .select('*')
        .order('comcode, doctype, docnum');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM başlıkları alınamadı', error?.code);
    }
  },

  async getByKeys(comcode: string, doctype: string, docnum: string): Promise<BSMGRPLEBOMHEAD> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomhead')
        .select('*')
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .eq('docnum', docnum)
        .single();

      if (error) throw error;
      if (!data) throw new BOMError('BOM başlığı bulunamadı');
      return data;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM başlığı alınamadı', error?.code);
    }
  },

  async create(header: BSMGRPLEBOMHEAD): Promise<BSMGRPLEBOMHEAD> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomhead')
        .insert([header])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM başlığı oluşturulamadı', error?.code);
    }
  },

  async update(comcode: string, doctype: string, docnum: string, header: BSMGRPLEBOMHEAD): Promise<BSMGRPLEBOMHEAD> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomhead')
        .update(header)
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .eq('docnum', docnum)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM başlığı güncellenemedi', error?.code);
    }
  },

  async delete(comcode: string, doctype: string, docnum: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrplebomhead')
        .delete()
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .eq('docnum', docnum);

      if (error) throw error;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM başlığı silinemedi', error?.code);
    }
  }
};

// BOM İçerik Servisi
export const bomContentService = {
  async getAll(): Promise<BSMGRPLEBOMCONTENT[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomcontent')
        .select('*')
        .order('comcode, doctype, docnum, linenum');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM içerikleri alınamadı', error?.code);
    }
  },

  async getByHeader(comcode: string, doctype: string, docnum: string): Promise<BSMGRPLEBOMCONTENT[]> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomcontent')
        .select('*')
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .eq('docnum', docnum)
        .order('linenum');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM içerikleri alınamadı', error?.code);
    }
  },

  async create(content: BSMGRPLEBOMCONTENT): Promise<BSMGRPLEBOMCONTENT> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomcontent')
        .insert([content])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM içeriği oluşturulamadı', error?.code);
    }
  },

  async update(
    comcode: string, 
    doctype: string, 
    docnum: string, 
    linenum: number, 
    content: BSMGRPLEBOMCONTENT
  ): Promise<BSMGRPLEBOMCONTENT> {
    try {
      const { data, error } = await supabase
        .from('bsmgrplebomcontent')
        .update(content)
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .eq('docnum', docnum)
        .eq('linenum', linenum)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM içeriği güncellenemedi', error?.code);
    }
  },

  async delete(comcode: string, doctype: string, docnum: string, linenum: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('bsmgrplebomcontent')
        .delete()
        .eq('comcode', comcode)
        .eq('doctype', doctype)
        .eq('docnum', docnum)
        .eq('linenum', linenum);

      if (error) throw error;
    } catch (error: any) {
      throw new BOMError(error.message || 'BOM içeriği silinemedi', error?.code);
    }
  }
}; 