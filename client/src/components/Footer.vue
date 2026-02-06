<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-section">
        <h3 class="logo-text">NurseryEco</h3>
        <p>Premium plants and chemical solutions for your modern garden. Bringing nature closer to you.</p>
        <div class="social-links">
          <a href="#" class="social-icon">Instagram</a>
          <a href="#" class="social-icon">Facebook</a>
          <a href="#" class="social-icon">Twitter</a>
        </div>
      </div>

      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/products/nursery">Nursery</RouterLink></li>
          <li><RouterLink to="/products/chemical">Chemicals</RouterLink></li>
          <li><RouterLink to="/cart">Cart</RouterLink></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Help & Info</h4>
        <ul>
          <li><a href="#">Shipping Policy</a></li>
          <li><a href="#">Return & Refund</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Contact Us</h4>
        <p>Email: support@nurseryeco.com</p>
        <p>Phone: +1 234 567 890</p>
        <p>Address: 123 Green Garden, Eco City</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 NurseryEco. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--text-dark);
  color: white;
  padding: 4rem 0 1rem;
  margin-top: 5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h4 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.footer-section p {
  color: #94a3b8;
  font-size: 0.95rem;
  max-width: 300px;
}

.logo-text {
  font-size: 2rem;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.75rem;
}

.footer-section ul li a {
  color: #94a3b8;
  font-size: 0.95rem;
}

.footer-section ul li a:hover {
  color: var(--primary-color);
  padding-left: 5px;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-icon {
  font-size: 0.9rem;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
}

.social-icon:hover {
  background: var(--primary-color);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  color: #64748b;
  font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
