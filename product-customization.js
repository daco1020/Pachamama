// Product Customization JavaScript

class ProductCustomizer {
    constructor() {
        this.selectedSoaps = [];
        this.maxSoaps = 8;
        this.minSoaps = 3;
        this.basePrice = 135;
        this.currentQuantity = 3;
        this.currentShape = 'rectangular';
        this.currentEngraving = 'none';
        this.currentPackage = 'standard';
        this.engravingText = '';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.setupTabs();
        this.initializeCustomPack();
    }

    setupEventListeners() {
        // Quantity selector
        const qtyButtons = document.querySelectorAll('.qty-btn');
        qtyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuantityChange(e));
        });

        // Soap selection
        const soapOptions = document.querySelectorAll('.soap-option');
        soapOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleSoapSelection(e));
        });

        // Category tabs
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.handleCategoryFilter(e));
        });

        // Shape selection
        const shapeOptions = document.querySelectorAll('.shape-option');
        shapeOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleShapeSelection(e));
        });

        // Engraving selection
        const engravingOptions = document.querySelectorAll('.engraving-option');
        engravingOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleEngravingSelection(e));
        });

        // Package selection
        const packageOptions = document.querySelectorAll('.package-option');
        packageOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handlePackageSelection(e));
        });

        // Engraving text inputs
        const engravingInputs = document.querySelectorAll('.engraving-text');
        engravingInputs.forEach(input => {
            input.addEventListener('input', (e) => this.handleEngravingText(e));
        });

        // Add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.handleAddToCart());
        }

        // Wishlist button
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => this.handleWishlist());
        }
    }

    handleQuantityChange(e) {
        const action = e.target.dataset.action;
        const quantityInput = document.getElementById('quantity');
        let newQuantity = parseInt(quantityInput.value);

        if (action === 'increase' && newQuantity < 12) {
            newQuantity++;
        } else if (action === 'decrease' && newQuantity > this.minSoaps) {
            newQuantity--;
        }

        quantityInput.value = newQuantity;
        this.currentQuantity = newQuantity;
        this.maxSoaps = newQuantity;
        
        // Adjust selected soaps if necessary
        if (this.selectedSoaps.length > newQuantity) {
            this.selectedSoaps = this.selectedSoaps.slice(0, newQuantity);
        }

        this.updateDisplay();
        this.updateSoapSlots();
    }

    handleSoapSelection(e) {
        const soapOption = e.currentTarget;
        const soapId = soapOption.dataset.soap;
        const soapPrice = parseFloat(soapOption.dataset.price);
        const soapName = soapOption.querySelector('h4').textContent;

        if (soapOption.classList.contains('selected')) {
            // Deselect soap
            this.selectedSoaps = this.selectedSoaps.filter(soap => soap.id !== soapId);
            soapOption.classList.remove('selected');
        } else {
            // Select soap
            if (this.selectedSoaps.length < this.maxSoaps) {
                this.selectedSoaps.push({
                    id: soapId,
                    name: soapName,
                    price: soapPrice
                });
                soapOption.classList.add('selected');
            } else {
                this.showNotification('Has alcanzado el máximo de jabones para este pack', 'warning');
                return;
            }
        }

        this.updateDisplay();
        this.updateSoapSlots();
        this.updateSelectionSummary();
    }

    handleCategoryFilter(e) {
        const category = e.target.dataset.category;
        const tabs = document.querySelectorAll('.category-tab');
        const soapOptions = document.querySelectorAll('.soap-option');

        // Update active tab
        tabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');

        // Filter soap options
        soapOptions.forEach(option => {
            if (category === 'all' || option.dataset.category === category) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    }

    handleShapeSelection(e) {
        const shapeOption = e.currentTarget;
        const shape = shapeOption.dataset.shape;
        
        // Update selection
        document.querySelectorAll('.shape-option').forEach(opt => opt.classList.remove('selected'));
        shapeOption.classList.add('selected');
        
        const radioInput = shapeOption.querySelector('input[type="radio"]');
        if (radioInput) {
            radioInput.checked = true;
        }
        
        this.currentShape = shape;
        this.updateDisplay();
    }

    handleEngravingSelection(e) {
        const engravingOption = e.currentTarget;
        const engraving = engravingOption.dataset.engraving;
        
        // Update selection
        document.querySelectorAll('.engraving-option').forEach(opt => opt.classList.remove('selected'));
        engravingOption.classList.add('selected');
        
        const radioInput = engravingOption.querySelector('input[type="radio"]');
        if (radioInput) {
            radioInput.checked = true;
        }
        
        this.currentEngraving = engraving;
        
        // Enable/disable text input
        const textInput = engravingOption.querySelector('.engraving-text');
        if (textInput) {
            textInput.disabled = false;
            textInput.focus();
        }
        
        // Disable other text inputs
        document.querySelectorAll('.engraving-text').forEach(input => {
            if (input !== textInput) {
                input.disabled = true;
                input.value = '';
            }
        });
        
        this.updateDisplay();
    }

    handleEngravingText(e) {
        this.engravingText = e.target.value;
        this.updateDisplay();
    }

    handlePackageSelection(e) {
        const packageOption = e.currentTarget;
        const packageType = packageOption.dataset.package;
        
        // Update selection
        document.querySelectorAll('.package-option').forEach(opt => opt.classList.remove('selected'));
        packageOption.classList.add('selected');
        
        const radioInput = packageOption.querySelector('input[type="radio"]');
        if (radioInput) {
            radioInput.checked = true;
        }
        
        this.currentPackage = packageType;
        this.updateDisplay();
    }

    updateDisplay() {
        this.updatePrice();
        this.updateAddToCartButton();
    }

    updatePrice() {
        let totalPrice = 0;
        
        // Base price calculation
        if (this.currentQuantity <= 3) {
            totalPrice = 45; // Pack Básico
        } else if (this.currentQuantity <= 6) {
            totalPrice = 80; // Pack Premium
        } else {
            totalPrice = 135 + (this.currentQuantity - 9) * 15; // Pack Personalizado base + extra soaps
        }
        
        // Add soap prices
        this.selectedSoaps.forEach(soap => {
            if (soap.price > 8) { // Premium soaps cost extra
                totalPrice += (soap.price - 8);
            }
        });
        
        // Add shape cost
        const shapePrice = parseFloat(document.querySelector('.shape-option.selected')?.dataset.price || 0);
        totalPrice += shapePrice * this.currentQuantity;
        
        // Add engraving cost
        const engravingPrice = parseFloat(document.querySelector('.engraving-option.selected')?.dataset.price || 0);
        totalPrice += engravingPrice;
        
        // Add package cost
        const packagePrice = parseFloat(document.querySelector('.package-option.selected')?.dataset.price || 0);
        totalPrice += packagePrice;
        
        // Update price displays
        const currentPriceElements = document.querySelectorAll('#currentPrice, #finalPrice');
        currentPriceElements.forEach(element => {
            if (element) {
                element.textContent = `$${totalPrice}`;
            }
        });
    }

    updateAddToCartButton() {
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        const selectionNote = document.querySelector('.selection-note');
        
        if (!addToCartBtn) return;
        
        const isValidSelection = this.selectedSoaps.length >= this.minSoaps && 
                                this.selectedSoaps.length <= this.maxSoaps;
        
        if (isValidSelection) {
            addToCartBtn.disabled = false;
            addToCartBtn.classList.remove('disabled');
            if (selectionNote) {
                selectionNote.style.display = 'none';
            }
        } else {
            addToCartBtn.disabled = true;
            addToCartBtn.classList.add('disabled');
            if (selectionNote) {
                selectionNote.style.display = 'block';
                selectionNote.textContent = `Selecciona entre ${this.minSoaps} y ${this.maxSoaps} jabones para continuar`;
            }
        }
    }

    updateSoapSlots() {
        const soapSlots = document.querySelectorAll('.soap-slot');
        
        soapSlots.forEach((slot, index) => {
            if (index < this.selectedSoaps.length) {
                const soap = this.selectedSoaps[index];
                slot.classList.add('filled');
                slot.innerHTML = `
                    <div class="slot-placeholder">✓</div>
                    <span>${soap.name}</span>
                `;
            } else if (index < this.maxSoaps) {
                slot.classList.remove('filled');
                slot.innerHTML = `
                    <div class="slot-placeholder">+</div>
                    <span>Elige tu jabón</span>
                `;
            } else {
                slot.style.display = 'none';
            }
        });
        
        // Show/hide slots based on quantity
        soapSlots.forEach((slot, index) => {
            if (index < this.maxSoaps) {
                slot.style.display = 'flex';
            } else {
                slot.style.display = 'none';
            }
        });
    }

    updateSelectionSummary() {
        const selectedSoapsContainer = document.getElementById('selectedSoaps');
        if (!selectedSoapsContainer) return;
        
        if (this.selectedSoaps.length === 0) {
            selectedSoapsContainer.innerHTML = '<p class="no-selection">Selecciona tus jabones para ver el resumen</p>';
            return;
        }
        
        let summaryHTML = '';
        let totalSoapPrice = 0;
        
        this.selectedSoaps.forEach(soap => {
            summaryHTML += `
                <div class="selected-soap-item">
                    <span class="selected-soap-name">${soap.name}</span>
                    <span class="selected-soap-price">$${soap.price}</span>
                </div>
            `;
            totalSoapPrice += soap.price;
        });
        
        summaryHTML += `
            <div class="selected-soap-item" style="border-top: 2px solid #4a7c59; margin-top: 1rem; padding-top: 1rem;">
                <span class="selected-soap-name"><strong>Total jabones:</strong></span>
                <span class="selected-soap-price"><strong>$${totalSoapPrice}</strong></span>
            </div>
        `;
        
        selectedSoapsContainer.innerHTML = summaryHTML;
    }

    initializeCustomPack() {
        // Set initial values for custom pack
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            this.currentQuantity = parseInt(quantityInput.value);
            this.maxSoaps = this.currentQuantity;
            this.minSoaps = 4; // Custom pack minimum
        }
        
        this.updateDisplay();
        this.updateSoapSlots();
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Remove active class from all tabs and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                button.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    handleAddToCart() {
        if (this.selectedSoaps.length < this.minSoaps) {
            this.showNotification('Selecciona al menos ' + this.minSoaps + ' jabones', 'error');
            return;
        }
        
        const orderData = {
            soaps: this.selectedSoaps,
            quantity: this.currentQuantity,
            shape: this.currentShape,
            engraving: this.currentEngraving,
            engravingText: this.engravingText,
            package: this.currentPackage,
            totalPrice: document.getElementById('finalPrice').textContent
        };
        
        console.log('Order data:', orderData);
        this.showNotification('¡Producto agregado al carrito!', 'success');
        
        // Here you would typically send the data to your backend
        // this.sendToCart(orderData);
    }

    handleWishlist() {
        const configData = {
            soaps: this.selectedSoaps,
            quantity: this.currentQuantity,
            shape: this.currentShape,
            engraving: this.currentEngraving,
            engravingText: this.engravingText,
            package: this.currentPackage
        };
        
        // Save to localStorage for now
        localStorage.setItem('savedConfiguration', JSON.stringify(configData));
        this.showNotification('¡Configuración guardada!', 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            success: '#4a7c59',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Basic Pack Customizer
class BasicPackCustomizer {
    constructor() {
        this.selectedSoaps = ['lavanda', 'romero', 'calendula']; // Default soaps
        this.currentQuantity = 3;
        this.currentPackage = 'standard';
        this.basePrice = 45;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
        this.setupTabs();
    }

    setupEventListeners() {
        // Quantity selector
        const qtyButtons = document.querySelectorAll('.qty-btn');
        qtyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuantityChange(e));
        });

        // Soap selection
        const soapOptions = document.querySelectorAll('.soap-option');
        soapOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleSoapSelection(e));
        });

        // Package selection
        const packageOptions = document.querySelectorAll('.package-option');
        packageOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handlePackageSelection(e));
        });

        // Add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => this.handleAddToCart());
        }
    }

    handleQuantityChange(e) {
        const action = e.target.dataset.action;
        const quantityInput = document.getElementById('quantity');
        let newQuantity = parseInt(quantityInput.value);

        if (action === 'increase' && newQuantity < 6) {
            newQuantity++;
        } else if (action === 'decrease' && newQuantity > 3) {
            newQuantity--;
        }

        quantityInput.value = newQuantity;
        this.currentQuantity = newQuantity;
        this.updateDisplay();
    }

    handleSoapSelection(e) {
        const soapOption = e.currentTarget;
        const soapId = soapOption.dataset.soap;

        if (soapOption.classList.contains('selected')) {
            // Can't deselect in basic pack - must have exactly 3
            return;
        } else {
            // Replace one of the selected soaps
            const selectedOptions = document.querySelectorAll('.soap-option.selected');
            if (selectedOptions.length >= 3) {
                selectedOptions[0].classList.remove('selected');
                this.selectedSoaps[0] = soapId;
            }
            soapOption.classList.add('selected');
        }

        this.updateDisplay();
    }

    handlePackageSelection(e) {
        const packageOption = e.currentTarget;
        const packageType = packageOption.dataset.package;
        
        document.querySelectorAll('.package-option').forEach(opt => opt.classList.remove('selected'));
        packageOption.classList.add('selected');
        
        this.currentPackage = packageType;
        this.updateDisplay();
    }

    updateDisplay() {
        this.updatePrice();
    }

    updatePrice() {
        let totalPrice = this.basePrice;
        
        // Add extra quantity cost
        if (this.currentQuantity > 3) {
            totalPrice += (this.currentQuantity - 3) * 8;
        }
        
        // Add package cost
        const packagePrice = parseFloat(document.querySelector('.package-option.selected')?.dataset.price || 0);
        totalPrice += packagePrice;
        
        const currentPriceElements = document.querySelectorAll('#currentPrice, #finalPrice');
        currentPriceElements.forEach(element => {
            if (element) {
                element.textContent = `$${totalPrice}`;
            }
        });
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                button.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    handleAddToCart() {
        const orderData = {
            pack: 'basic',
            soaps: this.selectedSoaps,
            quantity: this.currentQuantity,
            package: this.currentPackage,
            totalPrice: document.getElementById('finalPrice').textContent
        };
        
        console.log('Basic pack order:', orderData);
        this.showNotification('¡Pack Básico agregado al carrito!', 'success');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4a7c59;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Premium Pack Customizer (similar to Basic but with more options)
class PremiumPackCustomizer extends BasicPackCustomizer {
    constructor() {
        super();
        this.selectedSoaps = ['lavanda', 'romero', 'calendula', 'rosa-mosqueta', 'menta', 'aloe-vera'];
        this.currentQuantity = 6;
        this.basePrice = 80;
    }

    handleQuantityChange(e) {
        const action = e.target.dataset.action;
        const quantityInput = document.getElementById('quantity');
        let newQuantity = parseInt(quantityInput.value);

        if (action === 'increase' && newQuantity < 8) {
            newQuantity++;
        } else if (action === 'decrease' && newQuantity > 6) {
            newQuantity--;
        }

        quantityInput.value = newQuantity;
        this.currentQuantity = newQuantity;
        this.updateDisplay();
    }

    updatePrice() {
        let totalPrice = this.basePrice;
        
        // Add extra quantity cost
        if (this.currentQuantity > 6) {
            totalPrice += (this.currentQuantity - 6) * 8;
        }
        
        // Add package cost
        const packagePrice = parseFloat(document.querySelector('.package-option.selected')?.dataset.price || 0);
        totalPrice += packagePrice;
        
        const currentPriceElements = document.querySelectorAll('#currentPrice, #finalPrice');
        currentPriceElements.forEach(element => {
            if (element) {
                element.textContent = `$${totalPrice}`;
            }
        });
    }

    handleAddToCart() {
        const orderData = {
            pack: 'premium',
            soaps: this.selectedSoaps,
            quantity: this.currentQuantity,
            package: this.currentPackage,
            totalPrice: document.getElementById('finalPrice').textContent
        };
        
        console.log('Premium pack order:', orderData);
        this.showNotification('¡Pack Premium agregado al carrito!', 'success');
    }
}

// Initialize the appropriate customizer based on the page
document.addEventListener('DOMContentLoaded', function() {
    // Pack pages have been removed - no customizers needed
    
    // Initialize any additional features
    initializeImageZoom();
    initializeScrollAnimations();
});

// Additional features
function initializeImageZoom() {
    const productImages = document.querySelectorAll('.product-preview');
    productImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.customization-section, .product-features, .related-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}