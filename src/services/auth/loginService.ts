import { supabase } from '@/lib/supabase';
import { LOGIN } from './types';

const getAll = async () => {
  const { data, error } = await supabase
    .from('login')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data as LOGIN[];
};

const getById = async (userid: number) => {
  const { data, error } = await supabase
    .from('login')
    .select('*')
    .eq('userid', userid)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as LOGIN;
};

const create = async (login: LOGIN) => {
  const { error } = await supabase
    .from('login')
    .insert(login);

  if (error) {
    throw new Error(error.message);
  }
};

const update = async (userid: number, login: LOGIN) => {
  const { error } = await supabase
    .from('login')
    .update(login)
    .eq('userid', userid);

  if (error) {
    throw new Error(error.message);
  }
};

const remove = async (userid: number) => {
  const { error } = await supabase
    .from('login')
    .delete()
    .eq('userid', userid);

  if (error) {
    throw new Error(error.message);
  }
};

const authenticate = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from('login')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error) {
    throw new Error('Kullanıcı adı veya şifre hatalı');
  }

  return data as LOGIN;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  authenticate
}; 