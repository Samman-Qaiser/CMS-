import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { LuSend, LuPaperclip, LuX } from "react-icons/lu";
import { EmailLayout } from "../layout/EmailLayout";

const EmailCompose = () => {
  const { register, handleSubmit, reset } = useForm();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const fileInputRef = useRef(null);

  const toggleDropdown = (name) =>
    setActiveDropdown(activeDropdown === name ? null : name);

  return (
    <EmailLayout
      activeDropdown={activeDropdown}
      toggleDropdown={toggleDropdown}
    >
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="space-y-4"
      >
        <input
          {...register("to")}
          type="text"
          placeholder="To:"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-transparent dark:text-white"
        />
        <input
          {...register("subject")}
          type="text"
          placeholder="Subject:"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-transparent dark:text-white"
        />
        <textarea
          {...register("message")}
          placeholder="Enter text ..."
          rows="10"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 outline-none focus:border-primary dark:bg-transparent dark:text-white resize-none"
        />

        {/* Improved File Input Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
            <LuPaperclip size={18} /> <span>Attachment</span>
          </div>
          <div
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-12 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-transparent cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => console.log(e.target.files)}
            />
            <p className="text-gray-400 text-sm">
              Drop files here or click to upload
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <LuSend size={18} /> Send
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-100 text-red-500 font-bold rounded-lg hover:bg-red-200 active:scale-95 transition-all"
          >
            <LuX size={18} /> Discard
          </button>
        </div>
      </form>
    </EmailLayout>
  );
};

export default EmailCompose;
