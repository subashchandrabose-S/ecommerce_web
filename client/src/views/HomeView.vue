<script setup>
import { ref } from 'vue'

const categories = [
  {
    name: 'Indoor Plants',
    subCategory: 'Indoor',
    icon: '🪴',
    description: 'Perfect for your home and office spaces',
    color: '#4ade80'
  },
  {
    name: 'Outdoor Plants',
    subCategory: 'Outdoor',
    icon: '🌻',
    description: 'Beautiful plants for your garden',
    color: '#f472b6'
  },
  {
    name: 'Medicine Plants',
    subCategory: 'Medicine',
    icon: '💊',
    description: 'Natural healing and wellness',
    color: '#2dd4bf'
  }
]
</script>

<template>
  <div class="home">
    <section class="hero glass-panel">
      <div class="hero-content">
        <h1>Grow Your World with <span class="highlight">NurseryEco</span></h1>
        <p>Premium plants and chemical solutions for your garden.</p>
        <div class="cta-group">
          <a href="#categories" class="btn btn-primary">Explore Categories</a>
        </div>
      </div>
    </section>

    <!-- Plant Categories Section -->
    <section id="categories" class="categories-section">
      <h2 class="section-title">Explore Categories</h2>
      <p class="section-subtitle">Find the perfect plants for every space</p>
      
      <div class="category-grid">
        <RouterLink 
          v-for="cat in categories" 
          :key="cat.subCategory"
          :to="`/category/${cat.subCategory.toLowerCase()}`"
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
  text-align: center;
  padding: 4rem 2rem;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.highlight {
  color: var(--primary-color);
}

.hero p {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.cta-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

/* Categories Section */
.categories-section {
  margin-bottom: 4rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.section-subtitle {
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.category-card {
  padding: 2.5rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
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

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .category-card {
    padding: 1.5rem 1rem;
  }
  
  .category-icon {
    font-size: 3rem;
  }
  
  .category-card h3 {
    font-size: 1.15rem;
  }
  
  .category-card p {
    font-size: 0.85rem;
  }
  
  .cta-group {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .category-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .category-card h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  
  .category-card p {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }
}
</style>
