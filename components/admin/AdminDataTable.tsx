import { ReactNode } from "react";

interface AdminDataTableProps {
  headers: string[];
  children: ReactNode;
}

export function AdminDataTable({ headers, children }: AdminDataTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead className="bg-zinc-900">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-zinc-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">{children}</tbody>
        </table>
      </div>
    </section>
  );
}
