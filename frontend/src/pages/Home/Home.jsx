"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { ArrowRight, Star, Clock, Truck, ShoppingBag, ChevronRight, Heart, Award, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { StoreContext } from "../../context/StoreContext"
import { slugify } from "../../utils/slugify"

const Home = () => {
  const [category, setCategory] = useState("All")
  const { food_list, url } = useContext(StoreContext)
  const [featuredItems, setFeaturedItems] = useState([])

  useEffect(() => {
    // Get 3 random items for featured section
    if (food_list.length > 0) {
      const shuffled = [...food_list].sort(() => 0.5 - Math.random())
      setFeaturedItems(shuffled.slice(0, 3))
    }
  }, [food_list])

  // Testimonials data
  const testimonials = [
    {
      name: "Nguyễn Thị Hương",
      role: "Khách hàng thường xuyên",
      comment: "Chất lượng thức ăn và tốc độ giao hàng rất tuyệt vời. Đây là dịch vụ giao đồ ăn yêu thích của tôi!",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Trần Minh Tuấn",
      role: "Người yêu ẩm thực",
      comment: "Tôi thích sự đa dạng của các món ăn. Mọi thứ tôi đã thử đều ngon và tươi.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Lê Thị Mai",
      role: "Doanh nhân bận rộn",
      comment: "Giao hàng nhanh và thức ăn luôn nóng hổi. Hoàn hảo cho lịch trình bận rộn của tôi!",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ]

  // Services data
  const services = [
    {
      title: "Giao hàng nhanh",
      description: "Chúng tôi giao đồ ăn trong vòng 30 phút trong khu vực của bạn.",
      icon: <Truck className="h-8 w-8 text-white" />,
    },
    {
      title: "Đặt hàng dễ dàng",
      description: "Đặt đồ ăn chỉ với vài cú nhấp chuột và thanh toán trực tuyến an toàn.",
      icon: <ShoppingBag className="h-8 w-8 text-white" />,
    },
    {
      title: "Phục vụ 24/7",
      description: "Dịch vụ khách hàng của chúng tôi hoạt động 24/7 để hỗ trợ bạn.",
      icon: <Clock className="h-8 w-8 text-white" />,
    },
  ]

  // Categories for quick access
  const categories = [
    {
      name: "Burger",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1202&q=80",
    },
    {
      name: "Pizza",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      name: "Pasta",
      image:
        "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
    {
      name: "Salad",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')] bg-cover bg-center opacity-20"></div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-xl"
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                  Thưởng thức <span className="text-yellow-400">ẩm thực</span> tuyệt vời tại nhà
                </h1>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Đặt món ăn yêu thích của bạn chỉ với vài cú nhấp chuột. Chúng tôi giao hàng nhanh chóng và đảm bảo
                  chất lượng.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/foods"
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-yellow-400/20"
                  >
                    Đặt hàng ngay <ArrowRight size={18} className="ml-2" />
                  </Link>
                  <Link
                    to="/foods"
                    className="bg-transparent hover:bg-white/10 border border-white/30 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
                  >
                    Xem thực đơn
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="https://img.freepik.com/free-photo/delicious-burger-with-many-ingredients-isolated-white-background-tasty-cheeseburger-splash-sauce_90220-1266.jpg"
                  alt="Delicious Burger"
                  className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center">
                    <div className="bg-yellow-400 rounded-full p-2 mr-3">
                      <Clock className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold">Giao hàng nhanh</p>
                      <p className="text-gray-600 text-sm">30 phút hoặc miễn phí</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Khám phá danh mục</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Tìm kiếm món ăn yêu thích của bạn từ nhiều danh mục khác nhau
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link to="/foods" key={index}>
                <motion.div whileHover={{ y: -5 }} className="relative rounded-xl overflow-hidden shadow-md h-40 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 p-4 z-20">
                    <h3 className="text-white font-bold text-xl">{category.name}</h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">
              <span className="text-gray-900">Thực đơn </span>
              <span className="text-yellow-500">nổi bật</span>
            </h2>
            <Link to="/foods" className="text-gray-900 hover:text-yellow-500 flex items-center font-medium">
              Xem tất cả <ChevronRight size={18} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="h-48 overflow-hidden relative group">
                  <img
                    src={url + "/images/" + item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-5 w-5 text-red-500" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-yellow-500">{item.price.toLocaleString("vi-VN")} đ</span>
                    <Link
                      to={`/product/${slugify(item.name)}`}
                      className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Đặt ngay
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="md:w-1/2 p-8 md:p-12">
              <span className="inline-block bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full mb-4">
                Ưu đãi đặc biệt
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Combo burger đặc biệt</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Thưởng thức combo burger đặc biệt của chúng tôi với giá ưu đãi. Chỉ áp dụng trong hôm nay, đừng bỏ lỡ cơ
                hội này!
              </p>
              <div className="mb-6">
                <span className="text-yellow-400 text-5xl font-bold">45.000đ</span>
                <span className="text-gray-400 text-xl ml-2 line-through">69.000đ</span>
              </div>
              <Link
                to="/foods"
                className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                Đặt ngay
              </Link>
            </div>
            <div className="md:w-1/2 relative">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1202&q=80"
                alt="Burger đặc biệt"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                -35%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-white">Dịch vụ </span>
              <span className="text-yellow-400">của chúng tôi</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Chúng tôi cung cấp dịch vụ tốt nhất để đảm bảo thức ăn của bạn đến tươi ngon và đúng giờ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-yellow-400/5 transition-all hover:-translate-y-1 border border-gray-700"
              >
                <div className="bg-yellow-400 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gray-900">Khách hàng</span>
              <span className="text-yellow-500"> hài lòng</span>
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Hãy xem khách hàng nói gì về trải nghiệm với dịch vụ giao đồ ăn của chúng tôi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-yellow-400"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.comment}"</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-gray-900">Tải ứng dụng </span>
                  <span className="text-yellow-500">của chúng tôi</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Tải ứng dụng của chúng tôi để có trải nghiệm đặt hàng tốt hơn và nhận nhiều ưu đãi độc quyền.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <a href="#" className="inline-block">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                      alt="Google Play"
                      className="h-12"
                    />
                  </a>
                  <a href="#" className="inline-block">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png"
                      alt="App Store"
                      className="h-12"
                    />
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <img
                      src="https://randomuser.me/api/portraits/men/86.jpg"
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">Hơn 10,000 lượt tải</p>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <img
                  src="https://img.freepik.com/free-vector/food-delivery-app-smartphone_23-2148766888.jpg"
                  alt="Mobile App"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-gray-900">Liên hệ </span>
                <span className="text-yellow-500">với chúng tôi</span>
              </h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Bạn có câu hỏi hoặc phản hồi? Chúng tôi rất muốn nghe từ bạn. Điền vào biểu mẫu và chúng tôi sẽ liên hệ
                lại với bạn sớm nhất có thể.
              </p>
              <form className="space-y-4 max-w-md">
                <div>
                  <input
                    type="text"
                    placeholder="Họ tên của bạn"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Tin nhắn của bạn"
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-100 rounded-xl p-8 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="bg-yellow-400 rounded-full p-3 mr-4">
                      <MapPin className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Địa chỉ</h3>
                      <p className="text-gray-600">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-400 rounded-full p-3 mr-4">
                      <Clock className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Giờ mở cửa</h3>
                      <p className="text-gray-600">Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-400 rounded-full p-3 mr-4">
                      <Award className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Chất lượng</h3>
                      <p className="text-gray-600">Đảm bảo thực phẩm tươi ngon mỗi ngày</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-400 rounded-full p-3 mr-4">
                      <Truck className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Giao hàng</h3>
                      <p className="text-gray-600">Miễn phí giao hàng trong bán kính 5km</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <img
                    src="https://maps.googleapis.com/maps/api/staticmap?center=10.7758439,106.7017555&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7C10.7758439,106.7017555&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
                    alt="Map"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
