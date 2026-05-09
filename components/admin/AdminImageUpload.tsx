"use client";

import { ChangeEvent, useMemo } from "react";

interface AdminImageUploadProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  helper?: string;
  accept?: string;
}

export function AdminImageUpload({
  label,
  file,
  onChange,
  helper,
  accept = "image/png,image/jpeg,image/jpg,image/webp,image/gif",
}: AdminImageUploadProps) {
  const previewUrl = useMemo(() => {
    if (!file) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [file]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    onChange(selectedFile);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:text-sm file:font-black file:text-zinc-950 hover:file:bg-yellow-300"
        />

        {helper && (
          <p className="mt-2 text-xs text-zinc-500">
            {helper}
          </p>
        )}

        {previewUrl && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <img
              src={previewUrl}
              alt="Preview da imagem"
              className="h-72 w-full object-contain"
            />
          </div>
        )}

        {file && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="mt-3 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-red-400 hover:text-red-300"
          >
            Remover imagem
          </button>
        )}
      </div>
    </div>
  );
}
