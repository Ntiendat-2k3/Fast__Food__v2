"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Send, ImageIcon, Search } from "lucide-react"

const Chat = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
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
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
    }
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
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))

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
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                      {selectedUser.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3 font-medium">{selectedUser.userName}</div>
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
                          {msg.image && (
                            <img
                              src={`${baseUrl}/images/${msg.image}`}
                              alt="Message attachment"
                              className="mb-2 rounded-md max-w-full"
                              style={{ maxHeight: "200px" }}
                            />
                          )}
                          <p>{msg.content}</p>
                          <div className="text-xs mt-1 text-gray-300">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-gray-700">
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
                        accept="image/*"
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
                      <Send size={20} />
                    </button>
                  </form>
                  {selectedImage && <div className="mt-2 text-sm text-gray-400">Đã chọn: {selectedImage.name}</div>}
                </div>
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
