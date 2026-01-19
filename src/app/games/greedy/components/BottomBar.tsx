export default function BottomBar() {
  return (
    <div className="absolute bottom-0 left-0 right-0
      flex justify-between items-center
      px-3 pb-4 pt-2 z-30 flex-wrap gap-2">

      <div className="flex items-center gap-2 bg-white/95
        px-3 py-2 rounded-full shadow">
        <span className="text-green-600 font-extrabold text-lg">G</span>
        <span className="font-extrabold text-green-800">60,900</span>
        <button className="w-6 h-6 bg-green-500 text-white
          rounded-full font-bold">+</button>
      </div>

      <div className="flex gap-2">
        {['100','1000','5000','10k','50k'].map(v=>(
          <button key={v}
            className="w-11 h-11 rounded-full
              bg-emerald-400 font-extrabold text-xs shadow">
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
