interface AdminSelectOption {
  label: string;
  value: string;
}

interface AdminSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: AdminSelectOption[];
  required?: boolean;
}

export function AdminSelect({
  label,
  value,
  onChange,
  options,
  required,
}: AdminSelectProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-zinc-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
