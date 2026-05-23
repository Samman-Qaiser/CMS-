// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  FaUser, 
  FaEnvelope, 
  FaUserTag, 
  FaPhone, 
  FaCalendarAlt, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin,
  FaSave,
  FaTimes,
  FaCamera,
  FaEdit,
  FaInfoCircle,
  FaToggleOn,
  FaToggleOff
} from "react-icons/fa";

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

export default function DropProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const authUser = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("token");

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseUrl}/api/users/${authUser?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data.user);
      setEditedData(data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load profile",
        icon: "error",
        confirmButtonColor: "var(--primary)"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser?.id) {
      fetchUserProfile();
    }
  }, [authUser?.id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  // Handle toggle switch for isActive
  const handleToggleActive = () => {
    setEditedData(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to backend
  const uploadImage = async () => {
    if (!selectedImage) return null;
    
    const formData = new FormData();
    formData.append("profileImage", selectedImage);
    
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/users/${authUser?.id}/profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
      return data.imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      let imageUrl = user?.profileImage;
      
      if (selectedImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }
      
      // Prepare form data with all fields
      const updateData = new FormData();
      updateData.append("firstName", editedData.firstName || "");
      updateData.append("lastName", editedData.lastName || "");
      updateData.append("email", editedData.email || "");
      updateData.append("username", editedData.username || "");
      updateData.append("phoneNumber", editedData.phoneNumber || "");
      updateData.append("dateOfBirth", editedData.dateOfBirth || "");
      updateData.append("isActive", editedData.isActive || false);
      updateData.append("facebookUrl", editedData.facebookUrl || "");
      updateData.append("twitterUrl", editedData.twitterUrl || "");
      updateData.append("linkedinUrl", editedData.linkedinUrl || "");
      updateData.append("about", editedData.about || "");
      updateData.append("role", editedData.role || "");
      if (imageUrl) updateData.append("profileImage", imageUrl);
      
      const { data } = await axios.put(
        `${baseUrl}/api/users/${authUser?.id}`,
        updateData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      setUser(data.user);
      setIsEditing(false);
      setSelectedImage(null);
      setPreviewImage(null);
      
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end"
      });
      
    } catch (error) {
      console.error("Save failed:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update profile",
        icon: "error",
        confirmButtonColor: "var(--primary)"
      });
    }
  };

  const handleCancel = () => {
    setEditedData(user);
    setIsEditing(false);
    setSelectedImage(null);
    setPreviewImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10"></div>
          
          {/* Profile Image Section */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-lg">
                  <img
                    src={previewImage || user?.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=FFF0EE&color=FF6F61&bold=true&size=120`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
                    <FaCamera className="w-3 h-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  @{user?.username} • 
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user?.role}
                  </span>
                </p>
                {user?.isActive !== undefined && (
                  <p className="text-xs mt-1 flex items-center gap-1 justify-center sm:justify-start">
                    <span className={`inline-block w-2 h-2 rounded-full ${user?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-gray-500">{user?.isActive ? 'Active' : 'Inactive'}</span>
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                      <FaTimes className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      <FaSave className="w-4 h-4" />
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mt-6 bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2 w-4 h-4" />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editedData.firstName || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">{user?.firstName || "Not set"}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2 w-4 h-4" />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editedData.lastName || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">{user?.lastName || "Not set"}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaEnvelope className="inline mr-2 w-4 h-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">{user?.email}</p>
                )}
              </div>
              
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUserTag className="inline mr-2 w-4 h-4" />
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editedData.username || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">@{user?.username}</p>
                )}
              </div>
              
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaPhone className="inline mr-2 w-4 h-4" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedData.phoneNumber || ""}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">{user?.phoneNumber || "Not set"}</p>
                )}
              </div>
              
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendarAlt className="inline mr-2 w-4 h-4" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editedData.dateOfBirth ? new Date(editedData.dateOfBirth).toISOString().split('T')[0] : ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white py-2">
                    {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not set"}
                  </p>
                )}
              </div>
              
              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <p className="text-gray-900 dark:text-white py-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user?.role || "User"}
                  </span>
                </p>
              </div>
              
              {/* Account Status with Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Status
                </label>
                {isEditing ? (
                  <button
                    onClick={handleToggleActive}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {editedData.isActive ? (
                      <FaToggleOn className="w-6 h-6 text-green-500" />
                    ) : (
                      <FaToggleOff className="w-6 h-6 text-red-500" />
                    )}
                    <span className={editedData.isActive ? "text-green-600" : "text-red-600"}>
                      {editedData.isActive ? "Active" : "Inactive"}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${user?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-gray-900 dark:text-white">{user?.isActive ? "Active" : "Inactive"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About/Bio Section */}
        <div className="mt-6 bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              <FaInfoCircle className="inline mr-2 w-5 h-5" />
              About Me
            </h2>
          </div>
          
          <div className="p-6">
            {isEditing ? (
              <textarea
                name="about"
                value={editedData.about || ""}
                onChange={handleInputChange}
                rows="5"
                placeholder="Tell us about yourself, your expertise, interests, etc..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {user?.about || "No bio added yet. Click edit to tell us about yourself!"}
              </p>
            )}
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="mt-6 bg-white dark:bg-[#292d4a] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Social Media Profiles
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facebook */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaFacebook className="inline mr-2 w-4 h-4 text-blue-600" />
                  Facebook URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="facebookUrl"
                    value={editedData.facebookUrl || ""}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/username"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  user?.facebookUrl ? (
                    <a href={user.facebookUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline py-2 inline-block">
                      {user.facebookUrl}
                    </a>
                  ) : (
                    <p className="text-gray-500 py-2">Not connected</p>
                  )
                )}
              </div>
              
              {/* Twitter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaTwitter className="inline mr-2 w-4 h-4 text-blue-400" />
                  Twitter URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="twitterUrl"
                    value={editedData.twitterUrl || ""}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/username"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  user?.twitterUrl ? (
                    <a href={user.twitterUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-400 hover:underline py-2 inline-block">
                      {user.twitterUrl}
                    </a>
                  ) : (
                    <p className="text-gray-500 py-2">Not connected</p>
                  )
                )}
              </div>
              
              {/* LinkedIn */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaLinkedin className="inline mr-2 w-4 h-4 text-blue-700" />
                  LinkedIn URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={editedData.linkedinUrl || ""}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  user?.linkedinUrl ? (
                    <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-700 hover:underline py-2 inline-block">
                      {user.linkedinUrl}
                    </a>
                  ) : (
                    <p className="text-gray-500 py-2">Not connected</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#292d4a] rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {new Date(user?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#292d4a] rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Last Updated</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {new Date(user?.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#292d4a] rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Account ID</p>
            <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">
              {user?._id?.slice(-8)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}