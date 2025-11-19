'use client';

import TeenPattiGame from "./TeenPattiGame";

export default function TeenPattiPage() {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white space-y-6">
    {TeenPattiGame()}
    </div>
  );
}
