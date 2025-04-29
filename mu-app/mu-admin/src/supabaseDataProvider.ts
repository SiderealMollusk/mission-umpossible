// src/supabaseDataProvider.ts
import { DataProvider } from 'react-admin';
import { supabase } from './supabase';

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const page = params?.pagination?.page ?? 1;
    const perPage = params?.pagination?.perPage ?? 10;

    const { data, error, count } = await supabase
      .from(resource)
      .select('*', { count: 'exact' })
      .range(
        (page - 1) * perPage,
        page * perPage - 1
      );

    if (error) throw new Error(error.message);

    return {
      data: data || [],
      total: count || 0,
    };
  },

  getOne: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw new Error(error.message);

    return { data };
  },

  create: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .insert(params.data)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { data };
  },

  update: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .update(params.data)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { data };
  },

  delete: async (resource, params) => {
    const { data, error } = await supabase
      .from(resource)
      .delete()
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { data };
  },

  // Optional: you can leave these as unimplemented if you don't need them yet
  getMany: async () => { throw new Error('Not implemented'); },
  getManyReference: async () => { throw new Error('Not implemented'); },
  deleteMany: async () => { throw new Error('Not implemented'); },
  updateMany: async () => { throw new Error('Not implemented'); },
};