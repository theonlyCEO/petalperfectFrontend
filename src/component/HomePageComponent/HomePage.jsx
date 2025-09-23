import React, { useEffect, useState, useContext, useRef } from "react";
import "./HomePage.css";
import { ShopContext } from "../HomePageComponent/Context/ShopContext";
import { useNavigate } from "react-router-dom";
import FlowerModal from "../FlowerModalComponent/FlowerModal";
import { FaLeaf, FaShippingFast, FaLock, FaTruck, FaHeart, FaStar, FaCheckCircle, FaShoppingBasket } from "react-icons/fa";
import { GiFlowerEmblem } from "react-icons/gi";
import { IoMdGift } from "react-icons/io";
import { useIp } from "../../context/IpContext"; // 👈 import the IP hook

const testimonials = [
  { name: "Sophie M.", image: "https://randomuser.me/api/portraits/women/85.jpg", text: "Absolutely beautiful bouquet! Petal Perfect made my mom's birthday so special. Delivery was fast and flowers were super fresh." },
  { name: "Emily R.", image: "https://randomuser.me/api/portraits/women/44.jpg", text: "The arrangement was stunning and lasted for over a week. Loved the local, eco-friendly touch. Highly recommend!" },
  { name: "Heather C.", image: "https://randomuser.me/api/portraits/men/34.jpg", text: "Service was amazing and the flowers were a huge hit at our event. Will order again soon!" },
];

const renderStars = (rating = 4.8) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<FaStar key={i} style={{ color: i <= rating ? "#ffc107" : "#eee", fontSize: "1.06em" }} />);
  }
  return <span>{stars}</span>;
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [showThanksPopup, setShowThanksPopup] = useState(false);
  const navigate = useNavigate();
  const productsRef = useRef();
  const { addToCart, addToWishlist } = useContext(ShopContext);

  const { ip } = useIp(); // 👈 get the current IP from context

  useEffect(() => {
    if (!ip) return; // wait until IP is set
    const cachedProducts = localStorage.getItem("products");
    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const prodRes = await fetch(`http://${ip}:3000/products`); // 👈 use dynamic IP
        if (!prodRes.ok) throw new Error("Failed to fetch products");
        const prodData = await prodRes.json();
        setProducts(prodData);
        localStorage.setItem("products", JSON.stringify(prodData));
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ip]); // 👈 re-run whenever IP changes

  const handleSubscribe = (e) => {
    e.preventDefault();
    setShowThanksPopup(true);
    e.target.reset();
    setTimeout(() => setShowThanksPopup(false), 3000);
  };

  return (
    <div className="homepage">
      {/* Hero, Banner, Why Choose Us, SVG dividers ... */}
      {/* Hero */} <section className="hero"> <div className="hero-logo-wrap"> <GiFlowerEmblem className="brand-logo" /> <span className="brand-slogan">Petal Perfect</span> </div> <div className="hero-text"> <h1>Bouquets that<br /> make memories bloom</h1> <p>Delivering happiness, beauty & sustainable joy since </p> <button className="shop-btn" onClick={() => productsRef.current.scrollIntoView({ behavior: "smooth" })} > Discover Flowers </button> </div> <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" alt="Florist with bouquet" className="hero-img" /> </section> {/* Promo Banner */} <section className="banner-promo"> <span> <FaTruck style={{ verticalAlign: "middle", color: "#a10061", fontSize: "1.2em" }} /> &nbsp;Enjoy Free Delivery on Orders Over R300!&nbsp; <FaTruck style={{ verticalAlign: "middle", color: "#a10061", fontSize: "1.2em" }} /> </span> </section> {/* Why Choose Us */} <section className="why-choose-us"> <h2>Why Choose Petal Perfect?</h2> <div className="why-grid"> <div> <GiFlowerEmblem style={{ color: "#a10061", fontSize:"1.4em" }}/> Freshness Guaranteed </div> <div> <FaShippingFast style={{ color: "#a10061", fontSize:"1.4em" }}/> Same Day Delivery </div> <div> <FaLeaf style={{ color: "#a10061", fontSize:"1.4em" }}/> Locally Sourced </div> <div> <FaLock style={{ color: "#a10061", fontSize:"1.4em" }}/> Secure Checkout </div> </div> </section> {/* Section SVG Divider */} <svg className="petal-svg-divider" width="100%" height="60" viewBox="0 0 1440 60" preserveAspectRatio="none"> <path fill="#ffe2f7" fillOpacity="1" d="M0,32L40,42.7C80,53,160,75,240,69.3C320,64,400,32,480,21.3C560,11,640,21,720,32C800,43,880,53,960,58.7C1040,64,1120,64,1200,64C1280,64,1360,64,1400,64L1440,64L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path> </svg>
      
      <section className="products" ref={productsRef}>
        <h2>Featured Flowers</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="product-grid">
            {products.slice(0, 8).map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-wrap" onClick={() => setModalProduct(product)} style={{ cursor: "pointer" }} title="View Details">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="product-badges">
                  {product.inStock && <span className="badge badge-stock"><FaCheckCircle /> In Stock</span>}
                  {product.staffPick && <span className="badge badge-favorite">Staff Favorite</span>}
                </div>
                <h3>{product.title}</h3>
                <h5>{product.description}</h5>
                <div className="product-rating">{renderStars(product.rating)}</div>
                <p>R{Math.round(product.price + 222) + 0.99}</p>
                <div className="btn-group">
                  <button onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
                    <FaShoppingBasket style={{ marginRight: 4 }} /> Add to Cart
                  </button>
                  <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); addToWishlist(product); }}>
                    <FaHeart style={{ marginRight: 3, color: "#e91e63" }} /> Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {modalProduct && (
          <FlowerModal product={modalProduct} addToCart={addToCart} onClose={() => setModalProduct(null)} />
        )}
        <button onClick={() => navigate("/Category")} className="more-products-btn">
          View More Products
        </button>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter-signup">
        <h3><IoMdGift style={{ verticalAlign: "middle", color: "#a10061", fontSize: "1.33em" }} /> Bloom with us!</h3>
        <p>Subscribe for care tips, exclusive offers & flower inspirations.</p>
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      {/* Thanks Popup */}
      {showThanksPopup && (
        <div className="thanks-popup">
          <div className="thanks-content">
            <h3>Thank You!</h3>
            <p>Thanks for subscribing to Petal Perfect. You'll receive our latest updates soon!</p>
            <button onClick={() => setShowThanksPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What Our Happy Customers Say</h2>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div key={t.name} className="testimonial-item">
              <img src={t.image} alt={t.name} />
              <div>
                <p className="testimonial-text">"{t.text}"</p>
                <p className="testimonial-author">- {t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
