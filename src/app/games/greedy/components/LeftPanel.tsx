// LeftPanel
export default function LeftPanel() {
  return (
    <aside className="absolute left-1 top-1/2 -translate-y-1/2
      w-14 h-[40%] bg-orange-400 rounded-xl
      flex flex-col items-center gap-2
      px-1 py-2 shadow-lg z-20">

      <div className="text-white text-[10px] font-extrabold">TOP5</div>
      <div className="text-white text-[9px] text-center font-semibold">
        Eat what?
      </div>
      <div className="text-white text-[9px] font-semibold">
        No Winner
      </div>
    </aside>
  );
}
