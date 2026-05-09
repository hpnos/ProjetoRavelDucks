interface AdminInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email";
  required?: boolean;
}

export function AdminInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: AdminInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        required={required}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
      />
    </div>
  );
}
