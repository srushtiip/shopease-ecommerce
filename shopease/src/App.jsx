
import { useMemo, useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "Classic Sneakers", category: "Fashion", price: 1499, emoji: "👟", color: "#f2e8dd", tag: "Bestseller",  image:"shoes.png" },
  { id: 2, name: "Wireless Headphones", category: "Electronics", price: 2499, emoji: "🎧", color: "#e6e8f7", tag: "Popular", image:"headphones.png" },
  { id: 3, name: "Backpack", category: "Accessories", price: 1199, emoji: "🎒", color: "#e5eee4", tag: "New", image:"bag.png" },
  { id: 4, name: "Smart Watch", category: "Accessories", price: 1899, emoji: "⌚", color: "#f3e4e6", tag: "", image:"watch.png" },
  { id: 5, name: "Cotton T-Shirt", category: "Fashion", price: 699, emoji: "👕", color: "#e7edf2", tag: "",  image:"tshirt.png" },
  { id: 6, name: "Smart Speaker", category: "Electronics", price: 3299, emoji: "🔊", color: "#f1eadc", tag: "Popular",  image:"speaker.png" },
  { id: 7, name: " Sunglasses", category: "Fashion", price: 899, emoji: "🕶️", color: "#e7e5f3", tag: "",  image:"sunglass.png" },
  { id: 8, name: " Water Bottle", category: "Accessories", price: 499, emoji: "🧴", color: "#dcecf0", tag: "New" ,  image:"bottle.png"},
];

const categories = ["All", "Fashion", "Electronics", "Accessories"];

function Header({ cartCount, onCartClick }) {
  return (
    <header className="header">
      <a className="logo" href="#home">shop<span>ease.</span></a>
      <nav>
        <a href="#home">Home</a>
        <a href="#products">Shop</a>
        <a href="#about">About</a>
      </nav>
      <button className="cart-button" onClick={onCartClick}>
        🛍️ Cart <span className="cart-count">{cartCount}</span>
      </button>
    </header>
  );
}

function ProductCard({ product, onAdd, isFavorite, onFavorite }) {
  return (
    <article className="product-card">
      <div className="product-image" style={{ backgroundColor: product.color }}>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          className={`favorite-button ${isFavorite ? "favorited" : ""}`}
          onClick={() => onFavorite(product.id)}
          aria-label="Toggle wishlist"
        >
          {isFavorite ? "♥" : "♡"}
        </button>
        {/* <span className="product-emoji" role="img" aria-label={product.name}>
          {product.emoji}
        </span> */}
         <img
  src={product.image}
  alt={product.name}
  className="product-image"
/>
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-bottom">
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
          <button className="add-button" onClick={() => onAdd(product)}>
            + Add
          </button>
         
        </div>
      </div>
    </article>
  );
}

function CartPanel({ cart, onClose, onQuantityChange }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="cart-panel" onClick={(event) => event.stopPropagation()}>
        <div className="cart-heading">
          <h2>Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <span>🛒</span>
            <h3>Your cart is empty</h3>
            <p>Add something you love from our collection.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-emoji" style={{ backgroundColor: item.color }}>
                    {item.emoji}
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>₹{item.price.toLocaleString("en-IN")}</p>
                    <div className="quantity-control">
                      <button onClick={() => onQuantityChange(item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onQuantityChange(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <div><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
              <button className="checkout-button" onClick={() => window.alert("Demo checkout! No payment has been made.")}>
                Proceed to Checkout →
              </button>
              <p className="demo-note">Demo checkout only. No real payment is processed.</p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      const matchesFavorite = !showFavoritesOnly || favorites.includes(product.id);
      return matchesSearch && matchesCategory && matchesFavorite;
    });
  }, [search, category, favorites, showFavoritesOnly]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  }

  return (
    <>
      <Header cartCount={cartCount} onCartClick={() => setShowCart(true)} />

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">A LITTLE SOMETHING FOR YOU</p>
            <h1>Good finds.<br /><span>Better prices.</span></h1>
            <p className="hero-description">
              Everyday essentials and little things that make life better.
              Find your next favourite right here.
            </p>
            <a href="#products" className="hero-button">Explore collection ↗</a>
            <p className="hero-note">Thoughtful picks. Simple shopping.</p>
          </div>
          <div className="hero-art" aria-label="Shopping collection">
            <div className="art-circle"></div>
            <span className="art-item art-one">👟</span>
            <span className="art-item art-two">🎧</span>
            <span className="art-item art-three">🎒</span>
            <span className="art-sparkle">✳</span>
            <span className="art-caption">YOUR EVERYDAY<br />FAVOURITES</span>
          </div>
        </section>

        <section className="shop-section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE GOOD STUFF</p>
              <h2>Find your favourites<span>.</span></h2>
              <p className="section-description">A few good things, picked just for you.</p>
            </div>
            <button
              className={`wishlist-filter ${showFavoritesOnly ? "active" : ""}`}
              onClick={() => setShowFavoritesOnly((value) => !value)}
            >
              ♥ {showFavoritesOnly ? "Show all" : `Wishlist (${favorites.length})`}
            </button>
          </div>

          <div className="shop-controls">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products"
              />
            </div>
            <div className="category-filters">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "category-button active" : "category-button"}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <p className="results-count">{filteredProducts.length} products to explore</p>

          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <span>🔎</span>
              <h3>No products found</h3>
              <p>Try another search or select a different category.</p>
              <button className="add-button" onClick={() => {
                setSearch("");
                setCategory("All");
                setShowFavoritesOnly(false);
              }}>Clear filters</button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  isFavorite={favorites.includes(product.id)}
                  onFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </section>

        <section className="about-strip" id="about">
          <span className="about-icon">✳</span>
          <div>
            <p className="eyebrow">A NOTE FROM US</p>
            <h2>Shopping should feel simple.</h2>
            <p>Good products, clear prices, and an easy way to find what you need.</p>
          </div>
          <a href="#products">Back to shopping ↑</a>
        </section>
      </main>

      <footer className="footer">
        <a className="logo" href="#home">shop<span>ease.</span></a>
        <p>Made with care for everyday shoppers.</p>
        <p>© {new Date().getFullYear()} ShopEase · Student demo project</p>
      </footer>

      {showCart && (
        <CartPanel
          cart={cart}
          onClose={() => setShowCart(false)}
          onQuantityChange={changeQuantity}
        />
      )}
    </>
  );
}

export default App;
