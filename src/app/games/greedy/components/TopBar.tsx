export default function TopBar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30
      flex justify-between items-start px-2 pt-2">

      <div className="flex items-center gap-1">
        <button className="w-9 h-9 bg-orange-400 rounded-full
          flex flex-col items-center justify-center gap-[3px]
          shadow-md">
          <span className="w-4 h-[2.5px] bg-white rounded"></span>
          <span className="w-4 h-[2.5px] bg-white rounded"></span>
          <span className="w-4 h-[2.5px] bg-white rounded"></span>
        </button>

        <button className="bg-orange-400 text-white text-xs font-bold
          px-3 py-1 rounded-full shadow-md">
          👥 Players
        </button>
      </div>

      <div className="flex flex-col items-end gap-1 mt-14">
        <div className="bg-blue-500 text-white text-[11px]
          px-3 py-1 rounded-lg font-bold shadow">
          Round 83257
        </div>

        <button className="bg-orange-400 text-white text-[11px]
          px-3 py-1 rounded-lg font-bold shadow">
          🕐 Record
        </button>
      </div>
    </header>
  );
}
