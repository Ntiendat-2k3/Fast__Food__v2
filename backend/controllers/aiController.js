import foodModel from "../models/foodModel.js"
import voucherModel from "../models/voucherModel.js"

// Hàm xử lý chat với AI
const chatWithAI = async (req, res) => {
  try {
    const { message, userContext, history } = req.body

    // Phân tích nội dung tin nhắn để xác định ý định của người dùng
    const intent = analyzeIntent(message.toLowerCase())

    let reply = ""

    switch (intent) {
      case "greeting":
        reply = generateGreetingReply()
        break

      case "menu_inquiry":
        const foods = await getFoodRecommendations(message)
        reply = generateFoodReply(foods, message)
        break

      case "order_status":
        reply = generateOrderStatusReply(userContext)
        break

      case "voucher_inquiry":
        const vouchers = await getActiveVouchers()
        reply = generateVoucherReply(vouchers)
        break

      case "payment_methods":
        reply = generatePaymentMethodsReply()
        break

      case "delivery_time":
        reply = generateDeliveryTimeReply()
        break

      case "contact_info":
        reply = generateContactInfoReply()
        break

      case "order_guide":
        reply = generateOrderGuideReply()
        break

      case "store_hours":
        reply = generateStoreHoursReply()
        break

      case "nutrition_info":
        reply = generateNutritionInfoReply()
        break

      case "complaint":
        reply = generateComplaintReply()
        break

      case "praise":
        reply = generatePraiseReply()
        break

      default:
        reply = generateDefaultReply()
    }

    // Trả về phản hồi
    res.json({ success: true, reply })
  } catch (error) {
    console.error("Error in AI chat:", error)
    res.json({
      success: false,
      reply: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau hoặc liên hệ hotline: 1900-1234.",
    })
  }
}

// Phân tích ý định từ tin nhắn
const analyzeIntent = (message) => {
  // Greeting patterns
  if (
    message.includes("xin chào") ||
    message.includes("chào") ||
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey")
  ) {
    return "greeting"
  }

  // Menu inquiry patterns
  if (
    message.includes("món") ||
    message.includes("thực đơn") ||
    message.includes("đồ ăn") ||
    message.includes("menu") ||
    message.includes("burger") ||
    message.includes("pizza") ||
    message.includes("gà") ||
    message.includes("chicken") ||
    message.includes("mì") ||
    message.includes("pasta") ||
    message.includes("salad") ||
    message.includes("đồ uống") ||
    message.includes("nước") ||
    message.includes("tìm kiếm") ||
    message.includes("có gì") ||
    message.includes("bán gì")
  ) {
    return "menu_inquiry"
  }

  // Order status patterns
  if (
    message.includes("đơn hàng") ||
    message.includes("trạng thái") ||
    message.includes("theo dõi") ||
    message.includes("kiểm tra đơn") ||
    message.includes("order")
  ) {
    return "order_status"
  }

  // Voucher inquiry patterns
  if (
    message.includes("mã giảm giá") ||
    message.includes("voucher") ||
    message.includes("khuyến mãi") ||
    message.includes("giảm giá") ||
    message.includes("ưu đãi") ||
    message.includes("coupon")
  ) {
    return "voucher_inquiry"
  }

  // Payment methods patterns
  if (
    message.includes("thanh toán") ||
    message.includes("payment") ||
    message.includes("trả tiền") ||
    message.includes("phương thức") ||
    message.includes("vnpay") ||
    message.includes("momo") ||
    message.includes("cod")
  ) {
    return "payment_methods"
  }

  // Delivery time patterns
  if (
    message.includes("giao hàng") ||
    message.includes("thời gian") ||
    message.includes("delivery") ||
    message.includes("bao lâu") ||
    message.includes("ship") ||
    message.includes("vận chuyển")
  ) {
    return "delivery_time"
  }

  // Contact info patterns
  if (
    message.includes("liên hệ") ||
    message.includes("số điện thoại") ||
    message.includes("email") ||
    message.includes("hotline") ||
    message.includes("contact")
  ) {
    return "contact_info"
  }

  // Order guide patterns
  if (
    message.includes("cách đặt") ||
    message.includes("hướng dẫn") ||
    message.includes("làm sao") ||
    message.includes("đặt hàng") ||
    message.includes("order guide")
  ) {
    return "order_guide"
  }

  // Store hours patterns
  if (
    message.includes("giờ mở cửa") ||
    message.includes("mở cửa") ||
    message.includes("đóng cửa") ||
    message.includes("hoạt động") ||
    message.includes("hours")
  ) {
    return "store_hours"
  }

  // Nutrition info patterns
  if (
    message.includes("dinh dưỡng") ||
    message.includes("calo") ||
    message.includes("calories") ||
    message.includes("thành phần") ||
    message.includes("nutrition")
  ) {
    return "nutrition_info"
  }

  // Complaint patterns
  if (
    message.includes("khiếu nại") ||
    message.includes("phản ánh") ||
    message.includes("không hài lòng") ||
    message.includes("tệ") ||
    message.includes("complaint") ||
    message.includes("problem")
  ) {
    return "complaint"
  }

  // Praise patterns
  if (
    message.includes("cảm ơn") ||
    message.includes("tuyệt vời") ||
    message.includes("tốt") ||
    message.includes("ngon") ||
    message.includes("hài lòng") ||
    message.includes("thank")
  ) {
    return "praise"
  }

  return "unknown"
}

// Generate greeting reply
const generateGreetingReply = () => {
  const greetings = [
    "Xin chào! Tôi là trợ lý ảo của GreenEats. Tôi có thể giúp bạn tìm món ăn ngon, kiểm tra đơn hàng hoặc giải đáp thắc mắc. Bạn cần hỗ trợ gì?",
    "Chào bạn! Rất vui được hỗ trợ bạn hôm nay. Tôi có thể giúp bạn về thực đơn, đơn hàng, mã giảm giá và nhiều thông tin khác. Bạn muốn biết gì?",
    "Hello! Chào mừng bạn đến với GreenEats. Tôi sẵn sàng hỗ trợ bạn 24/7. Hãy cho tôi biết bạn cần giúp đỡ gì nhé!",
  ]
  return greetings[Math.floor(Math.random() * greetings.length)]
}

// Lấy gợi ý món ăn
const getFoodRecommendations = async (message) => {
  try {
    let category = null
    let searchTerm = ""

    // Phân tích category từ tin nhắn
    if (message.includes("burger")) {
      category = "Burger"
      searchTerm = "burger"
    } else if (message.includes("pizza")) {
      category = "Pizza"
      searchTerm = "pizza"
    } else if (message.includes("gà") || message.includes("chicken")) {
      category = "Gà"
      searchTerm = "gà"
    } else if (message.includes("mì") || message.includes("pasta")) {
      category = "Mì"
      searchTerm = "mì"
    } else if (message.includes("salad")) {
      category = "Salad"
      searchTerm = "salad"
    } else if (message.includes("đồ uống") || message.includes("nước")) {
      category = "Đồ uống"
      searchTerm = "đồ uống"
    }

    // Truy vấn món ăn
    const query = {}
    if (category) {
      query.category = category
    } else if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ]
    }

    // Lấy tối đa 5 món ăn
    const foods = await foodModel.find(query).limit(5)
    return foods
  } catch (error) {
    console.error("Error getting food recommendations:", error)
    return []
  }
}

// Tạo phản hồi về món ăn
const generateFoodReply = (foods, originalMessage) => {
  if (!foods || foods.length === 0) {
    return `Xin lỗi, tôi không tìm thấy món ăn phù hợp với "${originalMessage}".

Bạn có thể:
• Truy cập mục "Thực đơn" để xem tất cả món ăn
• Thử tìm kiếm với từ khóa khác như: burger, pizza, gà, mì, salad, đồ uống
• Hoặc hỏi tôi "có món gì ngon?" để xem gợi ý

Tôi có thể giúp gì khác cho bạn?`
  }

  let reply = `🍽️ Đây là những món ăn tôi tìm được cho bạn:\n\n`

  foods.forEach((food, index) => {
    reply += `${index + 1}. **${food.name}**\n`
    reply += `   💰 Giá: ${food.price.toLocaleString("vi-VN")}đ\n`
    reply += `   📝 ${food.description.substring(0, 80)}${food.description.length > 80 ? "..." : ""}\n\n`
  })

  reply += `Bạn có thể xem chi tiết và đặt hàng trong mục "Thực đơn" hoặc tìm kiếm trực tiếp trên website.

Cần tôi giúp gì thêm không?`

  return reply
}

// Generate order status reply
const generateOrderStatusReply = (userContext) => {
  if (userContext.includes("chưa đăng nhập")) {
    return `Để kiểm tra trạng thái đơn hàng, bạn cần:

1. **Đăng nhập** vào tài khoản của mình
2. Truy cập mục **"Đơn hàng của tôi"**
3. Xem chi tiết trạng thái từng đơn hàng

Nếu bạn chưa có tài khoản, vui lòng đăng ký để theo dõi đơn hàng dễ dàng hơn.

Hoặc bạn có thể cung cấp **mã đơn hàng** để tôi hỗ trợ kiểm tra.`
  }

  return `Để kiểm tra trạng thái đơn hàng:

1. Truy cập mục **"Đơn hàng của tôi"** trên website
2. Xem danh sách tất cả đơn hàng và trạng thái hiện tại
3. Click vào đơn hàng cụ thể để xem chi tiết

**Các trạng thái đơn hàng:**
• 🔄 Đang xử lý - Nhà hàng đang chuẩn bị
• 🚚 Đang giao - Shipper đang trên đường
• ✅ Đã giao - Hoàn thành thành công

Cần hỗ trợ thêm về đơn hàng cụ thể nào không?`
}

// Lấy mã giảm giá đang hoạt động
const getActiveVouchers = async () => {
  try {
    const currentDate = new Date()

    const vouchers = await voucherModel
      .find({
        isPublic: true,
        expiryDate: { $gt: currentDate },
        isActive: true,
      })
      .limit(5)
      .sort({ createdAt: -1 })

    return vouchers
  } catch (error) {
    console.error("Error getting active vouchers:", error)
    return []
  }
}

// Tạo phản hồi về mã giảm giá
const generateVoucherReply = (vouchers) => {
  if (!vouchers || vouchers.length === 0) {
    return `🎫 Hiện tại không có mã giảm giá công khai nào đang hoạt động.

**Cách nhận mã giảm giá:**
• Theo dõi fanpage Facebook của GreenEats
• Đăng ký nhận thông báo qua email
• Tham gia các chương trình khuyến mãi đặc biệt
• Khách hàng thân thiết sẽ nhận mã ưu đãi riêng

Hãy quay lại kiểm tra thường xuyên nhé! 😊`
  }

  let reply = `🎫 **Mã giảm giá đang có hiệu lực:**\n\n`

  vouchers.forEach((voucher, index) => {
    reply += `${index + 1}. **Mã: ${voucher.code}**\n`

    if (voucher.discountType === "percentage") {
      reply += `   🎯 Giảm ${voucher.discountValue}%`
      if (voucher.maxDiscountAmount) {
        reply += ` (tối đa ${voucher.maxDiscountAmount.toLocaleString("vi-VN")}đ)`
      }
    } else {
      reply += `   🎯 Giảm ${voucher.discountValue.toLocaleString("vi-VN")}đ`
    }

    if (voucher.minimumOrderAmount) {
      reply += `\n   📦 Đơn hàng từ ${voucher.minimumOrderAmount.toLocaleString("vi-VN")}đ`
    }

    reply += `\n   ⏰ Hết hạn: ${new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}\n\n`
  })

  reply += `**Cách sử dụng:**
1. Thêm món ăn vào giỏ hàng
2. Tại trang thanh toán, nhập mã vào ô "Mã giảm giá"
3. Nhấn "Áp dụng" để được giảm giá

Chúc bạn có bữa ăn ngon miệng! 🍽️`

  return reply
}

// Generate payment methods reply
const generatePaymentMethodsReply = () => {
  return `💳 **Phương thức thanh toán tại GreenEats:**

**1. Thanh toán khi nhận hàng (COD)**
• Trả tiền mặt cho shipper
• Không phí phụ thu
• Phù hợp mọi khách hàng

**2. VNPay**
• Thanh toán qua thẻ ATM/Internet Banking
• Bảo mật cao, xử lý nhanh
• Hỗ trợ hầu hết ngân hàng Việt Nam

**3. Ví MoMo**
• Thanh toán qua ứng dụng MoMo
• Nhanh chóng, tiện lợi
• Có thể tích điểm MoMo

**4. Chuyển khoản ngân hàng**
• Chuyển khoản trực tiếp
• Thông tin tài khoản sẽ được cung cấp

Tất cả phương thức đều an toàn và được mã hóa. Bạn muốn biết thêm về phương thức nào?`
}

// Generate delivery time reply
const generateDeliveryTimeReply = () => {
  return `🚚 **Thông tin giao hàng GreenEats:**

**Thời gian giao hàng:**
• Trong nội thành: 25-35 phút
• Ngoại thành: 35-50 phút
• Giờ cao điểm có thể chậm hơn 10-15 phút

**Các yếu tố ảnh hưởng:**
• Khoảng cách từ cửa hàng đến địa chỉ giao
• Tình hình giao thông
• Thời tiết
• Số lượng đơn hàng trong giờ cao điểm

**Theo dõi đơn hàng:**
• Nhận SMS/thông báo khi shipper xuất phát
• Có thể gọi hotline để kiểm tra: 1900-1234
• Xem trạng thái trong mục "Đơn hàng của tôi"

**Cam kết:**
• Giao đúng giờ cam kết
• Đồ ăn còn nóng, đảm bảo chất lượng
• Hoàn tiền nếu giao quá 60 phút (trừ trường hợp bất khả kháng)

Bạn có câu hỏi gì khác về giao hàng không?`
}

// Generate contact info reply
const generateContactInfoReply = () => {
  return `📞 **Thông tin liên hệ GreenEats:**

**Hotline hỗ trợ khách hàng:**
📱 1900-1234 (24/7)

**Email:**
📧 support@greeneats.com
📧 info@greeneats.com

**Địa chỉ trụ sở:**
🏢 123 Đường ABC, Quận 1, TP.HCM

**Mạng xã hội:**
📘 Facebook: /GreenEatsVN
📷 Instagram: @greeneats_vn
🐦 Twitter: @GreenEatsVN

**Giờ hỗ trợ:**
• Hotline: 24/7
• Email: Phản hồi trong 2-4 giờ
• Chat trực tuyến: 7:00 - 22:00

**Khiếu nại/Góp ý:**
📧 feedback@greeneats.com
📱 Hotline: 1900-1234 (ấn phím 2)

Chúng tôi luôn sẵn sàng hỗ trợ bạn! 😊`
}

// Generate order guide reply
const generateOrderGuideReply = () => {
  return `📋 **Hướng dẫn đặt hàng tại GreenEats:**

**Bước 1: Chọn món ăn**
• Duyệt thực đơn hoặc tìm kiếm món yêu thích
• Xem chi tiết món ăn, giá cả, mô tả
• Nhấn "Thêm vào giỏ hàng"

**Bước 2: Kiểm tra giỏ hàng**
• Xem lại các món đã chọn
• Điều chỉnh số lượng nếu cần
• Áp dụng mã giảm giá (nếu có)

**Bước 3: Thông tin giao hàng**
• Nhập địa chỉ giao hàng chính xác
• Số điện thoại liên hệ
• Ghi chú đặc biệt (nếu có)

**Bước 4: Thanh toán**
• Chọn phương thức thanh toán
• Xác nhận thông tin đơn hàng
• Hoàn tất đặt hàng

**Bước 5: Theo dõi**
• Nhận xác nhận qua SMS/Email
• Theo dõi trạng thái trong "Đơn hàng của tôi"
• Nhận hàng và thưởng thức!

**Lưu ý:**
• Đăng ký tài khoản để đặt hàng nhanh hơn
• Kiểm tra khu vực giao hàng
• Đơn hàng tối thiểu: 50.000đ

Cần hỗ trợ thêm bước nào không?`
}

// Generate store hours reply
const generateStoreHoursReply = () => {
  return `🕐 **Giờ hoạt động của GreenEats:**

**Thời gian phục vụ:**
• **Thứ 2 - Chủ nhật:** 6:00 - 23:00
• **Không nghỉ lễ, Tết**

**Giờ cao điểm:**
• **Sáng:** 7:00 - 9:00 (đồ ăn sáng)
• **Trưa:** 11:00 - 13:00 (cơm trưa)
• **Tối:** 17:00 - 20:00 (cơm tối)

**Lưu ý:**
• Đặt hàng trước 22:30 để nhận hàng trước 23:00
• Giờ cao điểm có thể giao hàng chậm hơn
• Một số món có thể hết sớm vào cuối ngày

**Dịch vụ 24/7:**
• Hotline hỗ trợ: 1900-1234
• Website và app luôn sẵn sàng nhận đơn
• Trợ lý ảo (tôi) luôn ở đây để hỗ trợ! 🤖

Bạn có thể đặt hàng bất cứ lúc nào trong giờ hoạt động nhé!`
}

// Generate nutrition info reply
const generateNutritionInfoReply = () => {
  return `🥗 **Thông tin dinh dưỡng tại GreenEats:**

**Cam kết của chúng tôi:**
• Sử dụng nguyên liệu tươi, sạch
• Không chất bảo quản có hại
• Dầu ăn được thay đổi thường xuyên
• Tuân thủ tiêu chuẩn an toàn thực phẩm

**Thông tin dinh dưỡng:**
• Mỗi món ăn có thông tin calo cơ bản
• Danh sách thành phần chính
• Cảnh báo dị ứng (nếu có)

**Menu đặc biệt:**
🥗 **Healthy Choice:** Món ăn ít calo, nhiều rau
🌱 **Vegetarian:** Món chay, không thịt
🚫 **Gluten-Free:** Không chứa gluten

**Xem thông tin chi tiết:**
• Click vào từng món ăn trên website
• Phần "Thông tin dinh dưỡng"
• Hoặc hỏi tôi về món cụ thể

**Tư vấn dinh dưỡng:**
📧 nutrition@greeneats.com
📱 Hotline: 1900-1234 (ấn phím 3)

Bạn muốn biết về món ăn nào cụ thể?`
}

// Generate complaint reply
const generateComplaintReply = () => {
  return `😔 **Chúng tôi rất tiếc về trải nghiệm không tốt của bạn.**

**Để xử lý khiếu nại nhanh nhất:**

**1. Liên hệ ngay:**
📱 Hotline: 1900-1234 (ấn phím 2 - Khiếu nại)
📧 complaint@greeneats.com

**2. Thông tin cần cung cấp:**
• Mã đơn hàng
• Thời gian đặt hàng/nhận hàng
• Mô tả chi tiết vấn đề
• Hình ảnh (nếu có)

**3. Cam kết xử lý:**
• Phản hồi trong 30 phút (giờ hành chính)
• Hoàn tiền/đổi món nếu lỗi từ nhà hàng
• Bồi thường thích đáng cho những trường hợp nghiêm trọng

**4. Theo dõi:**
• Nhận mã ticket khiếu nại
• Cập nhật tiến độ xử lý qua SMS/Email

**Chúng tôi cam kết:**
✅ Lắng nghe và xử lý công bằng
✅ Cải thiện chất lượng dịch vụ
✅ Đảm bảo quyền lợi khách hàng

Bạn có thể chia sẻ thêm chi tiết để tôi hỗ trợ tốt hơn không?`
}

// Generate praise reply
const generatePraiseReply = () => {
  return `🥰 **Cảm ơn bạn rất nhiều!**

Lời khen của bạn là động lực lớn nhất cho đội ngũ GreenEats!

**Chúng tôi sẽ:**
• Chuyển lời cảm ơn đến bếp trưởng và nhân viên
• Tiếp tục cải thiện chất lượng món ăn
• Duy trì dịch vụ giao hàng tốt nhất

**Chia sẻ trải nghiệm:**
⭐ Đánh giá 5 sao trên website
📱 Chia sẻ trên mạng xã hội với hashtag #GreenEatsVN
👥 Giới thiệu bạn bè (có thể nhận voucher ưu đãi!)

**Chương trình khách hàng thân thiết:**
🎁 Tích điểm với mỗi đơn hàng
🎫 Nhận voucher sinh nhật đặc biệt
⚡ Ưu tiên giao hàng nhanh

**Theo dõi chúng tôi:**
📘 Facebook: /GreenEatsVN
📷 Instagram: @greeneats_vn

Một lần nữa, cảm ơn bạn đã tin tưởng GreenEats! Chúc bạn có những bữa ăn ngon miệng tiếp theo! 🍽️❤️`
}

// Generate default reply
const generateDefaultReply = () => {
  return `🤔 Xin lỗi, tôi chưa hiểu rõ yêu cầu của bạn.

**Tôi có thể hỗ trợ bạn về:**
🍽️ Tìm kiếm món ăn và thực đơn
📦 Kiểm tra trạng thái đơn hàng
🎫 Thông tin mã giảm giá
💳 Phương thức thanh toán
🚚 Thời gian giao hàng
📞 Thông tin liên hệ
📋 Hướng dẫn đặt hàng

**Bạn có thể hỏi như:**
• "Có món gà nào ngon không?"
• "Mã giảm giá hôm nay là gì?"
• "Đơn hàng của tôi đến đâu rồi?"
• "Cách đặt hàng như thế nào?"

Hoặc liên hệ hotline **1900-1234** để được hỗ trợ trực tiếp.

Bạn cần tôi giúp gì khác?`
}

export { chatWithAI }
