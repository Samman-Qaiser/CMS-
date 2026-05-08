import { useState } from "react";
import { useForm, Controller, Watch } from "react-hook-form";
import { motion } from "framer-motion";
import { BsPencil, BsEye, BsEyeSlash } from "react-icons/bs";
import defaultAvatar from "/public/images/default_avatar.jpg";
import { useNavigate } from "react-router-dom";

const AddUserForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(defaultAvatar);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
      gender: "",
      role: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Saved", data);
    navigate(-1);
  };

  const handleCancel = () => {
    console.log("Canceled");
    navigate(-1);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-50 dark:border-gray-800">
        <h2 className="text-xl font-bold" style={{ color: "var(--primary)" }}>
          New User Form
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Image Upload */}
          <div className="md:col-span-4 flex justify-center pt-4 relative group">
            <div className="w-44 h-44 rounded-full border-4 border-gray-100 overflow-hidden relative shadow-inner">
              <img
                src={selectedImage}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <BsPencil className="text-white text-3xl" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
            />
          </div>

          {/* Names, Username, Email, Phone */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <InputField
              label="First Name"
              name="firstName"
              register={register}
              placeholder="First Name"
            />
            <InputField
              label="Last Name"
              name="lastName"
              register={register}
              placeholder="Last Name"
            />
            <InputField
              label="UserName"
              name="username"
              register={register}
              placeholder="admin@example.com"
              required
              errors={errors}
              isFilled={true}
            />
            <InputField
              label="Email"
              name="email"
              register={register}
              placeholder="Email"
              required
              errors={errors}
            />
            <InputField
              label="Phone Number"
              name="phoneNumber"
              register={register}
              placeholder="Phone Number"
              required
              errors={errors}
              className="sm:col-span-2"
            />
          </div>
        </div>

        {/* Row 2: Status, Role, Gender, DOB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {/* Is Active Checkbox */}
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-semibold"
              style={{ color: "var(--content-text)" }}
            >
              is active
            </label>
          </div>
          <SelectField
            label="Role"
            name="role"
            control={control}
            placeholder="Select the Role"
            options={["Admin", "Manager", "Customer"]}
          />
          <SelectField
            label="Gender"
            name="gender"
            control={control}
            placeholder="Choose gender"
            options={["Male", "Female", "Other"]}
            required
            errors={errors}
          />
          <InputField
            label="Date Of Birth"
            name="dob"
            register={register}
            placeholder="dd-----yyyy"
            required
            errors={errors}
            type="date"
          />
        </div>

        {/* Row 3: Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Facebook Url"
            name="facebookUrl"
            register={register}
          />
          <InputField
            label="Twitter Url"
            name="twitterUrl"
            register={register}
          />
          <InputField
            label="Linkedin Url"
            name="linkedinUrl"
            register={register}
          />
        </div>

        {/* Row 4: About */}
        <div>
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--content-text)" }}
          >
            About
          </label>
          <textarea
            {...register("about")}
            rows={5}
            placeholder="Write About Yourself..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-y"
            style={{ color: "var(--content-text)" }}
          />
        </div>

        {/* Row 5: Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
          <PasswordField
            label="Password"
            name="password"
            register={register}
            errors={errors}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            required
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            register={register}
            errors={errors}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            required
            isFilled={false}
            validate={(value) =>
              value === Watch("password") || "Passwords do not match"
            }
          />
        </div>

        {/* Row 6: Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl text-white bg-[#4CBC9A] hover:bg-[#3a9b7e] font-bold transition-transform hover:scale-105 active:scale-95 "
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel} 
            className="px-8 py-3 rounded-xl text-white font-bold transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const InputField = ({
  label,
  name,
  register,
  placeholder,
  required,
  type = "text",
  className = "",
  isFilled = false,
  errors,
}) => (
  <div className={className}>
    <label
      className="block text-sm font-medium mb-1.5"
      style={{ color: "var(--content-text)" }}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      {...register(name, {
        required: required ? "This field is required." : false,
      })}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-all ${
        errors?.[name]
          ? "border-red-500"
          : "border-gray-200 dark:border-gray-600"
      } ${isFilled ? "bg-blue-50/50" : ""}`}
      style={{ color: "var(--content-text)" }}
    />
    {/* Error message */}
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
    )}
  </div>
);

const SelectField = ({
  label,
  name,
  control,
  placeholder,
  options,
  required,
  errors,
}) => (
  <div>
    <label
      className="block text-sm font-medium mb-1.5"
      style={{ color: "var(--content-text)" }}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required." : false }}
      render={({ field }) => (
        <select
          {...field}
          className={`w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-all cursor-pointer appearance-none ${
            errors?.[name]
              ? "border-red-500"
              : "border-gray-200 dark:border-gray-600"
          }`}
          style={{ color: field.value ? "var(--content-text)" : "#9ca3af" }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-gray-900">
              {opt}
            </option>
          ))}
        </select>
      )}
    />
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
    )}
  </div>
);

const PasswordField = ({
  label,
  name,
  register,
  showPassword,
  setShowPassword,
  required,
  isFilled = true,
  errors,
  validate,
}) => (
  <div>
    <label
      className="block text-sm font-medium mb-1.5"
      style={{ color: "var(--content-text)" }}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        {...register(name, {
          required: required ? "This field is required." : false,
          validate: validate,
        })}
        className={`w-full px-4 py-3 rounded-xl border bg-transparent outline-none transition-all ${
          errors?.[name]
            ? "border-red-500"
            : "border-gray-200 dark:border-gray-600"
        } ${isFilled ? "bg-blue-50/50" : ""}`}
        style={{ color: "var(--content-text)" }}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded"
      >
        {showPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
      </button>
    </div>
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
    )}
  </div>
);

export default AddUserForm;
