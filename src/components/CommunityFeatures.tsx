"use client"

import { useState, useEffect } from "react"
import { Users, MessageCircle, Share2, MapPin, Heart, Send } from "lucide-react"

interface Post {
  id: number
  user: string
  location: string
  message: string
  time: string
  likes: number
  replies: Reply[]
  liked: boolean
}

interface Reply {
  id: number
  user: string
  message: string
  time: string
}

export default function CommunityFeatures() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [userLocation, setUserLocation] = useState("Your Area")

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem('communityPosts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      // Default posts
      const defaultPosts: Post[] = [
        { 
          id: 1, 
          user: "John Farmer", 
          location: "Punjab", 
          message: "Great rice harvest this season! Used the recommended fertilizer mix from the app. Yield increased by 20%!", 
          time: formatTime(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
          likes: 12,
          replies: [
            { id: 1, user: "Sarah Green", message: "Which fertilizer mix did you use?", time: "1 hour ago" }
          ],
          liked: false
        },
        { 
          id: 2, 
          user: "Sarah Green", 
          location: "Maharashtra", 
          message: "Looking for advice on wheat planting in sandy soil. The soil analysis showed low nitrogen. Any suggestions?", 
          time: formatTime(new Date(Date.now() - 24 * 60 * 60 * 1000)), // 1 day ago
          likes: 8,
          replies: [],
          liked: false
        }
      ]
      setPosts(defaultPosts)
      localStorage.setItem('communityPosts', JSON.stringify(defaultPosts))
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchLocationName(position.coords.latitude, position.coords.longitude)
        },
        () => setUserLocation("Your Area")
      )
    }
  }, [])

  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
      const data = await response.json()
      setUserLocation(data.city || data.locality || "Your Area")
    } catch (error) {
      setUserLocation("Your Area")
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const addPost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now(),
        user: "You",
        location: userLocation,
        message: newPost,
        time: "Just now",
        likes: 0,
        replies: [],
        liked: false
      }
      
      const updatedPosts = [post, ...posts]
      setPosts(updatedPosts)
      localStorage.setItem('communityPosts', JSON.stringify(updatedPosts))
      
      setNewPost("")
      setShowForm(false)
    }
  }

  const toggleLike = (postId: number) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    })
    setPosts(updatedPosts)
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts))
  }

  const addReply = (postId: number) => {
    if (replyText.trim()) {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const newReply: Reply = {
            id: Date.now(),
            user: "You",
            message: replyText,
            time: "Just now"
          }
          return {
            ...post,
            replies: [...post.replies, newReply]
          }
        }
        return post
      })
      setPosts(updatedPosts)
      localStorage.setItem('communityPosts', JSON.stringify(updatedPosts))
      
      setReplyText("")
      setReplyingTo(null)
    }
  }

  const deletePost = (postId: number) => {
    const updatedPosts = posts.filter(post => post.id !== postId)
    setPosts(updatedPosts)
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center text-gray-800">
          <Users className="mr-2" /> Farmer Community
          <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
            {posts.length} posts
          </span>
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
        >
          <Share2 className="h-4 w-4 mr-1" /> Share
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <textarea
            placeholder="Share your farming experience, ask questions, or give advice..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full border rounded px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">
              {newPost.length}/500 characters • Posting as You from {userLocation}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={addPost} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                disabled={!newPost.trim()}
              >
                <Send className="h-4 w-4 mr-1" /> Post
              </button>
              <button 
                onClick={() => setShowForm(false)} 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No posts yet. Be the first to share!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {post.user.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{post.user}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {post.location} • {post.time}
                    </p>
                  </div>
                </div>
                {post.user === "You" && (
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              <p className="text-gray-800 mb-3 ml-11">{post.message}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 ml-11">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center hover:text-red-600 transition-colors ${
                    post.liked ? 'text-red-600' : ''
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                  {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                </button>
                
                <button 
                  onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                </button>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="mt-3 ml-11 space-y-2">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 p-2 rounded text-sm">
                      <div className="flex items-center mb-1">
                        <span className="font-medium">{reply.user}</span>
                        <span className="text-gray-500 ml-2">{reply.time}</span>
                      </div>
                      <p className="text-gray-800">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              {replyingTo === post.id && (
                <div className="mt-3 ml-11">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addReply(post.id)}
                    />
                    <button
                      onClick={() => addReply(post.id)}
                      className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                      disabled={!replyText.trim()}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}