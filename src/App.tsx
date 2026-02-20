import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Users, MessageSquare, User, Search, Bell, PlusSquare, LayoutGrid } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Pages (to be implemented in separate files or defined here for simplicity in this turn)
const Stories = () => {
  const stories = [
    { id: 1, name: "Your Story", avatar: "https://picsum.photos/seed/me/100", active: false },
    { id: 2, name: "John", avatar: "https://picsum.photos/seed/john/100", active: true },
    { id: 3, name: "Jane", avatar: "https://picsum.photos/seed/jane/100", active: true },
    { id: 4, name: "Mike", avatar: "https://picsum.photos/seed/mike/100", active: true },
    { id: 5, name: "Sarah", avatar: "https://picsum.photos/seed/sarah/100", active: true },
    { id: 6, name: "David", avatar: "https://picsum.photos/seed/david/100", active: true },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 mb-6">
      {stories.map(story => (
        <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
          <div className={cn(
            "w-16 h-16 rounded-full p-0.5 border-2",
            story.active ? "border-red-500" : "border-zinc-200"
          )}>
            <img src={story.avatar} alt={story.name} className="w-full h-full rounded-full object-cover border-2 border-white" />
          </div>
          <span className="text-[10px] font-medium text-zinc-600 truncate w-16 text-center">{story.name}</span>
        </div>
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'social' | 'professional'>('social');

  useEffect(() => {
    fetch(`/api/posts?type=${activeTab}`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, [activeTab]);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <Stories />
      
      <div className="flex gap-4 mb-6 border-b border-zinc-200">
        <button 
          onClick={() => setActiveTab('social')}
          className={cn("pb-2 px-4 font-medium transition-colors", activeTab === 'social' ? "border-b-2 border-black text-black" : "text-zinc-500")}
        >
          Social
        </button>
        <button 
          onClick={() => setActiveTab('professional')}
          className={cn("pb-2 px-4 font-medium transition-colors", activeTab === 'professional' ? "border-b-2 border-black text-black" : "text-zinc-500")}
        >
          Professional
        </button>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="p-4 flex items-center gap-3">
              <img src={post.avatar} alt={post.display_name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold text-sm">{post.display_name}</h3>
                <p className="text-xs text-zinc-500">@{post.username}</p>
              </div>
            </div>
            <div className="px-4 pb-3">
              <p className="text-sm leading-relaxed">{post.content}</p>
            </div>
            {post.image && (
              <img src={post.image} alt="Post content" className="w-full aspect-video object-cover" referrerPolicy="no-referrer" />
            )}
            <div className="p-4 border-t border-zinc-100 flex items-center gap-6">
              <button className="flex items-center gap-1.5 text-zinc-600 hover:text-red-500 transition-colors">
                <Bell size={18} />
                <span className="text-xs font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-zinc-600 hover:text-blue-500 transition-colors">
                <MessageSquare size={18} />
                <span className="text-xs font-medium">Reply</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Shop = ({ onAddToCart }: { onAddToCart: () => void }) => {
  const [products, setProducts] = useState<any[]>([]);
  const categories = ["All", "Electronics", "Fashion", "Home", "Beauty", "Books"];
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (activeCategory === "All") {
          setProducts(data);
        } else {
          setProducts(data.filter((p: any) => p.category === activeCategory));
        }
      });
  }, [activeCategory]);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Nexus Marketplace</h1>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                activeCategory === cat ? "bg-black text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="pl-10 pr-4 py-2 bg-zinc-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/5 w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {products.map(product => (
          <motion.div 
            key={product.id}
            whileHover={{ y: -4 }}
            className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
          >
            <div className="aspect-square overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Bell size={16} className="text-zinc-600" />
              </button>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider font-bold">{product.category}</div>
              <h3 className="font-semibold text-zinc-900 mb-1 text-sm line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs text-zinc-500 font-medium">{product.rating}</span>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-base font-bold">${product.price}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart();
                  }}
                  className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-zinc-800 transition-colors uppercase tracking-tight"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Chat = () => (
  <div className="h-[calc(100vh-80px)] flex items-center justify-center text-zinc-500">
    <div className="text-center">
      <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
      <h2 className="text-xl font-semibold text-zinc-900">Your Messages</h2>
      <p className="text-sm">Connect with friends and colleagues across Nexus.</p>
      <button className="mt-4 bg-black text-white px-6 py-2 rounded-full text-sm font-medium">Start a Conversation</button>
    </div>
  </div>
);

const Profile = () => (
  <div className="max-w-2xl mx-auto py-12 px-4 text-center">
    <div className="w-32 h-32 rounded-full bg-zinc-200 mx-auto mb-6 overflow-hidden border-4 border-white shadow-lg">
      <img src="https://picsum.photos/seed/me/200" alt="Profile" className="w-full h-full object-cover" />
    </div>
    <h1 className="text-3xl font-bold mb-2">Alex Nexus</h1>
    <p className="text-zinc-500 mb-6">Digital Nomad | Product Designer | Tech Explorer</p>
    <div className="flex justify-center gap-8 mb-12">
      <div>
        <div className="font-bold text-xl">1.2k</div>
        <div className="text-xs text-zinc-500 uppercase tracking-widest">Followers</div>
      </div>
      <div>
        <div className="font-bold text-xl">842</div>
        <div className="text-xs text-zinc-500 uppercase tracking-widest">Following</div>
      </div>
      <div>
        <div className="font-bold text-xl">45</div>
        <div className="text-xs text-zinc-500 uppercase tracking-widest">Orders</div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <button className="bg-black text-white py-3 rounded-xl font-medium">Edit Profile</button>
      <button className="bg-zinc-100 text-black py-3 rounded-xl font-medium">Settings</button>
    </div>
  </div>
);

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={cn(
      "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
      active ? "text-black scale-110" : "text-zinc-400 hover:text-zinc-600"
    )}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </Link>
);

const CreatePostModal = ({ isOpen, onClose, onPost }: { isOpen: boolean, onClose: () => void, onPost: (content: string, type: 'social' | 'professional') => void }) => {
  const [content, setContent] = useState("");
  const [type, setType] = useState<'social' | 'professional'>('social');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Create Post</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full">
              <PlusSquare className="rotate-45" size={24} />
            </button>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setType('social')}
              className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", type === 'social' ? "bg-black text-white" : "bg-zinc-100 text-zinc-500")}
            >
              Social
            </button>
            <button 
              onClick={() => setType('professional')}
              className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", type === 'professional' ? "bg-black text-white" : "bg-zinc-100 text-zinc-500")}
            >
              Professional
            </button>
          </div>

          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={type === 'social' ? "What's on your mind?" : "Share a professional update or job opportunity..."}
            className="w-full h-40 p-4 bg-zinc-50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
          />

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg"><LayoutGrid size={20} /></button>
              <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg"><Bell size={20} /></button>
            </div>
            <button 
              onClick={() => {
                onPost(content, type);
                setContent("");
                onClose();
              }}
              disabled={!content.trim()}
              className="bg-black text-white px-8 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
            >
              Post to Nexus
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreatePost = async (content: string, type: 'social' | 'professional') => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, content, type })
      });
      if (response.ok) {
        // Refresh the feed by triggering a re-render or using a global state/event
        window.location.reload(); // Simple way for now
      }
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-black selection:text-white">
        <CreatePostModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onPost={handleCreatePost}
        />
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <LayoutGrid className="text-white" size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter">NEXUS</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/shop" className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden">
              <img src="https://picsum.photos/seed/me/100" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-24 md:pb-0 md:pt-4">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/shop" element={<Shop onAddToCart={() => setCartCount(c => c + 1)} />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        {/* Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-6 py-3 flex justify-between items-center z-50 md:top-16 md:bottom-auto md:left-0 md:w-20 md:h-[calc(100vh-64px)] md:flex-col md:border-t-0 md:border-r md:px-0 md:py-8">
          <NavigationLinks onCreatePost={() => setIsCreateModalOpen(true)} />
        </nav>
      </div>
    </Router>
  );
}

function NavigationLinks({ onCreatePost }: { onCreatePost: () => void }) {
  const location = useLocation();
  return (
    <>
      <NavItem to="/" icon={Home} label="Home" active={location.pathname === "/"} />
      <NavItem to="/shop" icon={ShoppingBag} label="Shop" active={location.pathname === "/shop"} />
      <div className="md:my-auto">
        <button 
          onClick={onCreatePost}
          className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <PlusSquare size={24} />
        </button>
      </div>
      <NavItem to="/chat" icon={MessageSquare} label="Chat" active={location.pathname === "/chat"} />
      <NavItem to="/profile" icon={User} label="Profile" active={location.pathname === "/profile"} />
    </>
  );
}
