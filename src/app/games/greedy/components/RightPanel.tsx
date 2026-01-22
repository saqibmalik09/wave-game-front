//RightPanel file
 
export default function RightPanel() {
  return (
    <aside className="absolute right-1 top-1/2 -translate-y-1/2
      w-14 bg-blue-500 rounded-xl px-1 py-2
      flex flex-col items-center gap-2 shadow-lg z-20">

      <div className="text-white text-[10px] font-extrabold">
        Result
      </div>

      <div className="flex flex-col gap-1">
        {['🍓','🍒','🍓','🍓','🍊','🍒'].map((i,idx)=>(
          <div key={idx}
            className="w-8 h-8 bg-white rounded-lg
              flex items-center justify-center text-lg shadow">
            {i}
          </div>
        ))}
      </div>
    </aside>
  );
}
