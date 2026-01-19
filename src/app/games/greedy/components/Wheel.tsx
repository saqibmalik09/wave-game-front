import Image from "next/image";
import Banana from "./Banana";
import Burger from "./Burger";
import Cherry from "./Cherry";
import Fish from "./Fish";
import Meat from "./Meat";
import Orange from "./Orange";
import Shrink from "./Shrink";
import Strawberry from "./Strawberry";

const cabins = [
    { pos: 'top-[2%] left-1/2', icon: <Burger />, mult: 'x10', index: 1 }, //burger 🍔
    { pos: 'top-[15%] left-[85%]', icon: <Shrink />, mult: 'x15', index: 2 },// Jheenga 🍤
    { pos: 'top-1/2 left-[98%]', icon: <Fish />, mult: 'x25', index: 3 }, //fish 🐟
    { pos: 'top-[85%] left-[85%]', icon: <Meat />, mult: 'x45', index: 4 }, //🥩 Meat
    { pos: 'top-[98%] left-1/2', icon: <Cherry />, mult: 'x5', index: 5 },//cherry🍒
    { pos: 'top-[85%] left-[15%]', icon: <Orange />, mult: 'x5', index: 6 },  //🍊 orange or grapes
    { pos: 'top-1/2 left-[2%]', icon: <Banana />, mult: 'x5', index: 7 }, //🍌 banana
    { pos: 'top-[15%] left-[15%]', icon: <Strawberry />, mult: 'x5', index: 8 }, //strawberry
];

export default function Wheel() {
    const handleCabinClicked = (index: number) => {
        console.log(`Cabin ${index} clicked!`);
        // You can add more logic here
    };

    return (
        <div className="relative w-full max-w-[280px] aspect-square">

            {/* ===== SPOKES ===== */}
            <svg
                viewBox="0 0 320 320"
                className="absolute inset-0 w-full h-full z-0"
            >
                {[
                    [160, 160, 160, 40],
                    [160, 160, 255, 65],
                    [160, 160, 280, 160],
                    [160, 160, 255, 255],
                    [160, 160, 160, 280],
                    [160, 160, 65, 255],
                    [160, 160, 40, 160],
                    [160, 160, 65, 65],
                ].map((l, i) => (
                    <line
                        key={i}
                        x1={l[0]}
                        y1={l[1]}
                        x2={l[2]}
                        y2={l[3]}
                        stroke="#fb923c"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                ))}
            </svg>

            {/* ===== CABINS ===== */}
            {cabins.map((c) => (
                <div
                    key={c.index}
                    onClick={() => handleCabinClicked(c.index)}
                    className={`absolute ${c.pos} -translate-x-1/2 -translate-y-1/2
                        w-[52px] h-[52px] bg-white rounded-full
                        flex flex-col items-center justify-center
                        font-bold shadow-lg z-10
                        cursor-pointer hover:scale-110 active:scale-95
                        transition-transform duration-200`}
                >
                    <span className="text-lg pointer-events-none">{c.icon}</span>
                </div>
            ))}

            {/* ===== CENTER HUB ===== */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[100px] h-[100px] bg-orange-400 rounded-full shadow-xl
                    flex flex-col items-center justify-center z-20 overflow-visible"
            >
                {/* Dealer Image */}
                <Image
                    src="/DealarAvatarGreedy-removebg-preview.png"
                    width={150}
                    height={150}
                    alt="Dealer"
                    className="absolute -top-10"
                />

                {/* Text stays inside hub */}
                <div className="text-white text-center font-bold text-sm leading-tight z-10">
                    <div className="text-[13px] font-semibold relative z-10 top-3">Select Time</div>
                    <div className="text-lg font-extrabold relative z-10 top-4">12s</div>
                </div>
            </div>
        </div>
    );
}