<script setup>
import { ref } from 'vue'

const categories = [
  {
    name: 'Indoor Plants',
    path: '/category/indoor',
    icon: '🪴',
    description: 'Perfect for your home and office spaces',
    color: '#4ade80'
  },
  {
    name: 'Outdoor Plants',
    path: '/category/outdoor',
    icon: '🌻',
    description: 'Beautiful plants for your garden',
    color: '#f472b6'
  },
  {
    name: 'Medicine Plants',
    path: '/category/medicine',
    icon: '💊',
    description: 'Natural healing and wellness',
    color: '#2dd4bf'
  },
  {
    name: 'Herbal Plants',
    path: '/category/herbal',
    icon: '🌱',
    description: 'Aromatic and culinary herbs',
    color: '#fbbf24'
  },
  {
    name: 'Chemicals',
    path: '/products/chemical',
    icon: '🧪',
    description: 'Pesticides and Fertilizers',
    color: '#6366f1'
  }
]

</script>

<template>
  <div class="home">
    <section class="hero animate-fade">
      <div class="container hero-container">
        <div class="hero-content">
          <span class="badge-new">New Season 2025</span>
          <h1>Grow Your World with <span class="highlight">NurseryEco</span></h1>
          <p>Expertly curated premium plants and garden solutions delivered to your doorstep. Transform your space today.</p>
          <div class="cta-group">
            <a href="#categories" class="btn btn-primary">Shop Now</a>
            <RouterLink to="/products/nursery" class="btn btn-secondary">Learn More</RouterLink>
          </div>
        </div>
        <div class="hero-image">
          <div class="floating-plant">🪴</div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-grid container">
      <div class="feature-item glass-panel">
        <div class="feature-icon">🚚</div>
        <h3>Free Shipping</h3>
        <p>On orders over ₹999</p>
      </div>
      <div class="feature-item glass-panel">
        <div class="feature-icon">🌿</div>
        <h3>Premium Quality</h3>
        <p>Hand-picked healthy plants</p>
      </div>
      <div class="feature-item glass-panel">
        <div class="feature-icon">🛡️</div>
        <h3>15-Day Guarantee</h3>
        <p>Growth assurance</p>
      </div>
      <div class="feature-item glass-panel">
        <div class="feature-icon">💬</div>
        <h3>Expert Support</h3>
        <p>24/7 Garden assistance</p>
      </div>
    </section>


    <!-- Plant Categories Section -->
    <section id="categories" class="categories-section container">
      <h2 class="section-title">Explore Categories</h2>
      <p class="section-subtitle">Find the perfect plants for every space</p>
      
      <div class="category-grid">
        <RouterLink 
          v-for="cat in categories" 
          :key="cat.name"
          :to="cat.path"
          class="category-card glass-panel"
        >
          <div class="category-icon">{{ cat.icon }}</div>
          <h3>{{ cat.name }}</h3>
          <p>{{ cat.description }}</p>
          <div class="category-arrow">→</div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  width: 100%;
  background: radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent);
  margin-bottom: 4rem;
  padding: 4rem 0;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 2rem;
  text-align: left;
}

.badge-new {
  background: rgba(34, 197, 94, 0.1);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: inline-block;
}

.hero h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin-bottom: 1.5rem;
  line-height: 1;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.floating-plant {
  font-size: 10rem;
  filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1));
  animation: float 6s ease-in-out infinite;
}

.highlight {
  color: var(--primary-color);
  background: rgba(34, 197, 94, 0.08);
  padding: 0 0.2em;
  border-radius: 4px;
}

.hero p {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  max-width: 500px;
}

.cta-group {
  display: flex;
  gap: 1.5rem;
}

/* Features Section */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 6rem;
}

.feature-item {
  padding: 2.5rem 1.5rem;
  text-align: center;
  transition: var(--transition);
}

.feature-item:hover {
  transform: translateY(-8px);
  border-color: var(--primary-color);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Sections */
.section-title {
  text-align: center;
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.section-subtitle {
  text-align: center;
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 3.5rem;
}

/* Grids */
.products-grid, .category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 5rem;
}

.category-card {
  padding: 3rem 2rem;
  text-align: center;
  transition: var(--transition);
}

.category-card:hover {
  transform: translateY(-10px);
}

.category-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

/* Categories Section */
.categories-section {
  margin-bottom: 4rem;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.category-card:hover::before {
  transform: scaleX(1);
}

.category-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.category-card p {
  color: #64748b;
  margin-bottom: 1rem;
}

.category-arrow {
  font-size: 1.5rem;
  color: var(--primary-color);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.category-card:hover .category-arrow {
  opacity: 1;
  transform: translateX(0);
}


/* Responsive Table */
@media (max-width: 1024px) {
  .hero-container {
    padding: 0 2rem;
  }
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2rem 1.5rem;
  }
  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero p {
    margin-left: auto;
    margin-right: auto;
  }
  .cta-group {
    justify-content: center;
  }
  .hero-image {
    order: -1;
    margin-bottom: 2rem;
  }
  .floating-plant {
    font-size: 8rem;
  }
  .features-grid {
    gap: 1rem;
  }
  .products-grid, .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 580px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  .cta-group {
    flex-direction: column;
    width: 100%;
  }
  .cta-group .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .products-grid, .category-grid {
    grid-template-columns: 1fr;
  }
  .hero h1 {
    font-size: 2.25rem;
  }
}
</style>
