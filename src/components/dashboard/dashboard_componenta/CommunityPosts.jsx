import React, { useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Siren,
  FileText,
  MessageSquare,
  History,
  User,
  LogOut,
  BellRing,
  Clock3,
  Flame,
  UserRoundPlus,
  ImagePlus,
  Globe,
  Heart,
  Share2,
  MoreHorizontal,
  Send,
  X,
  Copy,
  Check,
  Link2,
  Pencil,
  Trash2,
  Bookmark,
} from "lucide-react";

const CommunityPosts = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("safeherUser")) || {
    fullName: "Rudramma",
    email: "mathadevaruruchita@gmail.com",
  };

  const currentUserName =
    currentUser.fullName || currentUser.name || "Rudramma";

  const currentUserInitials = currentUserName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [activeTab, setActiveTab] = useState("Recent");
  const [postText, setPostText] = useState("");
  const [audience, setAudience] = useState("Public");
  const [selectedImage, setSelectedImage] = useState("");
  const [copied, setCopied] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);

  const [shareModal, setShareModal] = useState({
    open: false,
    post: null,
  });

  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Jessica Martinez",
      author: "Jessica Martinez",
      time: "2 hours ago",
      audience: "Public",
      content:
        "Just wanted to share that I felt really safe walking home tonight thanks to the new lighting on Maple Street. The community efforts are really making a difference! #SafetyFirst #CommunityMatters",
      image: "",
      likes: 25,
      comments: [
        { id: 1, user: "Rudramma", text: "That is really good to hear." },
      ],
      shares: 1,
      liked: false,
      saved: false,
      showComments: false,
      newComment: "",
      canManage: false,
    },
    {
      id: 2,
      name: "Amanda Chen",
      author: "Amanda Chen",
      time: "4 hours ago",
      audience: "Community",
      content:
        "Reminder: The self-defense workshop is happening this Saturday at the community center from 2–4 PM. All women welcome! @SafeHerCommunity",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
      likes: 18,
      comments: [
        { id: 1, user: "Priya", text: "I will attend this workshop." },
        { id: 2, user: "Rudramma", text: "Thanks for sharing this event." },
      ],
      shares: 3,
      liked: false,
      saved: false,
      showComments: false,
      newComment: "",
      canManage: false,
    },
  ]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Emergency Contacts", path: "/contacts" },
    { icon: Siren, label: "SOS", path: "/sos" },
    { icon: FileText, label: "Incident Reports", path: "/reports" },
    { icon: MessageSquare, label: "Community Posts", path: "/community-posts", active: true },
    { icon: History, label: "SOS History", path: "/sos-history" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const filteredPosts = useMemo(() => {
    if (activeTab === "Popular") {
      return [...posts].sort((a, b) => b.likes - a.likes);
    }
    if (activeTab === "Following") {
      return posts.filter((post) => post.audience === "Community");
    }
    return posts;
  }, [posts, activeTab]);

  const tabClass = (tab) =>
    `inline-flex items-center gap-2 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold transition ${
      activeTab === tab
        ? "bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] text-white shadow-md"
        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
    }`;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  const handlePost = () => {
    if (!postText.trim() && !selectedImage) return;

    if (editingPostId) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingPostId
            ? {
                ...post,
                content: postText,
                image: selectedImage,
                audience,
              }
            : post
        )
      );
      setEditingPostId(null);
    } else {
      const newPost = {
        id: Date.now(),
        name: currentUserName,
        author: currentUserName,
        time: "Just now",
        audience,
        content: postText,
        image: selectedImage,
        likes: 0,
        comments: [],
        shares: 0,
        liked: false,
        saved: false,
        showComments: false,
        newComment: "",
        canManage: true,
      };

      setPosts((prev) => [newPost, ...prev]);
    }

    setPostText("");
    setSelectedImage("");
    setAudience("Public");
  };

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleToggleComments = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );
  };

  const handleCommentInput = (postId, value) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, newComment: value } : post
      )
    );
  };

  const handleAddComment = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId || !post.newComment.trim()) return post;

        const newCommentObj = {
          id: Date.now(),
          user: currentUserName,
          text: post.newComment,
        };

        return {
          ...post,
          comments: [...post.comments, newCommentObj],
          newComment: "",
          showComments: true,
        };
      })
    );
  };

  const getPostShareLink = (postId) => {
    return `${window.location.origin}/community-posts?post=${postId}`;
  };

  const openShareModal = (post) => {
    setPosts((prevPosts) =>
      prevPosts.map((item) =>
        item.id === post.id ? { ...item, shares: item.shares + 1 } : item
      )
    );

    setShareModal({
      open: true,
      post,
    });
    setCopied(false);
    setOpenMenuId(null);
  };

  const closeShareModal = () => {
    setShareModal({
      open: false,
      post: null,
    });
    setCopied(false);
  };

  const copyShareLink = async () => {
    if (!shareModal.post) return;

    const link = getPostShareLink(shareModal.post.id);

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const shareToWhatsApp = () => {
    if (!shareModal.post) return;
    const link = getPostShareLink(shareModal.post.id);
    const text = encodeURIComponent(`${shareModal.post.content}\n\n${link}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToFacebook = () => {
    if (!shareModal.post) return;
    const link = encodeURIComponent(getPostShareLink(shareModal.post.id));
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${link}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    if (!shareModal.post) return;
    const link = encodeURIComponent(getPostShareLink(shareModal.post.id));
    const text = encodeURIComponent(shareModal.post.content);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${link}`,
      "_blank"
    );
  };

  const shareToTelegram = () => {
    if (!shareModal.post) return;
    const link = encodeURIComponent(getPostShareLink(shareModal.post.id));
    const text = encodeURIComponent(shareModal.post.content);
    window.open(`https://t.me/share/url?url=${link}&text=${text}`, "_blank");
  };

  const handleToggleSave = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
    setOpenMenuId(null);
  };

  const handleEditPost = (post) => {
    setPostText(post.content);
    setSelectedImage(post.image || "");
    setAudience(post.audience);
    setEditingPostId(post.id);
    setOpenMenuId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
    setOpenMenuId(null);
  };

  return (
    <section className="min-h-screen bg-[#f6f8fc] text-slate-800">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col border-r border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-5 sm:px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
              <BellRing className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">SafeHer</h2>
          </div>

          <nav className="px-3 py-5">
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                      item.active
                        ? "bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto px-4 pb-6 pt-10">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Community
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Connect with your community and share safety updates
            </p>
          </div>

          <div className="px-4 py-6 sm:px-6">
            <div className="mb-8 flex flex-wrap gap-3">
              <button
                className={tabClass("Recent")}
                onClick={() => setActiveTab("Recent")}
              >
                <Clock3 className="h-4 w-4" />
                Recent
              </button>

              <button
                className={tabClass("Popular")}
                onClick={() => setActiveTab("Popular")}
              >
                <Flame className="h-4 w-4" />
                Popular
              </button>

              <button
                className={tabClass("Following")}
                onClick={() => setActiveTab("Following")}
              >
                <UserRoundPlus className="h-4 w-4" />
                Following
              </button>
            </div>

            <div className="mb-8 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                  {currentUserInitials}
                </div>

                <div className="flex-1">
                  <textarea
                    value={postText}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setPostText(e.target.value);
                      }
                    }}
                    placeholder="Share something with your community... Use @ to mention users and # for hashtags"
                    className="min-h-[120px] w-full resize-none rounded-[18px] border border-slate-200 px-4 py-4 text-[15px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#6a63ff] focus:ring-2 focus:ring-[#6a63ff]/15"
                  />

                  {selectedImage && (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-h-[320px] w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="mt-3 text-sm text-slate-400">
                    {postText.length}/500
                  </div>

                  <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleImageClick}
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#6a63ff]"
                      >
                        <ImagePlus className="h-6 w-6" />
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />

                      <button
                        type="button"
                        onClick={() => setAudience("Public")}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                          audience === "Public"
                            ? "bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Globe className="h-4 w-4" />
                        Public
                      </button>

                      <button
                        type="button"
                        onClick={() => setAudience("Community")}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                          audience === "Community"
                            ? "bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Users className="h-4 w-4" />
                        Community
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handlePost}
                      className="w-full rounded-[18px] bg-gradient-to-r from-[#8f87f8] to-[#a9a3f6] px-8 py-3.5 text-base font-semibold text-white transition hover:opacity-95 sm:w-auto"
                    >
                      {editingPostId ? "Update Post" : "Post"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 sm:h-14 sm:w-14 sm:text-lg">
                      {post.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {post.name}
                          </h3>
                          <span className="text-sm text-slate-400">
                            {post.time}
                          </span>

                          {post.audience === "Community" && (
                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
                              Community
                            </span>
                          )}

                          {post.saved && (
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
                              Saved
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId((prev) =>
                                prev === post.id ? null : post.id
                              )
                            }
                            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          {openMenuId === post.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                            >
                              {post.canManage ? (
                                <>
                                  <button
                                    onClick={() => handleEditPost(post)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                  >
                                    <Pencil className="h-4 w-4" />
                                    Edit Post
                                  </button>

                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-500 transition hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Post
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleToggleSave(post.id)}
                                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                                >
                                  <Bookmark className="h-4 w-4" />
                                  {post.saved ? "Unsave Post" : "Save Post"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-slate-700 sm:text-[16px]">
                        {post.content}
                      </p>

                      {post.image && (
                        <div className="mt-4 overflow-hidden rounded-2xl">
                          <img
                            src={post.image}
                            alt="Post"
                            className="max-h-[420px] w-full object-cover"
                          />
                        </div>
                      )}

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <div className="flex flex-wrap items-center gap-6">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`inline-flex items-center gap-2 text-sm font-medium transition ${
                              post.liked
                                ? "text-red-500"
                                : "text-slate-500 hover:text-[#6a63ff]"
                            }`}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                post.liked ? "fill-red-500 text-red-500" : ""
                              }`}
                            />
                            {post.likes}
                          </button>

                          <button
                            onClick={() => handleToggleComments(post.id)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#6a63ff]"
                          >
                            <MessageSquare className="h-4 w-4" />
                            {post.comments.length} Comments
                          </button>

                          <button
                            onClick={() => openShareModal(post)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#6a63ff]"
                          >
                            <Share2 className="h-4 w-4" />
                            Share ({post.shares})
                          </button>
                        </div>

                        {post.showComments && (
                          <div className="mt-5 space-y-4 rounded-2xl bg-slate-50 p-4">
                            <div className="space-y-3">
                              {post.comments.length > 0 ? (
                                post.comments.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="rounded-xl bg-white px-4 py-3"
                                  >
                                    <p className="text-sm font-semibold text-slate-800">
                                      {comment.user}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600">
                                      {comment.text}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-500">
                                  No comments yet.
                                </p>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={post.newComment}
                                onChange={(e) =>
                                  handleCommentInput(post.id, e.target.value)
                                }
                                placeholder="Write a comment..."
                                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6a63ff]"
                              />

                              <button
                                onClick={() => handleAddComment(post.id)}
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-4 py-3 text-white"
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {shareModal.open && shareModal.post && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Share Post</h3>
              <button
                onClick={closeShareModal}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                {shareModal.post.content}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                onClick={copyShareLink}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-4 text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                {copied ? (
                  <Check className="mb-2 h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="mb-2 h-5 w-5 text-indigo-600" />
                )}
                <span className="text-xs font-medium">
                  {copied ? "Copied" : "Copy Link"}
                </span>
              </button>

              <button
                onClick={shareToWhatsApp}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-4 text-slate-700 transition hover:border-green-200 hover:bg-green-50"
              >
                <span className="mb-2 text-lg font-bold text-green-600">W</span>
                <span className="text-xs font-medium">WhatsApp</span>
              </button>

              <button
                onClick={shareToFacebook}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-4 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <span className="mb-2 text-lg font-bold text-blue-600">f</span>
                <span className="text-xs font-medium">Facebook</span>
              </button>

              <button
                onClick={shareToTelegram}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-4 text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
              >
                <Link2 className="mb-2 h-5 w-5 text-sky-600" />
                <span className="text-xs font-medium">Telegram</span>
              </button>
            </div>

            <button
              onClick={shareToTwitter}
              className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#5b5cf0] to-[#6d5df6] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Share on X / Twitter
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CommunityPosts;