// src/components/RightPanel/LanguageSwitcher.jsx
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsChevronDown, BsChevronUp, BsCheck } from "react-icons/bs";
import { setLanguage, LANGUAGES } from "../../redux/Slice/languageSlice";

export default function LanguageSwitcher() {
  const dispatch = useDispatch();
  const current  = useSelector((s) => s.language.current);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (code) => {
    dispatch(setLanguage(code));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative  ">
      {/* Trigger — flag image + code */}
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center gap-0.5 w-full"
      >
        <img
          src={current.flag}
          alt={current.code}
          className="w-7 h-7 rounded-full object-cover ring-2"
          style={{ ringColor: open ? "var(--primary)" : "transparent" }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="flex items-center gap-0.5">
          <span className="text-[14px] text-content-text py-2 dark:text-white uppercase">
            {current.code}
          </span> 
          {open
            ? <BsChevronUp   className="w-3.5 h-3.5 text-gray-700" />
            : <BsChevronDown className="w-3.5 h-3.5 text-gray-700" />
          }
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-[70px] bg-bg-main bottom-0 z-[200] w-[180px] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900 overflow-hidden"
          style={{ animation: "dropUp 0.18s ease" }}
        >
          <style>{`
            @keyframes dropUp {
              from { opacity: 0; transform: translateY(8px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0)   scale(1); }
            }
          `}</style>

          <ul className="py-2">
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleSelect(lang.code)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  style={{ color: "var(--content-text, #374151)" }}
                >
                  {/* Flag image */}
                  <img
                    src={lang.flag}
                    alt={lang.code}
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                    onError={(e) => { e.target.replaceWith(
                      Object.assign(document.createElement('span'), { textContent: lang.code.toUpperCase(), className: 'text-xs font-bold w-6 text-center' })
                    )}}
                  />
                  <span className="flex-1  text-left">{lang.label}</span>
                  {current.code === lang.code && (
                    <BsCheck className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}