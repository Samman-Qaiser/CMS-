import { useForm } from "react-hook-form";
import { useEffect } from "react";

export const MenuItemForm = ({ item, onUpdateItem, onRemoveItem, onClose }) => {
  const { register, watch, reset } = useForm({
    defaultValues: item,
  })

  // ✅ item change hone pe reset karo
  useEffect(() => {
    reset(item)
  }, [item._id || item.id])

  useEffect(() => {
    const subscription = watch((value) => {
      // ✅ _id ya id dono check karo
      onUpdateItem(item._id || item.id, value)
    })
    return () => subscription.unsubscribe()
  }, [watch, item._id, item.id, onUpdateItem])

  return (
    <div className="px-6 pb-6 pt-2 space-y-5 border-t border-gray-50 dark:border-gray-800">
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500">
          Navigation Label
        </label>
        <input
          {...register("label")}
          className="w-full p-3 text-xs border border-gray-200 rounded-xl outline-none focus:border-primary dark:bg-black/20 dark:border-gray-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500">
            Title Attribute
          </label>
          <input
            {...register("titleAttribute")}
            className="w-full p-3 text-xs border border-gray-200 rounded-xl outline-none focus:border-primary dark:bg-black/20 dark:border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500">
            Class Attribute
          </label>
          <input
            {...register("classAttribute")}
            className="w-full p-3 text-xs border border-gray-200 rounded-xl outline-none focus:border-primary dark:bg-black/20 dark:border-gray-700"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group w-fit">
        <input
          type="checkbox"
          {...register("openInNewTab")}
          className="w-5 h-5 accent-primary rounded border-gray-300"
        />
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
          open in new tab
        </span>
      </label>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500">Description</label>
        <textarea
          rows={4}
          {...register("description")}
          placeholder="None"
          className="w-full p-3 text-xs border border-gray-200 rounded-xl outline-none focus:border-primary dark:bg-black/20 dark:border-gray-700 resize-none"
        />
      </div>

      <div className="flex items-center gap-4 text-xs pt-2">
        <button
          type="button"
          onClick={() => onRemoveItem(item._id || item.id)}
          className="text-red-500 font-medium hover:underline"
        >
          Remove
        </button>
        <span className="text-gray-300">|</span>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 font-medium hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}