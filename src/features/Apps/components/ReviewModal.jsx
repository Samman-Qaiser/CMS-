import { useState } from "react";
import { Star, X } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const ReviewModal = ({ isOpen, onClose, productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const baseUrl =
    import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

  // Get user from Redux store or localStorage
  const getUserFromStorage = () => {
    // Try to get user from localStorage first
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log("User from localStorage:", user);
        return user;
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }

    // Try to get from Redux persisted state
    const reduxState = localStorage.getItem("persist:root");
    if (reduxState) {
      try {
        const parsed = JSON.parse(reduxState);
        const auth = JSON.parse(parsed.auth || "{}");
        if (auth.user) {
          console.log("User from Redux:", auth.user);
          return auth.user;
        }
      } catch (e) {
        console.error("Error parsing Redux state:", e);
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Swal.fire({
        title: "Missing Comment",
        text: "Please write a comment for your review.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          title: "Not Logged In",
          text: "Please log in to submit a review.",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
        setSubmitting(false);
        return;
      }

      const user = getUserFromStorage();

      // Validate user has an ID
      const userId = user?._id || user?.id;
      if (!userId) {
        console.error("No user ID found. User object:", user);
        Swal.fire({
          title: "Error",
          text: "User information not found. Please log out and log in again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        setSubmitting(false);
        return;
      }

      const reviewData = {
        product: productId,
        rating: rating,
        comment: comment.trim(),
        user: userId,
      };

      console.log("Submitting review:", reviewData);
      console.log("Product ID:", productId);
      console.log("User ID:", userId);

      const response = await axios.post(
        `${baseUrl}/api/products/${productId}/reviews`,
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Review submission response:", response.data);

      // After successful submission
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Review Submitted!",
          text: "Thank you for your review. It will be visible after approval.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          timer: 3000,
          timerProgressBar: true,
        });

        // Reset form
        setRating(5);
        setComment("");

        // Close modal
        onClose();

        setTimeout(() => {
          if (onReviewSubmitted) {
            onReviewSubmitted();
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Failed to submit review. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).join(", ");
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid data. Please check your rating and comment.";
      } else if (error.response?.status === 401) {
        errorMessage = "Please log in to submit a review.";
      } else if (error.response?.status === 404) {
        errorMessage = "Product not found.";
      }

      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle backdrop click - only close when clicking the backdrop, not the modal content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        {/* Modal content - prevent click from closing */}
        <div
          className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-[#252b48] rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Write a Review
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Rating *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={`transition-colors ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click on stars to rate this product
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Your Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none"
                placeholder="Share your experience with this product..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-[#1a1c2e] rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
