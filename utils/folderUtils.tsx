// src/utils/supabaseUtils.ts

import { supabase } from '@/lib/supabase';

export const listFiles = async (path: string) => {
  return await supabase.storage.from('files').list(path);
};

export const uploadFile = async (path: string, content: ArrayBuffer, contentType: string) => {
  return await supabase.storage.from('files').upload(path, content, { contentType });
};

export const deleteFile = async (path: string) => {
  return await supabase.storage.from('files').remove([path]);
};

export const moveFile = async (fromPath: string, toPath: string) => {
  return await supabase.storage.from('files').move(fromPath, toPath);
};

export const createFolder = async (path: string) => {
  const placeholderPath = `${path}/.placeholder`;
  const blobContent = new Blob([''], { type: 'application/octet-stream' });
  return await supabase.storage.from('files').upload(placeholderPath, blobContent, { upsert: false });
};