// Restaurant Website JavaScript
let cart = [];
let isLoading = true;
let currentCategory = 'all';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check Razorpay SDK
    if (!window.Razorpay) {
        console.error('Razorpay SDK not loaded. Ensure <script src="https://checkout.razorpay.com/v1/checkout.js"> is included and you are online.');
    }
    initializeWebsite();
    const typewriterContainer = document.querySelector('.typewriter-container');
    if (typewriterContainer) {
        new TypewriterEffect(typewriterContainer);
    }
});

// Initialize website functionality
function initializeWebsite() {
    handleLoadingScreen();
    initializeNavigation();
    initializeHeroAnimations();
    initializeMenuFunctionality();
    initializeCartFunctionality();
    initializeCheckoutModal();
    initializeScrollAnimations();
    initializeFooterLinks();
}

// Loading Screen
function handleLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
            triggerEntranceAnimations();
        }, 500);
    }, 2000);
}

// Entrance Animations
function triggerEntranceAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.heroimage');
    if (heroContent) heroContent.style.animation = 'fadeIn 1s ease-out forwards';
    if (heroImage) heroImage.style.animation = 'fadeIn 1s ease-out 0.3s forwards';
}

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('mobile-open');
        });
    }
}

// Hero Animations
function initializeHeroAnimations() {
    const exploreBtn = document.getElementById('explore-btn');
    const orderBtn = document.getElementById('order-btn');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (orderBtn) {
        orderBtn.addEventListener('click', openCart);
    }
}

// Menu Functionality
function initializeMenuFunctionality() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            menuItems.forEach(item => {
                item.style.display = (category === 'all' || item.dataset.category === category) ? 'block' : 'none';
            });
            currentCategory = category;
        });
    });
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const itemName = btn.dataset.item;
            const itemPrice = parseFloat(btn.dataset.price);
            if (isNaN(itemPrice)) {
                showToast(`Invalid price for ${itemName}`, 'error');
                return;
            }
            addToCart(itemName, itemPrice);
            showToast(`${itemName} added to cart!`, 'success');
        });
    });
}

// Cart Functionality
function initializeCartFunctionality() {
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cartIcon) cartIcon.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);
    
    document.addEventListener('click', (e) => {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('open')) {
            closeCart();
        }
    });
}

// Checkout Modal
function initializeCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutModal = document.getElementById('close-checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (closeCheckoutModal) closeCheckoutModal.addEventListener('click', closeCheckoutModal);
    if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckoutForm);
    
    document.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckoutModal();
    });
}

// Open Checkout Modal
function openCheckoutModal() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    document.getElementById('checkout-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close Checkout Modal
function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.classList.remove('open');
    document.body.style.overflow = 'auto';
    document.getElementById('checkout-form').reset();
}

// Razorpay Checkout
function openRazorpayCheckout(amount, name, phone, address) {
    if (!window.Razorpay) {
        showToast('Payment service unavailable. Please check your internet.', 'error');
        console.error('Razorpay SDK not loaded.');
        return;
    }

    const options = {
        key: 'rzp_test_EjQc1EWnjKqegB', // Test Key
        amount: Math.round(amount * 100), // Amount in paise
        currency: 'INR',
        name: 'Delicious Restaurant',
        description: 'Order Payment',
        prefill: {
            name: name,
            contact: phone.replace(/^\+91/, '') // Remove +91
        },
        notes: { address },
        theme: { color: '#ff6b35' },
        handler: (response) => {
            console.log('Payment Success:', response);
            showToast(`Payment successful! ID: ${response.razorpay_payment_id}`, 'success');
            createOrderConfirmationAnimation(name, phone, address, 'UPI', amount);
            cart = [];
            updateCartDisplay();
            updateCartCount();
            closeCheckoutModal();
            closeCart();
        },
        modal: {
            ondismiss: () => {
                showToast('Payment cancelled.', 'info');
                closeCheckoutModal();
            }
        }
    };

    try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
            console.error('Payment Failed:', response.error);
            showToast(`Payment failed: ${response.error.description || 'Unknown error'}`, 'error');
            closeCheckoutModal();
        });
        console.log('Opening Razorpay with:', options);
        rzp.open();
    } catch (err) {
        console.error('Razorpay Error:', err);
        showToast('Failed to start payment.', 'error');
    }
}

// Handle Checkout Form
async function handleCheckoutForm(e) {
    e.preventDefault();
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const paymentMethod = document.getElementById('payment-method').value;

    if (!name || !phone || !address || !paymentMethod) {
        showToast('Please fill all fields!', 'error');
        return;
    }

    if (!/^\+91[0-9]{10}$/.test(phone)) {
        showToast('Enter a valid +91 phone number!', 'error');
        return;
    }

    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (orderTotal <= 0) {
        showToast('Cart is invalid!', 'error');
        return;
    }

    console.log('Checkout:', { name, phone, address, paymentMethod, orderTotal });

    if (paymentMethod === 'cod') {
        showToast(`Order placed! Total: ₹${orderTotal.toFixed(2)} (COD)`, 'success');
        createOrderConfirmationAnimation(name, phone, address, 'Pay on Delivery', orderTotal);
        cart = [];
        updateCartDisplay();
        updateCartCount();
        closeCheckoutModal();
        closeCart();
    } else if (paymentMethod === 'upi') {
        openRazorpayCheckout(orderTotal, name, phone, address);
    }
}

// Add to Cart
function addToCart(itemName, itemPrice) {
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }
    updateCartDisplay();
    updateCartCount();
}

// Remove from Cart
function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartDisplay();
    updateCartCount();
}

// Update Quantity
function updateQuantity(itemName, change) {
    const item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(itemName);
        else {
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// Update Cart Display
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
                    <p>₹${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <div class="item-total">₹${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = total.toFixed(2);
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Open Cart
function openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close Cart
function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.body.style.overflow = 'auto';
}

// Order Confirmation Animation
function createOrderConfirmationAnimation(name, phone, address, paymentMethod, total) {
    const confirmation = document.createElement('div');
    confirmation.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            text-align: center;
            z-index: 10000;
            max-width: 400px;
            width: 90%;
        ">
            <h3 style="color: #ff6b35;">Order Confirmed!</h3>
            <p>Thank you, ${name}!</p>
            <p>Total: ₹${total.toFixed(2)}</p>
            <p>Payment: ${paymentMethod}</p>
            <p>Delivery to: ${address}</p>
            <p>Contact: ${phone}</p>
        </div>
    `;
    document.body.appendChild(confirmation);
    setTimeout(() => confirmation.remove(), 4000);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.feature-card, .menu-item, .stat').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(el);
    });
}

// Footer Links
function initializeFooterLinks() {
    document.querySelectorAll('.footer-link').forEach(link => {
        link.addEventListener('click', () => {
            const action = link.dataset.action;
            const actions = {
                'track-order': () => showToast('Tracking coming soon!', 'info'),
                'new-order': () => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' }),
                'contact': () => showToast('Contact: info@delicious.com', 'info'),
                'blog': () => showToast('Blog coming soon!', 'info'),
                'about': () => document.getElementById('about').scrollIntoView({ behavior: 'smooth' }),
                'privacy': () => showToast('Privacy policy coming soon!', 'info'),
                'terms': () => showToast('Terms coming soon!', 'info')
            };
            if (actions[action]) actions[action]();
        });
    });
}

// Show Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        info: '#3498db'
    };
    toast.style.background = colors[type];
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
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
        this.element = document.createElement('span');
        this.element.className = 'typewriter-text active';
        this.container.innerHTML = '';
        this.container.appendChild(this.element);
        this.type();
    }
    
    type() {
        const currentPhrase = this.texts[this.currentIndex];
        this.currentText = this.isDeleting
            ? currentPhrase.substring(0, this.charIndex - 1)
            : currentPhrase.substring(0, this.charIndex + 1);
        this.charIndex += this.isDeleting ? -1 : 1;
        
        this.element.textContent = this.currentText;
        
        if (!this.isDeleting && this.charIndex > currentPhrase.length) {
            this.isDeleting = true;
            setTimeout(() => this.type(), 2000);
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            setTimeout(() => this.type(), 500);
        } else {
            setTimeout(() => this.type(), this.isDeleting ? 50 : 100);
        }
    }
}

// CSS Animations
const styles = `
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.nav-links.mobile-open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
}

.typewriter-text {
    border-right: 2px solid #ff6b35;
    animation: blinkCursor 0.7s step-end infinite;
}

@keyframes blinkCursor {
    50% { border-color: transparent; }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

window.updateQuantity = updateQuantity;