interface AdminCheckboxOption {
  label: string;
  value: string;
  helper?: string;
}

interface AdminCheckboxListProps {
  label: string;
  options: AdminCheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function AdminCheckboxList({
  label,
  options,
  selectedValues,
  onChange,
}: AdminCheckboxListProps) {
  function toggleValue(value: string) {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }

    onChange([...selectedValues, value]);
  }

  return (
    <div>
      <p className="mb-3 text-sm font-bold text-zinc-300">{label}</p>

      <div className="grid gap-3">
        {options.map((option) => {
          const checked = selectedValues.includes(option.value);

          return (
            <label
              key={option.value}
              className={[
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                checked
                  ? "border-yellow-400 bg-yellow-400/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-700",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleValue(option.value)}
                className="mt-1"
              />

              <span>
                <span className="block text-sm font-bold text-white">
                  {option.label}
                </span>

                {option.helper && (
                  <span className="mt-1 block text-xs text-zinc-500">
                    {option.helper}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
