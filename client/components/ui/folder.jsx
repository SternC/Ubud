import { useState } from "react";

const darkenColor = (hex, percent) => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) color = color.split("").map(c => c + c).join("");
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder = ({ color = "#0b2a45", size = 1, items = [], className = "", onPaperSelect = undefined }) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) papers.push(null);
  const [open, setOpen] = useState(false);
  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = darkenColor("#ffffff", 0.1);
  const paper2 = darkenColor("#ffffff", 0.05);
  const paper3 = "#ffffff";

  const handleClick = () => setOpen(prev => !prev);

  const scaleStyle = { transform: `scale(${size})` };
  const floatBottom = [70, 55, 40];
  const baseBottom = 10;

  return (
    <div style={scaleStyle} className={className}>
      <div className="group relative transition-all duration-200 ease-in cursor-pointer p-4" onClick={handleClick}>
        <div className="relative w-[120px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]" style={{ backgroundColor: folderBackColor }}>
          <span className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px]" style={{ backgroundColor: folderBackColor }}></span>

          {papers.map((item, i) => {
            let sizeClasses = "";
            if (i === 0) sizeClasses = "w-[70%] h-[80%]";
            if (i === 1) sizeClasses = "w-[80%] h-[70%]";
            if (i === 2) sizeClasses = "w-[90%] h-[60%]";
            return (
              <div
                key={i}
                className={`absolute z-20 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ${sizeClasses} flex flex-col`}
                style={{
                  backgroundColor: i === 0 ? paper1 : i === 1 ? paper2 : paper3,
                  borderRadius: "10px",
                  bottom: open ? `${floatBottom[i]}%` : `${baseBottom}%`,
                  cursor: item ? "pointer" : "default",
                  padding: "5px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item) {
                    if (typeof onPaperSelect === "function") onPaperSelect(item, i);
                  }
                }}
              >
                {item && (
                  <div className="text-xs font-bold text-gray-700 mb-1 text-center">
                    {item.chapter}
                  </div>
                )}
              </div>
            );
          })}

          <div className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${open ? "[transform:skew(15deg)_scaleY(0.6)]" : ""}`} style={{ backgroundColor: color, borderRadius: "5px 10px 10px 10px" }}></div>
          <div className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${open ? "[transform:skew(-15deg)_scaleY(0.6)]" : ""}`} style={{ backgroundColor: color, borderRadius: "5px 10px 10px 10px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Folder;