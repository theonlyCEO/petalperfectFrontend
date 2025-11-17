import React, { useEffect, useState, useContext } from "react";
import "./Category.css";
import { ShopContext } from "../HomePageComponent/Context/ShopContext"; 
import { useNavigate, useLocation } from "react-router-dom"; // 🌟 IMPORT useLocation 🌟
import FlowerModal from "../FlowerModalComponent/FlowerModal";
import FlowerLoader from "../FlowerLoaderComponent/FlowerLoader";
import { GiFlowerEmblem, GiRose, GiHerbsBundle } from "react-icons/gi";
import { FaHeartBroken, FaHeart, FaStar, FaStarHalfAlt, FaRegStar, FaEye, FaFilter } from "react-icons/fa";
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi";

const ITEMS_PER_PAGE = 12;

const CategoryPage = () => {

    const [modalProduct, setModalProduct] = useState(null);
    const [products, setProducts] = useState([]); 
    const [filteredProducts, setFilteredProducts] = useState([]);
    // 🌟 INITIAL STATE WILL BE SET BY useEffect 🌟
    const [searchTerm, setSearchTerm] = useState(""); 
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [stockFilter, setStockFilter] = useState("All");
    const [sortOption, setSortOption] = useState("");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { 
        addToCart, 
        addToWishlist, 
        allProducts, 
        productsLoading 
    } = useContext(ShopContext);
    
    const navigate = useNavigate();
    // 🌟 USE useLocation HOOK 🌟
    const location = useLocation(); 

    const renderStars = (rating = 4.0) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="star filled" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="star filled" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
        }
        return stars;
    };

    // 🌟 NEW: INITIALIZE LOCAL STATE & CHECK URL FOR SEARCH TERM 🌟
    useEffect(() => {
        if (!productsLoading && allProducts.length > 0) {
            
            // 1. Get search term from URL query parameters
            const params = new URLSearchParams(location.search);
            const urlSearchTerm = params.get('search') || "";

            // 2. Set initial state based on global data and URL query
            if (products.length === 0) {
                setProducts(allProducts);
                setFilteredProducts(allProducts);
                setCategories(["All", "Flowers", "Valentine's", "Birthday", "Green Plants", "Wedding", "Funeral"]);
            }
            
            // 3. Set the search term from the URL. This will trigger the filtering effect.
            // Only update if the URL search term is different from the current state
            if (urlSearchTerm && urlSearchTerm !== searchTerm) {
                setSearchTerm(urlSearchTerm);
                setCurrentPage(1); // Reset page on new search
            } else if (urlSearchTerm === "" && searchTerm !== "") {
                // This handles cases where the user navigates back to /Category without a query
                // or if the navbar redirects without a term
                setSearchTerm("");
                setCurrentPage(1);
            }
        }
    }, [productsLoading, allProducts, location.search, products.length]); 
    // Dependency on location.search is CRITICAL to re-run when the URL changes

    // The filtering useEffect needs a small modification: 
    // Add a check to prevent running if products haven't been initialized yet.
    useEffect(() => {
        if (products.length === 0) return; // Skip filtering if products are not loaded yet

        let result = [...products];

        if (searchTerm) {
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "All") {
            result = result.filter((p) => p.category === selectedCategory);
        }

        if (stockFilter === "In Stock") {
            result = result.filter((p) => p.quantity > 0 || p.inStock);
        } else if (stockFilter === "Out of Stock") {
            result = result.filter((p) => p.quantity === 0 || !p.inStock);
        }

        result = result.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        if (sortOption === "lowToHigh") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === "highToLow") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === "rating") {
            result.sort((a, b) => (b.rating || 4.0) - (a.rating || 4.0));
        }

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [searchTerm, priceRange, selectedCategory, stockFilter, sortOption, products]);

    const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (pg) => {
        if (pg >= 1 && pg <= pageCount) setCurrentPage(pg);
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setPriceRange([0, 2000]);
        setSelectedCategory("All");
        setStockFilter("All");
        setSortOption("");
        setMobileFilterOpen(false);
        // 🌟 Remove 'search' query parameter from URL after clearing 🌟
        navigate(location.pathname, { replace: true }); 
    };

    // UPDATED LOADING CHECK 
    if (productsLoading || products.length === 0) return <FlowerLoader />;

    return (
        <div className="category-page">
            {/* ... (Breadcrumb and Title remain the same) ... */}
            
            {/* Results Info */}
            <div className="results-info">
                <span>Showing {paginatedProducts.length} of {filteredProducts.length} products</span>
                {(searchTerm || selectedCategory !== "All" || stockFilter !== "All" || priceRange[0] > 0 || priceRange[1] < 2000) && (
                    <button className="clear-filters-btn" onClick={clearAllFilters}>
                        <FaFilter /> Clear All Filters
                    </button>
                )}
            </div>

            <div className="category-container">
                {/* ... (Sidebar Toggle and Sidebar content remain the same) ... */}
                <button
                    className="mobile-filter-toggle"
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                >
                    {mobileFilterOpen ? (
                        <>
                            <FiX /> Close Filters
                        </>
                    ) : (
                        <>
                            <FiMenu /> Show Filters
                        </>
                    )}
                </button>

                <div className={`sidebar ${mobileFilterOpen ? "open" : ""}`}>
                    <h3>Categories</h3>
                    <ul className="category-list">
                        {categories.map((cat, i) => (
                            <li
                                key={i}
                                className={selectedCategory === cat ? "active" : ""}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setMobileFilterOpen(false);
                                }}
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>

                    <div className="filter-section">
                        <h3>Availability</h3>
                        <ul className="stock-list">
                            {["All", "In Stock", "Out of Stock"].map((stock, i) => (
                                <li
                                    key={i}
                                    className={stockFilter === stock ? "active" : ""}
                                    onClick={() => {
                                        setStockFilter(stock);
                                        setMobileFilterOpen(false);
                                    }}
                                >
                                    {stock}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="price-filter">
                        <h3>Price Range</h3>
                        <div className="slider-row">
                            <label>
                                Min:
                                <input
                                    type="number"
                                    min="0"
                                    max={priceRange[1]}
                                    value={priceRange[0]}
                                    onChange={(e) => {
                                        const val = Math.min(Number(e.target.value), priceRange[1] - 1);
                                        setPriceRange([val, priceRange[1]]);
                                    }}
                                    className="price-value"
                                />
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                value={priceRange[0]}
                                onChange={(e) => {
                                    const val = Math.min(Number(e.target.value), priceRange[1] - 1);
                                    setPriceRange([val, priceRange[1]]);
                                }}
                                className="price-range-slider"
                            />
                        </div>
                        <div className="slider-row">
                            <label>
                                Max:
                                <input
                                    type="number"
                                    min={priceRange[0] + 1}
                                    max="2000"
                                    value={priceRange[1]}
                                    onChange={(e) => {
                                        const val = Math.max(Number(e.target.value), priceRange[0] + 1);
                                        setPriceRange([priceRange[0], val]);
                                    }}
                                    className="price-value"
                                />
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                value={priceRange[1]}
                                onChange={(e) => {
                                    const val = Math.max(Number(e.target.value), priceRange[0] + 1);
                                    setPriceRange([priceRange[0], val]);
                                }}
                                className="price-range-slider"
                            />
                        </div>
                        <button
                            className="price-reset-btn"
                            onClick={() => setPriceRange([0, 2000])}
                        >
                            Reset Price
                        </button>
                    </div>

                    <div className="extra-section">
                        <h3>Special Offers</h3>
                        <ul>
                            <li><GiRose className="icon" /> Valentine's Roses</li>
                            <li><GiHerbsBundle className="icon" /> Green Plants</li>
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Search flowers..."
                            value={searchTerm}
                            // The onChange handler here is for internal CategoryPage search only
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">Sort By</option>
                            <option value="lowToHigh">Price: Low → High</option>
                            <option value="highToLow">Price: High → Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>

                    {/* ... (rest of the product grid and modal remain the same) ... */}
                    <div className="category-grid">
                        {paginatedProducts.length === 0 ? (
                            <div className="no-products">
                                <p>
                                    No products found <FaHeartBroken className="icon" />
                                </p>
                                <button onClick={clearAllFilters} className="reset-filters-btn">
                                    Clear Filters & Show All
                                </button>
                            </div>
                        ) : (
                            paginatedProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="category-card"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <div className="product-image-container">
                                        <img src={product.image} alt={product.title} />
                                        <div className="product-badges">
                                            {(product.quantity === 0 || !product.inStock) ? (
                                                <span className="badge out-of-stock">Out of Stock</span>
                                            ) : (product.quantity <= 5) ? (
                                                <span className="badge low-stock">Low Stock</span>
                                            ) : null}
                                        </div>

                                        <button 
                                            className="quick-view-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setModalProduct(product);
                                            }}
                                        >
                                            <FaEye /> Quick View
                                        </button>
                                    </div>
                                    
                                    <div className="product-info">
                                        <h3>{product.title}</h3>
                                        <div className="rating-section">
                                            <div className="stars">{renderStars(product.rating || 4.2)}</div>
                                            <span className="review-count">({Math.floor(Math.random() * 50) + 5} reviews)</span>
                                        </div>
                                        <div className="price-section">
                                            <span className="regular-price">R{product.price.toFixed(2)}</span>
                                        </div>
                                        <div className="btn-group">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product);
                                                }}
                                                disabled={product.quantity === 0 || !product.inStock}
                                                className="add-cart-btn"
                                            >
                                                {(product.quantity === 0 || !product.inStock) ? "Out of Stock" : "Add to Cart"}
                                            </button>
                                            <button
                                                className="wishlist-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToWishlist(product);
                                                }}
                                            >
                                                <FaHeart /> Wishlist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {modalProduct && (
                        <FlowerModal
                            product={modalProduct}
                            addToCart={addToCart}
                            onClose={() => setModalProduct(null)}
                        />
                    )}

                    {pageCount > 1 && (
                        <div className="pagination">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Prev
                            </button>
                            {[...Array(pageCount)].map((_, idx) => (
                                <button
                                    key={idx + 1}
                                    className={currentPage === idx + 1 ? "active" : ""}
                                    onClick={() => handlePageChange(idx + 1)}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === pageCount}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;