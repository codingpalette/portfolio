"use client";

import { useRef, useState, useEffect } from "react";
import {
  Plate,
  PlateContainer,
  PlateContent,
  usePlateEditor,
  useEditorState,
} from "platejs/react";
import { cva } from "class-variance-authority";
import { insertImage } from "@platejs/media";
import { cn } from "@shared/lib/utils";
import { createClient } from "@shared/api/supabase/client";

const editorContainerVariants = cva(
  "relative w-full cursor-text select-text overflow-y-auto caret-primary focus-visible:outline-none",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        default: "h-full",
        guestbook: "",
      },
    },
  },
);

const editorVariants = cva(
  "group/editor relative w-full cursor-text select-text overflow-x-hidden whitespace-pre-wrap break-words rounded-md focus-visible:outline-none [&_strong]:font-bold",
  {
    defaultVariants: { variant: "default" },
    variants: {
      variant: {
        default: "size-full px-4 pt-4 pb-16 text-base",
        guestbook: "w-full px-4 py-3 text-sm min-h-[120px]",
        readOnly: "w-full text-sm prose-invert",
      },
    },
  },
);

interface PlateEditorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: any[];
  initialValue?: Record<string, unknown>[];
  onChange?: (value: Record<string, unknown>[]) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  variant?: "default" | "guestbook";
}

const MARK_ITEMS = [
  { key: "bold", label: "B", className: "font-bold" },
  { key: "italic", label: "I", className: "italic" },
  { key: "underline", label: "U", className: "underline" },
  { key: "strikethrough", label: "S", className: "line-through" },
  { key: "code", label: "</>", className: "font-mono text-[10px]" },
];

const BLOCK_ITEMS = [
  { key: "h1", label: "H1", className: "text-[10px] font-extrabold" },
  { key: "h2", label: "H2", className: "text-[10px] font-bold" },
  { key: "h3", label: "H3", className: "text-[10px] font-semibold" },
  { key: "blockquote", label: "\u275D", className: "" },
  { key: "code_block", label: "{ }", className: "font-mono text-[10px]" },
];

const ALIGN_ITEMS = [
  { key: "left", label: "\u2261", title: "왼쪽 정렬" },
  { key: "center", label: "\u2261", title: "가운데 정렬" },
  { key: "right", label: "\u2261", title: "오른쪽 정렬" },
];

const FONT_FAMILIES = [
  { label: "기본", value: "inherit" },
  { label: "고딕", value: "'Noto Sans KR', sans-serif" },
  { label: "명조", value: "'Noto Serif KR', serif" },
  { label: "모노", value: "'Geist Mono', monospace" },
];

const FONT_SIZES = [
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
];

const COLOR_PRESETS = [
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ImageElement({ attributes, children, element }: any) {
  return (
    <div {...attributes}>
      <div contentEditable={false} className="my-4">
        <img
          src={element.url}
          alt=""
          className="plate-editor-image"
        />
      </div>
      {children}
    </div>
  );
}

function FontSizeDropdown() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = useEditorState() as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const marks = editor.getMarks() as Record<string, any> | null;
  const currentSize = marks?.fontSize || "16px";
  const displaySize = currentSize.replace("px", "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className="plate-font-size-button"
        title="글자 크기"
      >
        {displaySize}
        <span className="ml-0.5 text-[8px]">&#9662;</span>
      </button>
      {open && (
        <div className="plate-font-size-dropdown">
          {FONT_SIZES.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              data-active={currentSize === value ? "" : undefined}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.tf.fontSize.addMark(value);
                setOpen(false);
              }}
            >
              {label}px
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ColorPaletteButton({
  markKey,
  icon,
  title,
}: {
  markKey: string;
  icon: React.ReactNode;
  title: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = useEditorState() as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const marks = editor.getMarks() as Record<string, any> | null;
  const currentColor =
    marks?.[markKey] || (markKey === "color" ? "#ffffff" : "transparent");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className="plate-color-button"
        title={title}
      >
        <span>{icon}</span>
        <span
          className="plate-color-indicator"
          style={{
            backgroundColor:
              currentColor === "transparent" ? "transparent" : currentColor,
          }}
        />
      </button>
      {open && (
        <div className="plate-color-palette">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              className="plate-color-swatch"
              style={{ backgroundColor: color }}
              data-active={currentColor === color ? "" : undefined}
              onMouseDown={(e) => {
                e.preventDefault();
                editor.tf[markKey].addMark(color);
                setOpen(false);
              }}
            />
          ))}
          <button
            type="button"
            className="plate-color-swatch plate-color-clear"
            title="초기화"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.removeMark(markKey);
              setOpen(false);
            }}
          >
            &#10005;
          </button>
        </div>
      )}
    </div>
  );
}

function ImageUploadButton() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = useEditorState() as any;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file);

    if (error) {
      alert("이미지 업로드 실패: " + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    insertImage(editor, urlData.publicUrl);

    setUploading(false);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onMouseDown={(e) => {
          e.preventDefault();
          fileInputRef.current?.click();
        }}
        title="이미지 삽입"
        className={uploading ? "opacity-50" : ""}
      >
        {uploading ? "\u23F3" : "\uD83D\uDCF7"}
      </button>
    </>
  );
}

function UndoRedoButtons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = useEditorState() as any;
  return (
    <>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.undo();
        }}
        disabled={editor.history?.undos?.length === 0}
        title="되돌리기"
      >
        ↩
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.redo();
        }}
        disabled={editor.history?.redos?.length === 0}
        title="다시 실행"
      >
        ↪
      </button>
    </>
  );
}

function AlignButtons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = useEditorState() as any;
  const tf = editor.tf;
  if (!tf.textAlign?.setNodes) return null;

  const getCurrentAlign = () => {
    try {
      const block = editor.api.block();
      if (!block) return "left";
      return block[0]?.textAlign || "left";
    } catch {
      return "left";
    }
  };

  const currentAlign = getCurrentAlign();

  return (
    <>
      {ALIGN_ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          data-active={currentAlign === item.key ? "" : undefined}
          onMouseDown={(e) => {
            e.preventDefault();
            tf.textAlign.setNodes({ textAlign: item.key });
          }}
          title={item.title}
          style={{
            textAlign: item.key as "left" | "center" | "right",
            fontSize: "14px",
            lineHeight: 1,
          }}
        >
          {item.label}
        </button>
      ))}
    </>
  );
}

function ListButtons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = useEditorState() as any;
  const tf = editor.tf;
  const hasUl = !!tf.ul?.toggle;
  const hasOl = !!tf.ol?.toggle;
  if (!hasUl && !hasOl) return null;

  const isListActive = (type: string) => {
    try {
      const block = editor.api.block();
      if (!block) return false;
      return block[0]?.type === type;
    } catch {
      return false;
    }
  };

  return (
    <>
      {hasUl && (
        <button
          type="button"
          data-active={isListActive("ul") ? "" : undefined}
          onMouseDown={(e) => {
            e.preventDefault();
            tf.ul.toggle();
          }}
          title="불릿 리스트"
        >
          •≡
        </button>
      )}
      {hasOl && (
        <button
          type="button"
          data-active={isListActive("ol") ? "" : undefined}
          onMouseDown={(e) => {
            e.preventDefault();
            tf.ol.toggle();
          }}
          title="번호 리스트"
        >
          1.
        </button>
      )}
    </>
  );
}

function LinkButton() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = useEditorState() as any;
  if (!editor.tf.link?.insert) return null;

  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        const url = prompt("링크 URL을 입력하세요:");
        if (url) {
          editor.tf.link.insert({ url });
        }
      }}
      title="링크 삽입"
    >
      🔗
    </button>
  );
}

function FontFamilyDropdown() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = useEditorState() as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const marks = editor.getMarks() as Record<string, any> | null;
  const currentFamily = marks?.fontFamily || "inherit";
  const displayLabel =
    FONT_FAMILIES.find((f) => f.value === currentFamily)?.label || "기본";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className="plate-font-family-button"
        title="폰트"
      >
        {displayLabel}
        <span className="ml-0.5 text-[8px]">&#9662;</span>
      </button>
      {open && (
        <div className="plate-font-family-dropdown">
          {FONT_FAMILIES.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              data-active={currentFamily === value ? "" : undefined}
              style={{ fontFamily: value }}
              onMouseDown={(e) => {
                e.preventDefault();
                if (value === "inherit") {
                  editor.removeMark("fontFamily");
                } else {
                  editor.tf.fontFamily.addMark(value);
                }
                setOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PlateToolbar() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editor = useEditorState() as any;
  const tf = editor.tf;
  const marks = editor.getMarks() as Record<string, boolean> | null;

  const availableMarks = MARK_ITEMS.filter((item) => tf[item.key]?.toggle);
  const availableBlocks = BLOCK_ITEMS.filter((item) => tf[item.key]?.toggle);

  const hasFontSize = !!tf.fontSize?.addMark;
  const hasFontFamily = !!tf.fontFamily?.addMark;
  const hasFontColor = !!tf.color?.addMark;
  const hasFontBgColor = !!tf.backgroundColor?.addMark;
  const hasImage = !!editor.plugins?.img;
  const hasAlign = !!tf.textAlign?.setNodes;
  const hasList = !!tf.ul?.toggle || !!tf.ol?.toggle;
  const hasLink = !!editor.tf.link?.insert;

  const hasFontControls =
    hasFontSize || hasFontFamily || hasFontColor || hasFontBgColor;

  if (
    availableMarks.length === 0 &&
    availableBlocks.length === 0 &&
    !hasFontControls &&
    !hasImage &&
    !hasAlign &&
    !hasList &&
    !hasLink
  )
    return null;

  const isBlockActive = (key: string) => {
    try {
      const block = editor.api.block();
      if (!block) return false;
      return block[0]?.type === key;
    } catch {
      return false;
    }
  };

  return (
    <div className="plate-toolbar">
      <UndoRedoButtons />
      <span className="plate-toolbar-separator" />
      {availableMarks.map((item) => (
        <button
          key={item.key}
          type="button"
          data-active={marks?.[item.key] ? "" : undefined}
          onMouseDown={(e) => {
            e.preventDefault();
            tf[item.key].toggle();
          }}
          className={item.className}
          title={item.key}
        >
          {item.label}
        </button>
      ))}
      {hasFontControls && availableMarks.length > 0 && (
        <span className="plate-toolbar-separator" />
      )}
      {hasFontFamily && <FontFamilyDropdown />}
      {hasFontSize && <FontSizeDropdown />}
      {hasFontColor && (
        <ColorPaletteButton markKey="color" icon="A" title="글자 색상" />
      )}
      {hasFontBgColor && (
        <ColorPaletteButton
          markKey="backgroundColor"
          icon={<span className="underline decoration-2">A</span>}
          title="배경 색상"
        />
      )}
      {availableBlocks.length > 0 &&
        (availableMarks.length > 0 || hasFontControls) && (
          <span className="plate-toolbar-separator" />
        )}
      {availableBlocks.map((item) => (
        <button
          key={item.key}
          type="button"
          data-active={isBlockActive(item.key) ? "" : undefined}
          onMouseDown={(e) => {
            e.preventDefault();
            tf[item.key].toggle();
          }}
          className={item.className}
          title={item.key}
        >
          {item.label}
        </button>
      ))}
      {(hasAlign || hasList) &&
        (availableBlocks.length > 0 ||
          availableMarks.length > 0 ||
          hasFontControls) && <span className="plate-toolbar-separator" />}
      {hasAlign && <AlignButtons />}
      {hasList && <ListButtons />}
      {(hasLink || hasImage) && (
        <>
          {(hasAlign ||
            hasList ||
            availableBlocks.length > 0 ||
            availableMarks.length > 0 ||
            hasFontControls) && <span className="plate-toolbar-separator" />}
          {hasLink && <LinkButton />}
          {hasImage && <ImageUploadButton />}
        </>
      )}
    </div>
  );
}

export default function PlateEditor({
  plugins,
  initialValue,
  onChange,
  readOnly = false,
  placeholder = "내용을 입력하세요...",
  className,
  variant = "default",
}: PlateEditorProps) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = usePlateEditor({
    plugins,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: initialValue as any,
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        onChangeRef.current?.(value as Record<string, unknown>[]);
      }}
    >
      {!readOnly ? (
        <div
          className={cn(
            "overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50",
            className,
          )}
        >
          <PlateToolbar />
          <PlateContainer className={editorContainerVariants({ variant })}>
            <PlateContent
              placeholder={placeholder}
              className={cn(
                editorVariants({ variant }),
                "plate-editor text-white outline-none",
              )}
              disableDefaultStyles
            />
          </PlateContainer>
        </div>
      ) : (
        <PlateContent
          readOnly
          className={cn(
            editorVariants({ variant: "readOnly" }),
            "plate-editor text-white outline-none",
            className,
          )}
          disableDefaultStyles
        />
      )}
    </Plate>
  );
}
