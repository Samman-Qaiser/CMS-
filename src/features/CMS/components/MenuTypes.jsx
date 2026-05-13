import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronDown } from "react-icons/bs";
import { allBlogs } from "./blogsData";

const MenuTypes = ({ onAddToMenu }) => {
  const [openSection, setOpenSection] = useState("Page");
  // Separate tab states for each section
  const [activePageTab, setActivePageTab] = useState("All Pages");
  const [activeBlogTab, setActiveBlogTab] = useState("All Blogs");

  // Search states
  const [pageSearch, setPageSearch] = useState("");
  const [blogSearch, setBlogSearch] = useState("");

  const [selectedBlogIds, setSelectedBlogIds] = useState([]);
  const [selectedPageIds, setSelectedPageIds] = useState([]);
  const [customLink, setCustomLink] = useState({ url: "", label: "" });

  const pages = [
    { id: "p1", title: "About" },
    { id: "p2", title: "Secret" },
    { id: "p3", title: "Home" },
    { id: "p4", title: "Test" },
  ];

  // Filtering logic
  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(pageSearch.toLowerCase()),
  );

  const filteredBlogs = allBlogs.filter((b) =>
    b.title.toLowerCase().includes(blogSearch.toLowerCase()),
  );

  const handleAddAction = (type) => {
    let itemsToAdd = [];

    if (type === "Page") {
      itemsToAdd = pages
        .filter((p) => selectedPageIds.includes(p.id))
        .map((p) => ({ label: p.title, type: "Page" }));
      setSelectedPageIds([]);
      setPageSearch(""); 
    } else if (type === "Blog") {
      itemsToAdd = allBlogs
        .filter((b) => selectedBlogIds.includes(b.id))
        .map((b) => ({ label: b.title, type: "Blog" }));
      setSelectedBlogIds([]);
      setBlogSearch(""); 
    } else if (type === "Custom") {
      if (!customLink.label) return;
      itemsToAdd = [{ label: customLink.label, type: "Link" }];
      setCustomLink({ url: "", label: "" });
    }

    if (itemsToAdd.length > 0) {
      onAddToMenu(itemsToAdd);
    }
  };

  return (
    <div className="bg-white dark:bg-[#292d4a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-primary p-4">
        <h3 className="text-white font-bold text-lg">Menu Types</h3>
      </div>
      <div className="p-4 space-y-4">
        {/* PAGE SECTION */}
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() =>
              setOpenSection(openSection === "Page" ? null : "Page")
            }
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#2e3458]"
          >
            <span className="font-bold text-gray-600 dark:text-gray-300">
              Page
            </span>
            <BsChevronDown
              className={openSection === "Page" ? "rotate-180" : ""}
            />
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

                {/* Search Input for Page  */}
                {activePageTab === "Search" && (
                  <div className="mb-4">
                    <label className="text-xs text-gray-400 block mb-1">
                      Search
                    </label>
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
                  {(activePageTab === "Search" ? filteredPages : pages).map(
                    (page) => (
                      <label
                        key={page.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPageIds.includes(page.id)}
                          onChange={() =>
                            setSelectedPageIds((prev) =>
                              prev.includes(page.id)
                                ? prev.filter((i) => i !== page.id)
                                : [...prev, page.id],
                            )
                          }
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-xs text-gray-500 group-hover:text-primary transition-colors">
                          {page.title}
                        </span>
                      </label>
                    ),
                  )}
                </div>

                <div className="flex gap-2 text-xs font-bold text-primary mb-4 cursor-pointer">
                  <span
                    onClick={() => setSelectedPageIds(pages.map((p) => p.id))}
                  >
                    Select All
                  </span>
                  <span className="text-gray-300">|</span>
                  <span onClick={() => setSelectedPageIds([])}>
                    Deselect All
                  </span>
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
            onClick={() =>
              setOpenSection(openSection === "Blog" ? null : "Blog")
            }
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#2e3458]"
          >
            <span className="font-bold text-gray-600 dark:text-gray-300">
              Blog
            </span>
            <BsChevronDown
              className={openSection === "Blog" ? "rotate-180" : ""}
            />
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

                {/* Search Input for Blog */}
                {activeBlogTab === "Search" && (
                  <div className="mb-4">
                    <label className="text-xs text-gray-400 block mb-1">
                      Search
                    </label>
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
                  {(activeBlogTab === "Search" ? filteredBlogs : allBlogs).map(
                    (blog) => (
                      <label
                        key={blog.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBlogIds.includes(blog.id)}
                          onChange={() =>
                            setSelectedBlogIds((prev) =>
                              prev.includes(blog.id)
                                ? prev.filter((i) => i !== blog.id)
                                : [...prev, blog.id],
                            )
                          }
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-xs text-gray-500">
                          {blog.title}
                        </span>
                      </label>
                    ),
                  )}
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

        {/* CUSTOM LINKS SECTION */}
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() =>
              setOpenSection(openSection === "Custom" ? null : "Custom")
            }
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#2e3458]"
          >
            <span className="font-bold text-gray-600 dark:text-gray-300">
              Custom Links
            </span>
            <BsChevronDown
              className={openSection === "Custom" ? "rotate-180" : ""}
            />
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
                  onChange={(e) =>
                    setCustomLink({ ...customLink, url: e.target.value })
                  }
                  className="w-full p-3 border rounded-xl outline-none focus:border-primary transition-colors"
                />
                <input
                  placeholder="Label"
                  value={customLink.label}
                  onChange={(e) =>
                    setCustomLink({ ...customLink, label: e.target.value })
                  }
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
  );
};

export default MenuTypes;
