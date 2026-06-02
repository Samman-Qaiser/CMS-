// src/pages/CheckoutPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  FaCreditCard, 
  FaPaypal, 
  FaMobileAlt, 
  FaLock, 
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner,
  FaShieldAlt
} from 'react-icons/fa';

const baseUrl = import.meta.env?.VITE_BACKEND_URL || "https://cms-backend-ashen.vercel.app";

export default function CheckoutPageBuy() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user: authUser, token } = useSelector((state) => state.auth);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/courses/${id}`);
        if (data.success) {
          setCourse(data.course);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load course details',
          icon: 'error',
          confirmButtonColor: '#FF6F61'
        });
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\//g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }
    
    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      if (value.length > 4) return;
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  // Generate unique transaction ID
  const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  // Create transaction record
  const createTransaction = async (transactionData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/transactions`,
        transactionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Transaction creation failed:', error);
      throw error;
    }
  };

  // Create enrollment record
  const createEnrollment = async (enrollmentData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/enrollments`,
        enrollmentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Enrollment failed:', error);
      throw error;
    }
  };

  // Process payment and enrollment
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!authUser) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to complete your purchase',
        icon: 'warning',
        confirmButtonColor: '#FF6F61'
      });
      navigate('/login');
      return;
    }

    setProcessing(true);

    try {
      // Validate form for card payment
      if (paymentMethod === 'card') {
        if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
          Swal.fire({
            title: 'Error!',
            text: 'Please fill all card details',
            icon: 'error',
            confirmButtonColor: '#FF6F61'
          });
          setProcessing(false);
          return;
        }
      }

      // Generate transaction ID
      const transactionId = generateTransactionId();

      // Create transaction record
      const transactionData = {
        user: authUser.id,
        course: course._id,
        instructor: course.instructor?._id,
        amount: course.price,
        status: 'completed',
        paymentMethod: paymentMethod,
        transactionId: transactionId
      };

      await createTransaction(transactionData);

      // Create enrollment record
      const enrollmentData = {
        user: authUser.id,
        course: course._id,
        amountPaid: course.price
      };

      await createEnrollment(enrollmentData);

      // Show success message
      await Swal.fire({
        title: 'Payment Successful!',
        text: 'You have successfully enrolled in the course',
        icon: 'success',
        confirmButtonColor: '#FF6F61',
        timer: 3000,
        showConfirmButton: true
      });

      // Navigate to course details with enrollment tab
      navigate(`/dashboard/course-details-2/${course._id}?enrolled=true`);

    } catch (error) {
      console.error('Payment failed:', error);
      Swal.fire({
        title: 'Payment Failed!',
        text: error.response?.data?.message || 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonColor: '#FF6F61'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1E2139] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E2139] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-6 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Course</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#292D4A] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Complete your purchase to start learning
                </p>
              </div>

              <form onSubmit={handlePayment} className="p-6">
                {/* Payment Methods */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <FaCreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-primary' : 'text-gray-400'}`} />
                      <span className="text-xs font-medium">Credit Card</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <FaPaypal className={`w-5 h-5 ${paymentMethod === 'paypal' ? 'text-primary' : 'text-gray-400'}`} />
                      <span className="text-xs font-medium">PayPal</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mobile')}
                      className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'mobile'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <FaMobileAlt className={`w-5 h-5 ${paymentMethod === 'mobile' ? 'text-primary' : 'text-gray-400'}`} />
                      <span className="text-xs font-medium">Mobile Wallet</span>
                    </button>
                  </div>
                </div>

                {/* Card Details - Only show for card payment */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal/Mobile Wallet Info */}
                {(paymentMethod === 'paypal' || paymentMethod === 'mobile') && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      You will be redirected to {paymentMethod === 'paypal' ? 'PayPal' : 'mobile payment gateway'} to complete your payment.
                    </p>
                  </div>
                )}

                {/* Security Notice */}
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <FaLock className="w-3 h-3" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaShieldAlt className="w-4 h-4" />
                      Complete Payment (${course.price})
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#292D4A] rounded-2xl shadow-sm overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Summary</h3>
              </div>
              
              <div className="p-6">
                {/* Course Thumbnail */}
                <div className="flex gap-4 mb-4">
                  <img
                    src={course.thumbnail || 'https://via.placeholder.com/80'}
                    alt={course.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      By {course.instructor?.user?.name || 'Instructor'}
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Course Price</span>
                    <span className="text-gray-900 dark:text-white font-semibold">${course.price}</span>
                  </div>
                  
                  {course.originalPrice > course.price && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Original Price</span>
                      <span className="text-gray-400 line-through">${course.originalPrice}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                    <span className="text-green-600">-${(course.originalPrice - course.price).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-primary text-lg">${course.price}</span>
                  </div>
                </div>

                {/* What's Included */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    What's included:
                  </p>
                  <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="w-3 h-3 text-green-500" />
                      Full lifetime access
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="w-3 h-3 text-green-500" />
                      Certificate of completion
                    </li>
                    <li className="flex items-center gap-2">
                      <FaCheckCircle className="w-3 h-3 text-green-500" />
                      30-day money-back guarantee
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}