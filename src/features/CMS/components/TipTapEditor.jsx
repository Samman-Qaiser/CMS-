import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const TipTapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-lg p-2 min-h-[300px] dark:bg-[#1e2235]">
      {editor && (
        <div className="mb-2 space-x-2 border-b pb-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="font-bold px-2 border"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="italic px-2 border"
          >
            I
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};
