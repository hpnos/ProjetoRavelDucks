interface AdminTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
}: AdminTextareaProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
      />
    </div>
  );
}
