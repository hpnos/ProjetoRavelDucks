import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { adminPacks, adminUsers } from "@/lib/admin-mock-data";

export default function AdminGrantPackPage() {
  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Liberar pacote"
        description="Simule a liberação de um pacote para um usuário. Futuramente essa ação criará um pacote disponível na tela /pacotes do usuário."
      />

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
        <form className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Usuário
            </label>

            <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400">
              {adminUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName} (@{user.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Pacote
            </label>

            <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400">
              {adminPacks.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name} - {pack.cardsQuantity} cartas
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Motivo da liberação
            </label>

            <select className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400">
              <option value="live_purchase">Compra/combinação na live</option>
              <option value="event_reward">Recompensa de evento</option>
              <option value="manual_bonus">Bônus manual</option>
              <option value="admin">Ajuste admin</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Observação
            </label>

            <textarea
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
              placeholder="Ex: Pacote liberado após participação no evento da live."
            />
          </div>

          <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-200">
            Nesta versão visual, o botão ainda não salva no banco. Na etapa do
            Firebase, essa ação criará um registro em grantedPacks.
          </div>

          <button
            type="button"
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Liberar pacote
          </button>
        </form>
      </section>
    </AdminLayout>
  );
}
