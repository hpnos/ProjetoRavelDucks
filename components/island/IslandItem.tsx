import { IslandItem as IslandItemType } from "@/types/island";

interface IslandItemProps {
  item: IslandItemType;
}

const itemIcon = {
  duck: "🦆",
  decoration: "🌴",
  accessory: "🎩",
  background: "🏝️",
  special: "🚩",
};

export function IslandItem({ item }: IslandItemProps) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: item.position.left,
        top: item.position.top,
      }}
    >
      <div className="group relative flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950/70 shadow-xl backdrop-blur">
        <span className="text-3xl">{itemIcon[item.type]}</span>

        <div className="absolute -bottom-8 left-1/2 hidden min-w-[120px] -translate-x-1/2 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-center shadow-xl group-hover:block">
          <p className="text-xs font-bold text-white">{item.name}</p>
        </div>
      </div>
    </div>
  );
}
