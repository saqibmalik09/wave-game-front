// bet category file in greedy

export default function BetCategory() {
  return (
    <div className="absolute bottom-[80px] left-[72px]
      flex gap-2 z-30">

      <button className="bg-orange-400 text-white
        px-1 py-1 rounded-xl text-xs font-bold shadow">
        🍊 🍒 🍓 🍌 All fruit
      </button>

      <button className="bg-orange-400 text-white
        px-1 py-1 rounded-xl text-xs font-bold shadow">
        🍤 🐟 🍔 🥩 All meats
      </button>
    </div>
  );
}
