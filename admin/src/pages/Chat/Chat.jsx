"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Send, ImageIcon, Search, MoreVertical, X, Loader } from "lucide-react"

const Chat = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showGallery, setShowGallery] = useState(false)
  const [galleryImages, setGalleryImages] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [loadedImages, setLoadedImages] = useState({}) // Track loaded images
  const messagesContainerRef = useRef(null)
  const baseUrl = "http://localhost:4000" // Match the port in server.js

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/message/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setUsers(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()

    // Poll for new users every 10 seconds
    const intervalId = setInterval(fetchUsers, 10000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!selectedUser) return

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/message/conversation/${selectedUser._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.data.success) {
          setMessages(response.data.data)

          // Extract images from messages for the gallery
          const images = response.data.data
            .filter((msg) => msg.image)
            .map((msg) => ({
              id: msg._id,
              url: `${baseUrl}/images/${msg.image}`,
              filename: msg.image,
            }))

          setGalleryImages(images)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()

    // Poll for new messages every 3 seconds
    const intervalId = setInterval(fetchMessages, 3000)

    return () => clearInterval(intervalId)
  }, [selectedUser])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setShowGallery(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB")
        return
      }

      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
        alert("Only image files (JPEG, PNG, GIF, WEBP) are allowed")
        return
      }

      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryImageSelect = (imageUrl) => {
    // Extract the filename from the URL
    const filename = imageUrl.split("/").pop()

    // Set the preview directly without fetching
    setImagePreview(imageUrl)
    setShowGallery(false)

    // Create a file object from the URL
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], filename, { type: blob.type })
        setSelectedImage(file)
      })
      .catch((err) => console.error("Error selecting gallery image:", err))
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if ((!newMessage.trim() && !selectedImage) || !selectedUser) {
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("content", newMessage)
      formData.append("userId", selectedUser._id) // Add the recipient's userId

      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      const response = await axios.post(`${baseUrl}/api/message/send`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.data.success) {
        // Add isAdmin: true to the message
        const adminMessage = { ...response.data.data, isAdmin: true }
        setMessages([...messages, adminMessage])
        setNewMessage("")
        setSelectedImage(null)
        setImagePreview(null)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle image load event
  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }))
  }

  // Handle image error event
  const handleImageError = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true })) // Mark as loaded to remove spinner
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Quản Lý Chat</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-150px)]">
          {/* User List */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-gray-800">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full bg-gray-800 text-white p-2 pl-8 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-56px)]">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-gray-400 p-4">Không có người dùng nào</div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className={`p-3 border-b border-gray-800 cursor-pointer hover:bg-gray-800 ${
                      selectedUser && selectedUser._id === user._id ? "bg-gray-800" : ""
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                        {user.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{user.userName}</div>
                        <div className="text-xs text-gray-400">{new Date(user.lastMessage).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="bg-gray-900 rounded-lg overflow-hidden col-span-3 flex flex-col">
            {selectedUser ? (
              <>
                <div className="bg-gray-800 p-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                        {selectedUser.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3 font-medium">{selectedUser.userName}</div>
                    </div>
                    <button
                      onClick={() => setShowGallery(!showGallery)}
                      className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                      title="Xem ảnh đã gửi"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto" ref={messagesContainerRef}>
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                      <p>Không có tin nhắn nào</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={msg._id || index}
                        className={`mb-4 flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[70%] p-3 rounded-lg ${msg.isAdmin ? "bg-blue-600" : "bg-gray-700"}`}>
                          {msg.content && <p>{msg.content}</p>}

                          {msg.image && (
                            <div className="relative mt-2">
                              {!loadedImages[msg._id] && (
                                <div className="flex justify-center items-center py-4">
                                  <Loader className="animate-spin h-6 w-6 text-white" />
                                </div>
                              )}
                              <img
                                src={`${baseUrl}/images/${msg.image}`}
                                alt="Message attachment"
                                className={`rounded-md max-w-full cursor-pointer ${!loadedImages[msg._id] ? "hidden" : ""}`}
                                style={{ maxHeight: "200px" }}
                                onClick={() => window.open(`${baseUrl}/images/${msg.image}`, "_blank")}
                                onLoad={() => handleImageLoad(msg._id)}
                                onError={() => handleImageError(msg._id)}
                              />
                            </div>
                          )}

                          <div className="text-xs mt-1 text-gray-300">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-gray-700">
                  {imagePreview && (
                    <div className="relative mb-2 inline-block">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="h-20 w-auto rounded-md border border-gray-300"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null)
                          setImagePreview(null)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-gray-800 text-white p-2 rounded-l-md focus:outline-none"
                      placeholder="Nhập tin nhắn..."
                      disabled={loading}
                    />
                    <label className="bg-gray-700 px-3 py-2 cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={loading}
                      />
                      <ImageIcon size={20} className="text-gray-300" />
                    </label>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                  </form>
                </div>

                {/* Image Gallery Modal */}
                {showGallery && (
                  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-medium">Ảnh đã gửi</h3>
                        <button onClick={() => setShowGallery(false)} className="p-1 rounded-full hover:bg-gray-700">
                          <X size={20} />
                        </button>
                      </div>

                      <div className="p-4 overflow-y-auto flex-1">
                        {galleryImages.length === 0 ? (
                          <div className="text-center text-gray-400 py-8">
                            <p>Không có ảnh nào</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {galleryImages.map((image) => (
                              <div
                                key={image.id}
                                className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => handleGalleryImageSelect(image.url)}
                              >
                                <img
                                  src={image.url || "/placeholder.svg"}
                                  alt="Shared image"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M100 70 A10 10 0 1 0 100 90 A10 10 0 1 0 100 70 Z' fill='%23888'/%3E%3Cpath d='M80 120 L100 100 L120 120 L130 110 L140 130 L60 130 L70 110 Z' fill='%23888'/%3E%3C/svg%3E"
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <p>Chọn một người dùng để bắt đầu trò chuyện</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
