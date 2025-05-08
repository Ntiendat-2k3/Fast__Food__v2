"use client"

import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { StoreContext } from "../../context/StoreContext"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { compareNameWithSlug } from "../../utils/slugify"
import {
  ShoppingCart,
  Minus,
  Plus,
  CreditCard,
  Star,
  ChevronRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Heart,
  Share2,
  Info,
  Clock,
  Check,
} from "lucide-react"
import { motion } from "framer-motion"
import { slugify } from "../../utils/slugify"

const ProductDetail = () => {
  const { slug } = useParams()
  const { cartItems, addToCart, url } = useContext(StoreContext)
  const { food_list } = useContext(StoreContext)
  const navigate = useNavigate()

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [activeImage, setActiveImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isInWishlist, setIsInWishlist] = useState(false)

  // Tìm sản phẩm dựa trên slug (từ tên sản phẩm)
  const foodItem = food_list.find((item) => compareNameWithSlug(item.name, slug))

  useEffect(() => {
    window.scrollTo(0, 0)

    // Nếu tìm thấy sản phẩm, tìm các sản phẩm liên quan
    if (foodItem) {
      const related = food_list
        .filter((item) => item.category === foodItem.category && item.name !== foodItem.name)
        .slice(0, 4)
      setRelatedProducts(related)
    }
  }, [foodItem, food_list, slug])

  const handleAddToCart = () => {
    if (foodItem) {
      addToCart(foodItem.name, quantity) // Sử dụng name thay vì ID
      toast.success("Đã thêm vào giỏ hàng", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const handleBuyNow = () => {
    if (foodItem) {
      // Clear the cart first
      //setCartItems({}) //Cannot read properties of undefined (reading 'setCartItems')
      // Then add only this product
      addToCart(foodItem.name, quantity)
      navigate("/order")
    }
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist)
    toast.info(isInWishlist ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích", {
      autoClose: 2000,
    })
  }

  // Nếu không tìm thấy sản phẩm
  if (!foodItem) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-8 max-w-md">
          <div className="text-primary text-5xl mb-4">404</div>
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate("/foods")}
            className="bg-primary hover:bg-primary-light text-dark py-2 px-6 rounded-lg transition-colors"
          >
            Quay lại thực đơn
          </button>
        </div>
      </div>
    )
  }

  // Tạo mảng hình ảnh giả lập (trong thực tế sẽ lấy từ API)
  const productImages = [
    url + "/images/" + foodItem.image,
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  ]

  // Thông tin chi tiết sản phẩm (giả lập)
  const productDetails = {
    weight: "300g",
    ingredients: "Bột mì, trứng, sữa, đường, muối, dầu ăn, men nở",
    origin: "Việt Nam",
    expiry: "3 ngày kể từ ngày sản xuất",
    storage: "Bảo quản ở nhiệt độ phòng hoặc tủ lạnh",
    nutrition: {
      calories: "350 kcal",
      protein: "8g",
      carbs: "45g",
      fat: "12g",
      sugar: "15g",
      sodium: "380mg",
    },
  }

  // Đánh giá sản phẩm (giả lập)
  const reviews = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      rating: 5,
      date: "15/04/2023",
      comment: "Món ăn rất ngon, đóng gói cẩn thận và giao hàng nhanh chóng. Tôi sẽ đặt lại lần sau.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Trần Thị B",
      rating: 4,
      date: "02/04/2023",
      comment: "Hương vị tuyệt vời, nhưng giao hàng hơi chậm một chút.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Lê Văn C",
      rating: 5,
      date: "28/03/2023",
      comment: "Chất lượng sản phẩm rất tốt, đúng như mô tả. Sẽ ủng hộ lần sau.",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  ]

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex py-4 text-sm">
          <ol className="flex items-center space-x-1">
            <li>
              <a href="/" className="text-gray-500 dark:text-gray-400 hover:text-primary">
                Trang chủ
              </a>
            </li>
            <li className="flex items-center">
              <ChevronRight size={16} className="text-gray-400" />
              <a href="/foods" className="text-gray-500 dark:text-gray-400 hover:text-primary ml-1">
                Thực đơn
              </a>
            </li>
            <li className="flex items-center">
              <ChevronRight size={16} className="text-gray-400" />
              <span className="text-dark dark:text-white ml-1 font-medium">{foodItem.name}</span>
            </li>
          </ol>
        </nav>

        {/* Product Detail Section */}
        <div className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-lg mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Images */}
            <div>
              <div className="relative h-80 md:h-96 mb-4 rounded-lg overflow-hidden">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={productImages[activeImage]}
                  alt={foodItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-full ${isInWishlist ? "bg-red-500 text-white" : "bg-white dark:bg-dark-light text-gray-700 dark:text-gray-300"}`}
                  >
                    <Heart size={20} className={isInWishlist ? "fill-current" : ""} />
                  </button>
                  <button className="p-2 rounded-full bg-white dark:bg-dark-light text-gray-700 dark:text-gray-300">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`cursor-pointer rounded-md overflow-hidden w-20 h-20 border-2 ${activeImage === index ? "border-primary" : "border-transparent"}`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${foodItem.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < 4.5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">(28 đánh giá)</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                  <Check size={16} className="mr-1" /> Đã bán 120+
                </span>
              </div>

              <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">{foodItem.name}</h1>

              <div className="mb-4">
                <span className="text-3xl font-bold text-primary mr-3">{foodItem.price.toLocaleString("vi-VN")} đ</span>
                {Math.random() > 0.5 && (
                  <span className="text-xl text-gray-400 line-through">
                    {(foodItem.price * 1.2).toFixed(0).toLocaleString("vi-VN")} đ
                  </span>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-dark-light p-4 rounded-lg mb-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{foodItem.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-dark dark:text-gray-300 font-medium">Số lượng</label>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Còn hàng</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 rounded-l-lg bg-gray-100 dark:bg-dark-light text-dark dark:text-white flex items-center justify-center hover:bg-primary transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="w-16 h-10 bg-gray-100 dark:bg-dark-light flex items-center justify-center text-dark dark:text-white font-medium">
                    {quantity}
                  </div>
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 rounded-r-lg bg-gray-100 dark:bg-dark-light text-dark dark:text-white flex items-center justify-center hover:bg-primary transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleBuyNow}
                  className="bg-primary hover:bg-primary-light text-dark py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                >
                  <CreditCard size={20} className="mr-2" />
                  Mua ngay
                </button>
                <button
                  onClick={handleAddToCart}
                  className="border border-primary text-primary dark:text-primary-lighter hover:bg-primary hover:text-dark py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Thêm vào giỏ
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-full mr-3">
                    <Truck size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">Giao hàng miễn phí</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Cho đơn từ 200k</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-full mr-3">
                    <ShieldCheck size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">Đảm bảo chất lượng</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">100% nguyên liệu sạch</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-full mr-3">
                    <RefreshCw size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark dark:text-white">Đổi trả dễ dàng</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Trong vòng 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="border-t border-gray-200 dark:border-dark-lighter">
            <div className="flex overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${
                  activeTab === "description"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Mô tả chi tiết
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${
                  activeTab === "specifications"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Thông tin sản phẩm
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${
                  activeTab === "reviews"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Đánh giá (3)
              </button>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose max-w-none dark:prose-invert prose-headings:text-dark dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300">
                  <h3>Giới thiệu về {foodItem.name}</h3>
                  <p>
                    {foodItem.description} Được chế biến từ những nguyên liệu tươi ngon nhất, đảm bảo mang đến cho bạn
                    trải nghiệm ẩm thực tuyệt vời nhất.
                  </p>
                  <p>
                    Món ăn này được đầu bếp của chúng tôi chế biến theo công thức truyền thống, kết hợp với kỹ thuật
                    hiện đại để tạo ra hương vị độc đáo, khó quên.
                  </p>
                  <h4>Đặc điểm nổi bật</h4>
                  <ul>
                    <li>Nguyên liệu tươi sạch, được lựa chọn kỹ lưỡng</li>
                    <li>Chế biến theo công thức độc quyền</li>
                    <li>Không sử dụng chất bảo quản</li>
                    <li>Đóng gói cẩn thận, giữ nguyên hương vị</li>
                  </ul>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-dark dark:text-white mb-4">Thông tin chi tiết</h3>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-dark-lighter">
                          <td className="py-3 text-gray-600 dark:text-gray-400">Khối lượng</td>
                          <td className="py-3 text-dark dark:text-white">{productDetails.weight}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-dark-lighter">
                          <td className="py-3 text-gray-600 dark:text-gray-400">Thành phần</td>
                          <td className="py-3 text-dark dark:text-white">{productDetails.ingredients}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-dark-lighter">
                          <td className="py-3 text-gray-600 dark:text-gray-400">Xuất xứ</td>
                          <td className="py-3 text-dark dark:text-white">{productDetails.origin}</td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-dark-lighter">
                          <td className="py-3 text-gray-600 dark:text-gray-400">Hạn sử dụng</td>
                          <td className="py-3 text-dark dark:text-white">{productDetails.expiry}</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-600 dark:text-gray-400">Bảo quản</td>
                          <td className="py-3 text-dark dark:text-white">{productDetails.storage}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-dark dark:text-white mb-4">Thông tin dinh dưỡng</h3>
                    <div className="bg-gray-50 dark:bg-dark-light rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-b border-gray-200 dark:border-dark-lighter pb-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
                          <p className="font-medium text-dark dark:text-white">{productDetails.nutrition.calories}</p>
                        </div>
                        <div className="border-b border-gray-200 dark:border-dark-lighter pb-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
                          <p className="font-medium text-dark dark:text-white">{productDetails.nutrition.protein}</p>
                        </div>
                        <div className="border-b border-gray-200 dark:border-dark-lighter pb-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Carbs</p>
                          <p className="font-medium text-dark dark:text-white">{productDetails.nutrition.carbs}</p>
                        </div>
                        <div className="border-b border-gray-200 dark:border-dark-lighter pb-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Chất béo</p>
                          <p className="font-medium text-dark dark:text-white">{productDetails.nutrition.fat}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Đường</p>
                          <p className="font-medium text-dark dark:text-white">{productDetails.nutrition.sugar}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Natri</p>
                          <p className="font-medium text-dark dark:text-white">{productDetails.nutrition.sodium}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center mb-2">
                        <Info size={18} className="text-primary mr-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Thông tin dinh dưỡng chỉ mang tính chất tham khảo
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock size={18} className="text-primary mr-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">Thời gian chuẩn bị: 15-20 phút</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-dark dark:text-white">Đánh giá từ khách hàng</h3>
                    <button className="bg-primary hover:bg-primary-light text-dark py-2 px-4 rounded-lg text-sm transition-colors">
                      Viết đánh giá
                    </button>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 dark:border-dark-lighter pb-6">
                        <div className="flex items-start">
                          <img
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.name}
                            className="w-10 h-10 rounded-full mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-dark dark:text-white">{review.name}</h4>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                            </div>
                            <div className="flex mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300 dark:text-gray-600"
                                  }
                                />
                              ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item, index) => (
                <div
                  key={item.name}
                  className="bg-white dark:bg-dark-light rounded-2xl overflow-hidden shadow-custom hover:shadow-hover transition-all hover:-translate-y-1 border border-gray-100 dark:border-dark-lighter"
                  onClick={() => navigate(`/product/${slugify(item.name)}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={url + "/images/" + item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-dark rounded-full p-1 shadow-md">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-primary fill-primary" />
                        <span className="text-xs font-medium ml-1 text-dark dark:text-white">4.8</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-1 truncate">{item.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-primary">{item.price.toLocaleString("vi-VN")} đ</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(item.name, 1)
                          toast.success("Đã thêm vào giỏ hàng", { autoClose: 2000 })
                        }}
                        className="bg-primary hover:bg-primary-dark text-dark p-2 rounded-full transition-colors"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProductDetail
