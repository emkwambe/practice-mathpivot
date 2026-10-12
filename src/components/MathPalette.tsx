import { useMemo, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { ChevronDown, ChevronUp, Undo2, Redo2 } from "lucide-react";

export interface MathPaletteProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInsert: (text: string, cursorOffset: number) => void;
  subject: "integration" | "differentiation" | "limits" | "applications-derivatives" | "applications-integration" | "differential-equations" | "sequences-series" | "math1-eoc" | "math3-eoc" | "math6-eog" | "math7-eog" | "math8-eog";
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

type PaletteButton = {
  /** Accessible name and text fallback */
  label: string;
  /** LaTeX used to render the button face (defaults to `label`) */
  latex?: string;
  insert: string;
  cursorOffset: number;
};

const SUGGESTED_BUTTONS: Record<MathPaletteProps["subject"], PaletteButton[]> = {
  integration: [
    { label: "integral", latex: "\\int", insert: "\\int ", cursorOffset: 0 },
    { label: "dx", latex: "dx", insert: "\\, dx", cursorOffset: 0 },
    { label: "+C", latex: "+\\, C", insert: " + C", cursorOffset: 0 },
    { label: "x squared", latex: "x^{2}", insert: "x^{2}", cursorOffset: 0 },
    { label: "x to the n", latex: "x^{n}", insert: "x^{n}", cursorOffset: 0 },
    { label: "e to the x", latex: "e^{x}", insert: "e^{x}", cursorOffset: 0 },
    { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "sine", latex: "\\sin", insert: "\\sin()", cursorOffset: -1 },
    { label: "cosine", latex: "\\cos", insert: "\\cos()", cursorOffset: -1 },
    { label: "natural log", latex: "\\ln", insert: "\\ln()", cursorOffset: -1 },
    { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
    { label: "absolute value", latex: "|x|", insert: "\\left|  \\right|", cursorOffset: -8 },
  ],
  differentiation: [
    { label: "d by dx", latex: "\\frac{d}{dx}", insert: "\\frac{d}{dx}", cursorOffset: 0 },
    { label: "partial by partial x", latex: "\\frac{\\partial}{\\partial x}", insert: "\\frac{\\partial}{\\partial x}", cursorOffset: 0 },
    { label: "x squared", latex: "x^{2}", insert: "x^{2}", cursorOffset: 0 },
    { label: "x to the n", latex: "x^{n}", insert: "x^{n}", cursorOffset: 0 },
    { label: "e to the x", latex: "e^{x}", insert: "e^{x}", cursorOffset: 0 },
    { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "sine", latex: "\\sin", insert: "\\sin()", cursorOffset: -1 },
    { label: "cosine", latex: "\\cos", insert: "\\cos()", cursorOffset: -1 },
    { label: "natural log", latex: "\\ln", insert: "\\ln()", cursorOffset: -1 },
    { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
    { label: "absolute value", latex: "|x|", insert: "\\left|  \\right|", cursorOffset: -8 },
  ],
  limits: [
    { label: "limit", latex: "\\lim_{x \\to a}", insert: "\\lim_{x \\to }", cursorOffset: 0 },
    { label: "approaches", latex: "\\to", insert: " \\to ", cursorOffset: 0 },
    { label: "infinity", latex: "\\infty", insert: "\\infty", cursorOffset: 0 },
    { label: "x squared", latex: "x^{2}", insert: "x^{2}", cursorOffset: 0 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "sine", latex: "\\sin", insert: "\\sin()", cursorOffset: -1 },
    { label: "cosine", latex: "\\cos", insert: "\\cos()", cursorOffset: -1 },
    { label: "natural log", latex: "\\ln", insert: "\\ln()", cursorOffset: -1 },
    { label: "e to the x", latex: "e^{x}", insert: "e^{x}", cursorOffset: 0 },
    { label: "absolute value", latex: "|x|", insert: "\\left|  \\right|", cursorOffset: -8 },
  ],
  "applications-derivatives": [
    { label: "d by dt", latex: "\\frac{d}{dt}", insert: "\\frac{d}{dt}", cursorOffset: 0 },
    { label: "d by dx", latex: "\\frac{d}{dx}", insert: "\\frac{d}{dx}", cursorOffset: 0 },
    { label: "x squared", latex: "x^{2}", insert: "x^{2}", cursorOffset: 0 },
    { label: "x cubed", latex: "x^{3}", insert: "x^{3}", cursorOffset: 0 },
    { label: "decimal point", latex: "0.01", insert: "0.0", cursorOffset: 0 },
    { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
    { label: "sine", latex: "\\sin", insert: "\\sin()", cursorOffset: -1 },
    { label: "natural log", latex: "\\ln", insert: "\\ln()", cursorOffset: -1 },
    { label: "e to the x", latex: "e^{x}", insert: "e^{x}", cursorOffset: 0 },
    { label: "equals zero", latex: "= 0", insert: " = 0", cursorOffset: 0 },
  ],
  "applications-integration": [
    { label: "integral", latex: "\\int", insert: "\\int ", cursorOffset: 0 },
    { label: "definite integral", latex: "\\int_{a}^{b}", insert: "\\int_{}^{} ", cursorOffset: -5 },
    { label: "dx", latex: "dx", insert: "\\, dx", cursorOffset: 0 },
    { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
    { label: "x squared", latex: "x^{2}", insert: "x^{2}", cursorOffset: 0 },
    { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "decimal point", latex: "0.01", insert: "0.0", cursorOffset: 0 },
    { label: "sine", latex: "\\sin", insert: "\\sin()", cursorOffset: -1 },
    { label: "e to the x", latex: "e^{x}", insert: "e^{x}", cursorOffset: 0 },
    { label: "natural log", latex: "\\ln", insert: "\\ln()", cursorOffset: -1 },
    { label: "infinity", latex: "\\infty", insert: "\\infty", cursorOffset: 0 },
  ],
  "differential-equations": [
    { label: "e to the x", latex: "e^{x}", insert: "e^{x}", cursorOffset: 0 },
    { label: "e to the minus x", latex: "e^{-x}", insert: "e^{-x}", cursorOffset: 0 },
    { label: "x squared", latex: "x^{2}", insert: "x^{2}", cursorOffset: 0 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "natural log", latex: "\\ln", insert: "\\ln()", cursorOffset: -1 },
    { label: "sine", latex: "\\sin", insert: "\\sin()", cursorOffset: -1 },
    { label: "cosine", latex: "\\cos", insert: "\\cos()", cursorOffset: -1 },
    { label: "plus C", latex: "+\\, C", insert: " + C", cursorOffset: 0 },
    { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
    { label: "open paren", latex: "(", insert: "(", cursorOffset: 0 },
    { label: "close paren", latex: ")", insert: ")", cursorOffset: 0 },
    { label: "minus", latex: "-", insert: " - ", cursorOffset: 0 },
  ],
  "sequences-series": [
    { label: "summation", latex: "\\sum_{n=1}^{\\infty}", insert: "\\sum_{}^{}", cursorOffset: -5 },
    { label: "infinity", latex: "\\infty", insert: "\\infty", cursorOffset: 0 },
    { label: "minus 1 to the n", latex: "(-1)^{n}", insert: "(-1)^{n}", cursorOffset: 0 },
    { label: "n", latex: "n", insert: "n", cursorOffset: 0 },
    { label: "x to the n", latex: "x^{n}", insert: "x^{n}", cursorOffset: 0 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
    { label: "natural log", latex: "\\ln", insert: "\\ln()", cursorOffset: -1 },
    { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
    { label: "open paren", latex: "(", insert: "(", cursorOffset: 0 },
    { label: "close paren", latex: ")", insert: ")", cursorOffset: 0 },
    { label: "minus", latex: "-", insert: " - ", cursorOffset: 0 },
  ],
  "math1-eoc": [
    { label: "fraction slash", latex: "a/b", insert: "/", cursorOffset: 0 },
    { label: "decimal point", latex: "0.1", insert: ".", cursorOffset: 0 },
    { label: "minus", latex: "-", insert: "-", cursorOffset: 0 },
    { label: "x squared", latex: "x^{2}", insert: "x^{2}", cursorOffset: 0 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
    { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
    { label: "open paren", latex: "(", insert: "(", cursorOffset: 0 },
    { label: "close paren", latex: ")", insert: ")", cursorOffset: 0 },
  ],
  "math3-eoc": [
    { label: "fraction slash", latex: "a/b", insert: "/", cursorOffset: 0 },
    { label: "decimal point", latex: "0.1", insert: ".", cursorOffset: 0 },
    { label: "minus", latex: "-", insert: "-", cursorOffset: 0 },
    { label: "x squared", latex: "x^{2}", insert: "x^{2}", cursorOffset: 0 },
    { label: "x cubed", latex: "x^{3}", insert: "x^{3}", cursorOffset: 0 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
    { label: "cube root", latex: "\\sqrt[3]{x}", insert: "\\sqrt[3]{}", cursorOffset: -1 },
    { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
    { label: "degrees", latex: "^{\\circ}", insert: "^{\\circ}", cursorOffset: 0 },
  ],
  "math7-eog": [
    { label: "fraction slash", latex: "a/b", insert: "/", cursorOffset: 0 },
    { label: "decimal point", latex: "0.1", insert: ".", cursorOffset: 0 },
    { label: "minus", latex: "-", insert: "-", cursorOffset: 0 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
    { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
    { label: "degrees", latex: "^{\\circ}", insert: "^{\\circ}", cursorOffset: 0 },
    { label: "open paren", latex: "(", insert: "(", cursorOffset: 0 },
    { label: "close paren", latex: ")", insert: ")", cursorOffset: 0 },
  ],
  "math6-eog": [
    { label: "fraction slash", latex: "a/b", insert: "/", cursorOffset: 0 },
    { label: "decimal point", latex: "0.1", insert: ".", cursorOffset: 0 },
    { label: "minus", latex: "-", insert: "-", cursorOffset: 0 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
    { label: "percent", latex: "\\%", insert: "\\%", cursorOffset: 0 },
    { label: "degrees", latex: "^{\\circ}", insert: "^{\\circ}", cursorOffset: 0 },
    { label: "open paren", latex: "(", insert: "(", cursorOffset: 0 },
    { label: "close paren", latex: ")", insert: ")", cursorOffset: 0 },
  ],
  "math8-eog": [
    { label: "fraction slash", latex: "a/b", insert: "/", cursorOffset: 0 },
    { label: "decimal point", latex: "0.1", insert: ".", cursorOffset: 0 },
    { label: "minus", latex: "-", insert: "-", cursorOffset: 0 },
    { label: "x squared", latex: "x^{2}", insert: "x^{2}", cursorOffset: 0 },
    { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
    { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
    { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
    { label: "degrees", latex: "^{\\circ}", insert: "^{\\circ}", cursorOffset: 0 },
    { label: "open paren", latex: "(", insert: "(", cursorOffset: 0 },
    { label: "close paren", latex: ")", insert: ")", cursorOffset: 0 },
  ],
};

const ALGEBRA_BUTTONS: PaletteButton[] = [
  { label: "x", latex: "x", insert: "x", cursorOffset: 0 },
  { label: "x squared", latex: "x^{2}", insert: "x^{2}", cursorOffset: 0 },
  { label: "x to the n", latex: "x^{n}", insert: "x^{n}", cursorOffset: 0 },
  { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{}", cursorOffset: -1 },
  { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{}{}", cursorOffset: -3 },
  { label: "plus", latex: "+", insert: " + ", cursorOffset: 0 },
  { label: "minus", latex: "-", insert: " - ", cursorOffset: 0 },
  { label: "times", latex: "\\cdot", insert: "\\cdot ", cursorOffset: 0 },
  { label: "equals", latex: "=", insert: " = ", cursorOffset: 0 },
  { label: "open paren", latex: "(", insert: "(", cursorOffset: 0 },
  { label: "close paren", latex: ")", insert: ")", cursorOffset: 0 },
  { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
  { label: "absolute value", latex: "|x|", insert: "\\left|  \\right|", cursorOffset: -8 },
];

const FUNCTIONS_BUTTONS: PaletteButton[] = [
  { label: "sine", latex: "\\sin", insert: "\\sin()", cursorOffset: -1 },
  { label: "cosine", latex: "\\cos", insert: "\\cos()", cursorOffset: -1 },
  { label: "tangent", latex: "\\tan", insert: "\\tan()", cursorOffset: -1 },
  { label: "natural log", latex: "\\ln", insert: "\\ln()", cursorOffset: -1 },
  { label: "log", latex: "\\log", insert: "\\log()", cursorOffset: -1 },
  { label: "e to the x", latex: "e^{x}", insert: "e^{x}", cursorOffset: 0 },
  { label: "pi", latex: "\\pi", insert: "\\pi", cursorOffset: 0 },
  { label: "theta", latex: "\\theta", insert: "\\theta", cursorOffset: 0 },
];

const CALCULUS_BUTTONS: PaletteButton[] = [
  { label: "integral", latex: "\\int", insert: "\\int ", cursorOffset: 0 },
  { label: "d by dx", latex: "\\frac{d}{dx}", insert: "\\frac{d}{dx}", cursorOffset: 0 },
  { label: "partial by partial x", latex: "\\frac{\\partial}{\\partial x}", insert: "\\frac{\\partial}{\\partial x}", cursorOffset: 0 },
  { label: "limit", latex: "\\lim_{x \\to a}", insert: "\\lim_{x \\to }", cursorOffset: 0 },
  { label: "infinity", latex: "\\infty", insert: "\\infty", cursorOffset: 0 },
  { label: "dx", latex: "dx", insert: "\\, dx", cursorOffset: 0 },
  { label: "+C", latex: "+\\, C", insert: " + C", cursorOffset: 0 },
  { label: "e to the x", latex: "e^{x}", insert: "e^{x}", cursorOffset: 0 },
];

type TabKey = "suggested" | "algebra" | "functions" | "calculus";

const TABS: { key: TabKey; label: string }[] = [
  { key: "suggested", label: "Suggested" },
  { key: "algebra", label: "Algebra" },
  { key: "functions", label: "Functions" },
  { key: "calculus", label: "Calculus" },
];

function KatexLabel({ latex }: { latex: string }) {
  const html = useMemo(
    () =>
      katex.renderToString(latex, {
        throwOnError: false,
        displayMode: false,
        strict: false,
      }),
    [latex],
  );
  return (
    <span
      className="pointer-events-none inline-flex items-center leading-none [&_.katex]:text-[0.95em]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function MathPalette({
  inputRef,
  onInsert,
  subject,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: MathPaletteProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("suggested");
  const [isOpen, setIsOpen] = useState(true);

  const handleInsert = (button: PaletteButton) => {
    onInsert(button.insert, button.cursorOffset);
    inputRef.current?.focus();
  };

  const getButtons = (): PaletteButton[] => {
    switch (activeTab) {
      case "suggested":
        return SUGGESTED_BUTTONS[subject];
      case "algebra":
        return ALGEBRA_BUTTONS;
      case "functions":
        return FUNCTIONS_BUTTONS;
      case "calculus":
        return CALCULUS_BUTTONS;
      default:
        return [];
    }
  };

  const historyButtonClass = (enabled: boolean) =>
    `flex items-center justify-center w-7 h-7 rounded border transition-colors shrink-0 ${
      enabled
        ? "border-[#333333] bg-[#111111] text-white hover:border-[#C9A86C] hover:text-[#C9A86C]"
        : "border-[#2A2A2A] bg-[#111111] text-[#444444] cursor-not-allowed"
    }`;

  return (
    <div className="w-full border border-[#333333] rounded-lg bg-[#1F1F1F] overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-white hover:bg-[#2A2A2A] transition-colors"
      >
        <span>Math Palette</span>
        {isOpen ? <ChevronUp size={16} className="text-[#8A8A8A]" /> : <ChevronDown size={16} className="text-[#8A8A8A]" />}
      </button>

      {isOpen && (
        <div className="border-t border-[#333333]">
          {/* Tab row + undo/redo — horizontal scroll on narrow screens */}
          <div className="flex items-center gap-1 px-2 pt-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab.key
                    ? "text-[#C9A86C] bg-[rgba(201,168,108,0.1)]"
                    : "text-[#8A8A8A] hover:text-white hover:bg-[#2A2A2A]"
                }`}
              >
                {tab.label}
              </button>
            ))}

            {(onUndo || onRedo) && (
              <div className="ml-auto flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  aria-label="Undo"
                  title="Undo"
                  disabled={!canUndo}
                  onClick={onUndo}
                  className={historyButtonClass(canUndo)}
                >
                  <Undo2 size={13} />
                </button>
                <button
                  type="button"
                  aria-label="Redo"
                  title="Redo"
                  disabled={!canRedo}
                  onClick={onRedo}
                  className={historyButtonClass(canRedo)}
                >
                  <Redo2 size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Symbol buttons — horizontal scroll on mobile, wraps on sm+ */}
          <div className="flex flex-nowrap overflow-x-auto gap-1.5 p-2 sm:flex-wrap sm:overflow-x-visible">
            {getButtons().map((button, index) => (
              <button
                key={`${activeTab}-${index}`}
                type="button"
                aria-label={button.label}
                title={button.label}
                onClick={() => handleInsert(button)}
                className="flex items-center justify-center shrink-0 min-h-[36px] min-w-[36px] px-2 py-1 text-[0.75rem] font-medium rounded border border-[#333333] bg-[#111111] text-white hover:border-[#C9A86C] hover:text-[#C9A86C] transition-colors sm:min-w-[40px]"
              >
                <KatexLabel latex={button.latex ?? button.label} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
