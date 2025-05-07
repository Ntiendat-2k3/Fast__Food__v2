"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ArrowRight, Star, Clock, Truck, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { StoreContext } from "../../context/StoreContext";
import { slugify } from "../../utils/slugify";


const Home = () => {
  const [category, setCategory] = useState("All");
  const { food_list, url } = useContext(StoreContext);
  const [featuredItems, setFeaturedItems] = useState([]);
  console.log(featuredItems);


  useEffect(() => {
    // Get 3 random items for featured section
    if (food_list.length > 0) {
      const shuffled = [...food_list].sort(() => 0.5 - Math.random());
      setFeaturedItems(shuffled.slice(0, 3));
    }
  }, [food_list]);

  // Testimonials data
  const testimonials = [
    {
      name: "Nguyễn Thị Hương",
      role: "Khách hàng thường xuyên",
      comment:
        "Chất lượng thức ăn và tốc độ giao hàng rất tuyệt vời. Đây là dịch vụ giao đồ ăn yêu thích của tôi!",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Trần Minh Tuấn",
      role: "Người yêu ẩm thực",
      comment:
        "Tôi thích sự đa dạng của các món ăn. Mọi thứ tôi đã thử đều ngon và tươi.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Lê Thị Mai",
      role: "Doanh nhân bận rộn",
      comment:
        "Giao hàng nhanh và thức ăn luôn nóng hổi. Hoàn hảo cho lịch trình bận rộn của tôi!",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  // Services data
  const services = [
    {
      title: "Giao hàng nhanh",
      description:
        "Chúng tôi giao đồ ăn trong vòng 30 phút trong khu vực của bạn.",
      icon: <Truck className="h-8 w-8 text-dark dark:text-white" />,
    },
    {
      title: "Đặt hàng dễ dàng",
      description:
        "Đặt đồ ăn chỉ với vài cú nhấp chuột và thanh toán trực tuyến an toàn.",
      icon: <ShoppingBag className="h-8 w-8 text-dark dark:text-white" />,
    },
    {
      title: "Phục vụ 24/7",
      description:
        "Dịch vụ khách hàng của chúng tôi hoạt động 24/7 để hỗ trợ bạn.",
      icon: <Clock className="h-8 w-8 text-dark dark:text-white" />,
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-dark overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-dark opacity-90"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary rounded-full opacity-20"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary rounded-full opacity-20"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-accent rounded-full opacity-10"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  <span className="text-white">Are you</span>
                  <br />
                  <span className="text-primary">hungry?</span>
                </h1>
                <p className="text-white/80 text-lg mb-8 max-w-md">
                  Bạn có thể đặt hàng tại đây rất dễ dàng và đơn giản. Chỉ cần
                  vài cú nhấp chuột và bữa ăn ngon của bạn sẽ được giao đến tận
                  nơi!
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/foods"
                    className="bg-primary hover:bg-primary-dark text-dark font-medium py-3 px-6 rounded-full transition-colors flex items-center"
                  >
                    Đặt hàng ngay <ArrowRight size={18} className="ml-2" />
                  </Link>
                  <Link
                    to="/foods"
                    className="border border-white/30 hover:border-white text-white font-medium py-3 px-6 rounded-full transition-colors"
                  >
                    Xem thực đơn
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="https://quantrinhahang.edu.vn/wp-content/uploads/2019/06/fast-food-la-gi.jpg"
                  alt="Người giao hàng"
                  className="w-full max-w-md mx-auto"
                />
                <div className="absolute -bottom-5 -left-5 bg-primary rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center">
                    <div className="bg-white rounded-full p-2 mr-3">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-dark font-bold">Giao hàng nhanh</p>
                      <p className="text-dark/70 text-sm">
                        30 phút hoặc miễn phí
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16 bg-white dark:bg-dark transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-dark dark:text-white">Thực đơn </span>
              <span className="text-primary">nổi bật</span>
            </h2>
            <Link
              to="/foods"
              className="text-dark dark:text-white hover:text-primary dark:hover:text-primary flex items-center font-medium"
            >
              Xem tất cả <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-dark-light rounded-2xl overflow-hidden shadow-custom hover:shadow-hover transition-shadow border border-gray-100 dark:border-dark-lighter cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={url + "/images/" + item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-dark dark:text-white">
                      {item.name}
                    </h3>
                    <div className="flex items-center bg-primary-light px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 text-primary fill-primary mr-1" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">
                      {item.price.toLocaleString("vi-VN")} đ
                    </span>
                    <Link
                      to={`/product/${slugify(item.name)}`}
                      className="bg-primary hover:bg-primary-dark text-dark font-medium py-2 px-4 rounded-full transition-colors text-sm"
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
      <section className="py-16 bg-gray-50 dark:bg-dark-lighter transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center bg-dark rounded-3xl overflow-hidden">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="text-white">Đặc biệt hôm nay</span>
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-primary">Ưu đãi bất ngờ</span>
              </h3>
              <p className="text-white/80 mb-6">
                Thưởng thức món ăn đặc biệt của chúng tôi với giá ưu đãi. Chỉ áp
                dụng trong hôm nay, đừng bỏ lỡ cơ hội này!
              </p>
              <div className="mb-6">
                <span className="text-primary text-5xl font-bold">45.000đ</span>
                <span className="text-white/60 text-xl ml-2">69.000đ</span>
              </div>
              <Link
                to="/foods"
                className="inline-block bg-primary hover:bg-primary-dark text-dark font-medium py-3 px-6 rounded-full transition-colors"
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
              <div className="absolute top-4 right-4 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
                -35%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-dark transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-dark dark:text-white">Khách hàng</span>
              <br />
              <span className="text-primary">hài lòng của chúng tôi</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Hãy xem khách hàng nói gì về trải nghiệm với dịch vụ giao đồ ăn
              của chúng tôi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-dark-light rounded-2xl p-6 shadow-custom hover:shadow-hover transition-shadow border border-gray-100 dark:border-dark-lighter"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-dark dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {testimonial.comment}
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-primary fill-primary"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-lighter transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-dark dark:text-white">Dịch vụ </span>
              <span className="text-primary">của chúng tôi</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Chúng tôi cung cấp dịch vụ tốt nhất để đảm bảo thức ăn của bạn đến
              tươi ngon và đúng giờ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-dark-light rounded-2xl p-8 shadow-custom hover:shadow-hover transition-all hover:-translate-y-1 border border-gray-100 dark:border-dark-lighter"
              >
                <div className="bg-primary-light rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-dark dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 bg-white dark:bg-dark transition-colors duration-300"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-dark dark:text-white">Liên hệ </span>
                <span className="text-primary">với chúng tôi</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                Bạn có câu hỏi hoặc phản hồi? Chúng tôi rất muốn nghe từ bạn.
                Điền vào biểu mẫu và chúng tôi sẽ liên hệ lại với bạn sớm nhất
                có thể.
              </p>
              <form className="space-y-4 max-w-md">
                <div>
                  <input
                    type="text"
                    placeholder="Họ tên của bạn"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-dark-lighter dark:bg-dark-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-dark-lighter dark:bg-dark-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Tin nhắn của bạn"
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-dark-lighter dark:bg-dark-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-dark font-medium py-3 px-6 rounded-full transition-colors"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Liên hệ"
                className="rounded-2xl shadow-custom w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
