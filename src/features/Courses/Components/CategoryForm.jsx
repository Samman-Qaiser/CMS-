import { useForm } from "react-hook-form";
import axios from "axios";

const CategoryForm = ({ onClose, onSave }) => {
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      isActive: true, 
    },
  });
  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  const onSubmit = async (data) => {
    try {
      await axios.post(`${baseUrl}/api/course-categories`, data);
      onSave();
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-[#292d4a] p-6 rounded-2xl w-full max-w-md shadow-xl"
      >
        <h2 className="text-lg font-bold mb-4 text-header-text">
          Create Category
        </h2>

        {/* Name & Slug */}
        <input
          {...register("name", {
            required: true,
            onChange: (e) =>
              setValue(
                "slug",
                e.target.value.toLowerCase().replace(/\s+/g, "-"),
              ),
          })}
          placeholder="Category Name"
          className="w-full p-2 mb-3 border rounded-lg dark:bg-transparent dark:border-gray-600"
        />

        <input
          {...register("slug", { required: true })}
          placeholder="Slug"
          className="w-full p-2 mb-3 border rounded-lg dark:bg-transparent dark:border-gray-600"
        />

        {/* Description */}
        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full p-2 mb-3 border rounded-lg dark:bg-transparent dark:border-gray-600"
        />

        {/* Icon (URL) */}
        <input
          {...register("icon")}
          placeholder="Icon URL"
          className="w-full p-2 mb-3 border rounded-lg dark:bg-transparent dark:border-gray-600"
        />

        {/* IsActive Toggle */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            {...register("isActive")}
            className="w-4 h-4"
          />
          <span className="text-sm text-header-text">Is Active</span>
        </label>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
