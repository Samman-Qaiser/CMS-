import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronDown } from "react-icons/bs";
import axios from "axios";

const baseUrl =
  import.meta.env?.VITE_BACKEND_URL ||
  "https://cms-backend-ashen.vercel.app";

const MenuTypes = ({ onAddToMenu }) => {
  const [openSection, setOpenSection] = useState("Page")
  const [activePageTab, setActivePageTab] = useState("All Pages")
  const [activeBlogTab, setActiveBlogTab] = useState("All Blogs")
  const [pageSearch, setPageSearch] = useState("")
  const [blogSearch, setBlogSearch] = useState("")
  const [selectedBlogIds, setSelectedBlogIds] = useState([])
  const [selectedPageIds, setSelectedPageIds] = useState([])
  const [customLink, setCustomLink] = useState({ url: "", label: "" })

  // ─── Backend se data ──────────────────────────────
  const [pages, setPages] = useState([])
  const [blogs, setBlogs] = useState([])

  // ─── GET Pages ────────────────────────────────────
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/pages`)
        setPages(data.pages)
      } catch (error) {
        console.error('Error fetching pages:', error)
      }
    }
    fetchPages()
  }, [])

  // ─── GET Blogs ────────────────────────────────────
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/blogs`)
        setBlogs(data.blogs)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }
    fetchBlogs()
  }, [])

  // ─── Filter ───────────────────────────────────────
  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(pageSearch.toLowerCase())
  )

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(blogSearch.toLowerCase())
  )

  // ─── Add to Menu ──────────────────────────────────
  const handleAddAction = (type) => {
    let itemsToAdd = []

    if (type === "Page") {
      itemsToAdd = pages
        .filter((p) => selectedPageIds.includes(p._id))
        .map((p) => ({
          label: p.title,
          type: "page",
          referenceId: p._id,
          url: `/pages/${p.slug}`,
        }))
      setSelectedPageIds([])
      setPageSearch("")
    } else if (type === "Blog") {
      itemsToAdd = blogs
        .filter((b) => selectedBlogIds.includes(b._id))
        .map((b) => ({
          label: b.title,
          type: "blog",
          referenceId: b._id,
          url: `/blogs/${b.slug}`,
        }))
      setSelectedBlogIds([])
      setBlogSearch("")
    } else if (type === "Custom") {
      if (!customLink.label) return
      itemsToAdd = [{
        label: customLink.label,
        type: "custom_link",
        url: customLink.url,
        referenceId: null,
      }]
      setCustomLink({ url: "", label: "" })
    }

    if (itemsToAdd.length > 0) {
      onAddToMenu(itemsToAdd)
    }
  }

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-primary p-4">
        <h3 className="text-white font-bold text-lg">Menu Types</h3>
      </div>
      <div className="p-4 space-y-4">

        {/* PAGE SECTION */}
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpenSection(openSection === "Page" ? null : "Page")}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#2e3458]"
          >
            <span className="font-bold text-gray-600 dark:text-gray-300">Page</span>
            <BsChevronDown className={openSection === "Page" ? "rotate-180" : ""} />
          </button>
          <AnimatePresence>
            {openSection === "Page" && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="px-4 pb-4 overflow-hidden"
              >
                <div className="flex border-b mb-4">
                  <button
                    onClick={() => setActivePageTab("All Pages")}
                    className={`px-4 py-2 text-xs font-bold ${activePageTab === "All Pages" ? "text-primary border-b-2 border-primary" : "text-gray-400"}`}
                  >
                    All Pages
                  </button>
                  <button
                    onClick={() => setActivePageTab("Search")}
                    className={`px-4 py-2 text-xs font-bold ${activePageTab === "Search" ? "text-primary border-b-2 border-primary" : "text-gray-400"}`}
                  >
                    Search
                  </button>
                </div>

                {activePageTab === "Search" && (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={pageSearch}
                      onChange={(e) => setPageSearch(e.target.value)}
                      placeholder="Search pages..."
                      className="w-full px-3 py-2 border text-xs border-gray-200 rounded-xl outline-none focus:border-primary transition-colors"
                    />
                  </div>
                )}

                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                  {(activePageTab === "Search" ? filteredPages : pages).map((page) => (
                    <label key={page._id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedPageIds.includes(page._id)}
                        onChange={() =>
                          setSelectedPageIds((prev) =>
                            prev.includes(page._id)
                              ? prev.filter((i) => i !== page._id)
                              : [...prev, page._id]
                          )
                        }
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-xs text-gray-500 group-hover:text-primary transition-colors">
                        {page.title}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-2 text-xs font-bold text-primary mb-4 cursor-pointer">
                  <span onClick={() => setSelectedPageIds(pages.map((p) => p._id))}>
                    Select All
                  </span>
                  <span className="text-gray-300">|</span>
                  <span onClick={() => setSelectedPageIds([])}>Deselect All</span>
                </div>

                <button
                  onClick={() => handleAddAction("Page")}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl"
                >
                  Add to Menu
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BLOG SECTION */}
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpenSection(openSection === "Blog" ? null : "Blog")}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#2e3458]"
          >
            <span className="font-bold text-gray-600 dark:text-gray-300">Blog</span>
            <BsChevronDown className={openSection === "Blog" ? "rotate-180" : ""} />
          </button>
          <AnimatePresence>
            {openSection === "Blog" && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="px-4 pb-4 overflow-hidden"
              >
                <div className="flex border-b mb-4">
                  <button
                    onClick={() => setActiveBlogTab("All Blogs")}
                    className={`px-4 py-2 text-xs font-bold ${activeBlogTab === "All Blogs" ? "text-primary border-b-2 border-primary" : "text-gray-400"}`}
                  >
                    All Blogs
                  </button>
                  <button
                    onClick={() => setActiveBlogTab("Search")}
                    className={`px-4 py-2 text-xs font-bold ${activeBlogTab === "Search" ? "text-primary border-b-2 border-primary" : "text-gray-400"}`}
                  >
                    Search
                  </button>
                </div>

                {activeBlogTab === "Search" && (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      placeholder="Search blogs..."
                      className="w-full px-3 py-2 border text-xs border-gray-200 rounded-xl outline-none focus:border-primary transition-colors"
                    />
                  </div>
                )}

                <div className="max-h-40 overflow-y-auto mb-4 space-y-2">
                  {(activeBlogTab === "Search" ? filteredBlogs : blogs).map((blog) => (
                    <label key={blog._id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBlogIds.includes(blog._id)}
                        onChange={() =>
                          setSelectedBlogIds((prev) =>
                            prev.includes(blog._id)
                              ? prev.filter((i) => i !== blog._id)
                              : [...prev, blog._id]
                          )
                        }
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-xs text-gray-500">{blog.title}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => handleAddAction("Blog")}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl"
                >
                  Add to Menu
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CUSTOM LINKS */}
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setOpenSection(openSection === "Custom" ? null : "Custom")}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#2e3458]"
          >
            <span className="font-bold text-gray-600 dark:text-gray-300">Custom Links</span>
            <BsChevronDown className={openSection === "Custom" ? "rotate-180" : ""} />
          </button>
          <AnimatePresence>
            {openSection === "Custom" && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="px-4 pb-4 space-y-4 overflow-hidden"
              >
                <input
                  placeholder="URL"
                  value={customLink.url}
                  onChange={(e) => setCustomLink({ ...customLink, url: e.target.value })}
                  className="w-full p-3 border rounded-xl outline-none focus:border-primary transition-colors"
                />
                <input
                  placeholder="Label"
                  value={customLink.label}
                  onChange={(e) => setCustomLink({ ...customLink, label: e.target.value })}
                  className="w-full p-3 border rounded-xl outline-none focus:border-primary transition-colors"
                />
                <button
                  onClick={() => handleAddAction("Custom")}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl"
                >
                  Add to Menu
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}

export default MenuTypes