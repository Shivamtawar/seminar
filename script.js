// Enhanced Restaurant Website JavaScript
// Global variables
let cart = [];
let isLoading = true;
let currentCategory = 'all';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    handleLoadingScreen();
    initializeNavigation();
    initializeHeroAnimations();
    initializeMenuFunctionality();
    initializeCartFunctionality();
    initializeScrollAnimations();
    initializeParallaxEffects();
    initializeFooterLinks();
    initializeParticleSystem();
    handleResponsiveDesign();
}

// Loading Screen Handler
function handleLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
            
            // Trigger entrance animations
            triggerEntranceAnimations();
        }, 500);
    }, 2500);
}

// Entrance Animations
function triggerEntranceAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.heroimage');
    
    heroContent.style.animation = 'slideInLeft 1s ease-out forwards';
    heroImage.style.animation = 'slideInRight 1s ease-out 0.3s forwards';
    
    // Animate floating foods
    const floatingFoods = document.querySelectorAll('.floating-food');
    floatingFoods.forEach((food, index) => {
        setTimeout(() => {
            food.style.animation = `bounceIn 0.8s ease-out forwards, floatFood 3s ease-in-out ${index * 0.5}s infinite`;
        }, index * 200);
    });
}

// Navigation Functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(link);
            }
        });
    });
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-open');
}

// Hero Section Animations
function initializeHeroAnimations() {
    const exploreBtn = document.getElementById('explore-btn');
    const orderBtn = document.getElementById('order-btn');
    const floatingFoods = document.querySelectorAll('.floating-food');
    
    // Hero button interactions
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const menuSection = document.getElementById('menu');
            menuSection.scrollIntoView({ behavior: 'smooth' });
            addRippleEffect(exploreBtn);
        });
    }
    
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            openCart();
            addRippleEffect(orderBtn);
        });
    }
    
    // Interactive floating foods
    floatingFoods.forEach(food => {
        food.addEventListener('click', () => {
            createFoodBurst(food);
        });
        
        food.addEventListener('mouseenter', () => {
            food.style.transform = 'scale(1.3) rotate(15deg)';
        });
        
        food.addEventListener('mouseleave', () => {
            food.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Create food burst animation
function createFoodBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'food-particle';
        particle.textContent = '✨';
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            z-index: 1000;
            pointer-events: none;
            font-size: 1rem;
            color: var(--primary-color);
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 100;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

// Menu Functionality
function initializeMenuFunctionality() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    
    // Category filtering
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterMenuItems(category);
            updateActiveCategoryBtn(btn);
        });
    });
    
    // Add to cart functionality
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const itemName = btn.dataset.item;
            const itemPrice = parseFloat(btn.dataset.price);
            addToCart(itemName, itemPrice);
            
            // Add visual feedback
            createAddToCartAnimation(btn);
        });
    });
    
    // Menu item hover effects
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Filter menu items by category
function filterMenuItems(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease-out forwards';
        } else {
            item.style.display = 'none';
        }
    });
    
    currentCategory = category;
}

// Update active category button
function updateActiveCategoryBtn(activeBtn) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// Cart Functionality
function initializeCartFunctionality() {
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Open cart
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }
    
    // Close cart
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // Checkout functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
            if (cartSidebar.classList.contains('open')) {
                closeCart();
            }
        }
    });
}

// Add item to cart
function addToCart(itemName, itemPrice) {
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: itemPrice,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCartCount();
    showToast(`${itemName} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartDisplay();
    updateCartCount();
}

// Update item quantity
function updateQuantity(itemName, change) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemName);
        } else {
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = total.toFixed(2);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Animate cart count update
    if (totalItems > 0) {
        cartCount.style.animation = 'bounce 0.5s ease-out';
        setTimeout(() => {
            cartCount.style.animation = '';
        }, 500);
    }
}

// Open cart sidebar
function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close cart sidebar
function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.remove('open');
    document.body.style.overflow = 'auto';
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Simulate checkout process
    showToast('Processing your order...', 'info');
    
    setTimeout(() => {
        const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showToast(`Order confirmed! Total: $${orderTotal.toFixed(2)}`, 'success');
        
        // Clear cart
        cart = [];
        updateCartDisplay();
        updateCartCount();
        closeCart();
        
        // Show order confirmation animation
        createOrderConfirmationAnimation();
    }, 2000);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Special animations for different elements
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                } else if (entry.target.classList.contains('menu-item')) {
                    entry.target.style.animation = 'zoomIn 0.5s ease-out forwards';
                } else if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .menu-item, .stat, .about-text').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Animate counter numbers
function animateCounter(element) {
    const target = element.querySelector('h4');
    const targetNumber = parseInt(target.textContent);
    let current = 0;
    const increment = targetNumber / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        if (target.textContent.includes('⭐')) {
            target.textContent = Math.floor(current) + '⭐';
        } else if (target.textContent.includes('+')) {
            target.textContent = Math.floor(current) + '+';
        } else {
            target.textContent = Math.floor(current);
        }
    }, 20);
}

// Parallax Effects
function initializeParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-particles');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Footer Links Functionality
function initializeFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer-link');
    const socialIcons = document.querySelectorAll('.social-icon');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', () => {
            const action = link.dataset.action;
            handleFooterAction(action);
        });
    });
    
    socialIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            showToast('Thanks for following us!', 'success');
            icon.style.animation = 'pulse 0.5s ease-out';
            setTimeout(() => {
                icon.style.animation = '';
            }, 500);
        });
    });
}

// Handle footer link actions
function handleFooterAction(action) {
    const actions = {
        'track-order': () => showToast('Order tracking feature coming soon!', 'info'),
        'new-order': () => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' }),
        'contact': () => showToast('Contact: info@delicious.com | (555) 123-4567', 'info'),
        'blog': () => showToast('Blog section coming soon!', 'info'),
        'about': () => document.getElementById('about').scrollIntoView({ behavior: 'smooth' }),
        'privacy': () => showToast('Privacy policy page coming soon!', 'info'),
        'terms': () => showToast('Terms & conditions page coming soon!', 'info')
    };
    
    if (actions[action]) {
        actions[action]();
    }
}

// Particle System
function initializeParticleSystem() {
    createFloatingParticles();
}

function createFloatingParticles() {
    const particleContainer = document.querySelector('.hero-particles');
    if (!particleContainer) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.3;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${5 + Math.random() * 10}s infinite linear;
        `;
        particleContainer.appendChild(particle);
    }
}

// Utility Functions
function addRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        width: ${size}px;
        height: ${size}px;
        left: ${rect.width / 2 - size / 2}px;
        top: ${rect.height / 2 - size / 2}px;
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

function createAddToCartAnimation(button) {
    const cartIcon = document.getElementById('cart-icon');
    const buttonRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    const flyingItem = document.createElement('div');
    flyingItem.innerHTML = '🍽️';
    flyingItem.style.cssText = `
        position: fixed;
        left: ${buttonRect.left + buttonRect.width / 2}px;
        top: ${buttonRect.top + buttonRect.height / 2}px;
        font-size: 1.5rem;
        z-index: 1000;
        pointer-events: none;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    document.body.appendChild(flyingItem);
    
    setTimeout(() => {
        flyingItem.style.left = cartRect.left + cartRect.width / 2 + 'px';
        flyingItem.style.top = cartRect.top + cartRect.height / 2 + 'px';
        flyingItem.style.transform = 'scale(0)';
        flyingItem.style.opacity = '0';
    }, 50);
    
    setTimeout(() => flyingItem.remove(), 800);
}

function createOrderConfirmationAnimation() {
    const confirmation = document.createElement('div');
    confirmation.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            text-align: center;
            z-index: 10000;
            animation: bounceIn 0.8s ease-out;
        ">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">Order Confirmed!</h3>
            <p style="color: var(--text-light);">Thank you for your order. We'll prepare it with love!</p>
        </div>
    `;
    
    document.body.appendChild(confirmation);
    setTimeout(() => confirmation.remove(), 3000);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    // Set toast style based on type
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        info: '#3498db'
    };
    
    toast.style.background = colors[type] || colors.success;
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function handleResponsiveDesign() {
    let windowWidth = window.innerWidth;
    
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        
        // Handle responsive changes
        if (windowWidth > 768 && newWidth <= 768) {
            // Desktop to mobile
            closeCart();
        }
        
        windowWidth = newWidth;
    });
}

// Typewriter Effect
class TypewriterEffect {
    constructor(container) {
        this.container = container;
        this.texts = Array.from(container.querySelectorAll('.typewriter-text')).map(el => el.textContent);
        this.currentIndex = 0;
        this.currentText = '';
        this.charIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.erasingSpeed = 50;
        this.pauseDuration = 2000;
        this.element = document.createElement('span');
        this.element.className = 'typewriter-text active';
        this.container.innerHTML = '';
        this.container.appendChild(this.element);
        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentPhrase = this.texts[this.currentIndex];
        if (!this.isDeleting) {
            // Typing
            this.currentText = currentPhrase.substring(0, this.charIndex + 1);
            this.charIndex++;
            if (this.charIndex > currentPhrase.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.pauseDuration);
                return;
            }
        } else {
            // Erasing
            this.currentText = currentPhrase.substring(0, this.charIndex - 1);
            this.charIndex--;
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            }
        }

        this.element.textContent = this.currentText;

        const speed = this.isDeleting ? this.erasingSpeed : this.typingSpeed;
        setTimeout(() => this.type(), speed);
    }
}

// Initialize typewriter effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const typewriterContainer = document.querySelector('.typewriter-container');
    if (typewriterContainer) {
        new TypewriterEffect(typewriterContainer);
    }
});

// Additional CSS animations (to be added to existing CSS)
const additionalStyles = `
@keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
}

@keyframes bounceIn {
    0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.05); }
    70% { transform: translate(-50%, -50%) scale(0.9); }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

@keyframes zoomIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes slideInRight {
    0% { transform: translateX(50px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
}

@keyframes floatParticle {
    0% { transform: translateY(100vh) translateX(0); opacity: 0; }
    10% { opacity: 0.3; }
    90% { opacity: 0.3; }
    100% { transform: translateY(-100px) translateX(100px); opacity: 0; }
}

.nav-links.mobile-open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    box-shadow: var(--shadow);
    padding: 1rem;
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    0% { transform: translateY(-20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}

.typewriter-text {
    display: inline-block;
    border-right: 2px solid var(--primary-color);
    white-space: nowrap;
    overflow: hidden;
    animation: blinkCursor 0.7s step-end infinite;
}

@keyframes blinkCursor {
    0%, 100% { border-color: var(--primary-color); }
    50% { border-color: transparent; }
}
`;

// Add additional styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Export functions for global access
window.updateQuantity = updateQuantity;