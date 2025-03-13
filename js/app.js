document.addEventListener('DOMContentLoaded', () => {
    let products = [
        { id: 1, name: 'Cámara', price: 5000, stock: 3, image: 'img/camara.jpg', description: 'Cámara digital de alta resolución', reviews: [{ user: 'Ana', rating: 4, comment: 'Muy buena cámara' }] },
        { id: 2, name: 'Espejo', price: 800, stock: 10, image: 'img/espejo.jpg', description: 'Espejo de pared decorativo', reviews: [{ user: 'Luis', rating: 5, comment: 'Excelente espejo' }] },
        { id: 3, name: 'Estante', price: 1200, stock: 5, image: 'img/estante.jpg', description: 'Estante de madera para libros', reviews: [{ user: 'Sofía', rating: 3, comment: 'Cumple su función' }] },
        { id: 4, name: 'Ganchos', price: 300, stock: 20, image: 'img/ganchos.jpeg', description: 'Juego de ganchos para ropa', reviews: [{ user: 'Carlos', rating: 4, comment: 'Útiles y prácticos' }] },
        { id: 5, name: 'Lámpara', price: 900, stock: 8, image: 'img/lampara.jpg', description: 'Lámpara de mesa moderna', reviews: [{ user: 'Laura', rating: 5, comment: 'Ilumina muy bien' }] },
        { id: 6, name: 'Librero', price: 2500, stock: 7, image: 'img/librero.jpg', description: 'Librero tipo buro', reviews: [{ user: 'Amelia', rating: 5, comment: 'Es de muy buena calidad y caben muy bien las cosas' }] }

    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let history = JSON.parse(localStorage.getItem('history')) || [];
    let coupons = { 'DESC10': 0.10, 'DESC20': 0.20 };
    let navigationHistory = JSON.parse(localStorage.getItem('navigationHistory')) || [];

    const productList = document.querySelector('.product-list');
    const cartItems = document.querySelector('.cart-items');
    const favoritesList = document.querySelector('.favorites-list');
    const historyList = document.querySelector('.history-list');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const couponInput = document.getElementById('coupon-input');
    const applyCouponButton = document.querySelector('.apply-coupon');
    const clearCartButton = document.querySelector('.clear-cart');
    const checkoutButton = document.querySelector('.checkout');
    const modal = document.getElementById('product-modal');
    const closeModal = document.querySelector('.close-modal');
    const productDetails = document.querySelector('.product-details');
    const productReviews = document.querySelector('.product-reviews');
    const productSuggestions = document.querySelector('.product-suggestions');
    const navigationHistoryList = document.querySelector('.navigation-history-list'); // Selecciona la lista del historial de navegación

    

    function renderProducts() {
        productList.innerHTML = '';
        let filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchInput.value.toLowerCase()));
        if (sortSelect.value === 'price') {
            filteredProducts.sort((a, b) => a.price - b.price);
        }
        filteredProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                    <p>Stock: ${product.stock}</p>
                    <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
                    <button class="add-to-favorites" data-id="${product.id}"><i class="fas fa-heart"></i> Favoritos</button>
                    <button class="view-details" data-id="${product.id}"><i class="fas fa-info-circle"></i> Detalles</button>
                </div>
            `;
            productList.appendChild(productItem);
        });
    }

    function renderCart() {
        cartItems.innerHTML = '';
        let subtotal = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                    <p>${product.price} x ${item.quantity}</p>
                    <button class="remove-from-cart" data-id="${product.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            cartItems.appendChild(cartItem);
            subtotal += product.price * item.quantity;
        });
        const iva = subtotal * 0.16;
        const total = subtotal + iva;
        document.querySelector('.cart-subtotal').textContent = `MX$${subtotal.toFixed(2)}`;
        document.querySelector('.cart-iva').textContent = `MX$${iva.toFixed(2)}`;
        document.querySelector('.cart-total').textContent = `MX$${total.toFixed(2)}`;
    }
    
    function renderFavorites() {
        favoritesList.innerHTML = '';
        favorites.forEach(id => {
            const product = products.find(p => p.id === id);
            const favoriteItem = document.createElement('div');
            favoriteItem.classList.add('favorite-item');
            favoriteItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                    <button class="remove-from-favorites" data-id="${product.id}"><i class="fas fa-heart-broken"></i> Eliminar</button>
                </div>
            `;
            favoritesList.appendChild(favoriteItem);
        });
    }

    function renderHistory() {
        historyList.innerHTML = '';
        history.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.innerHTML = `<h3>Pedido ${order.id}</h3>`;
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.id);
                orderDiv.innerHTML += `<p>${product.name} - $${product.price} x ${item.quantity}</p>`;
            });
            historyList.appendChild(orderDiv);
        });
    }
    function renderNavigationHistory() {
        const navigationHistoryList = document.querySelector('.navigation-history-list');
        if (!navigationHistoryList) {
            console.error("Element with class 'navigation-history-list' not found!");
            return;
        }
        navigationHistoryList.innerHTML = '';
        navigationHistory.forEach(id => {
            const product = products.find(p => p.id === id);
            if (product) {
                const navigationHistoryItem = document.createElement('div');
                navigationHistoryItem.classList.add('navigation-history-item');
                navigationHistoryItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div>
                        <h3>${product.name}</h3>
                    </div>
                `;
                navigationHistoryList.appendChild(navigationHistoryItem);
            }
        });
    }

    function showNotification(message) {
        const notification = document.querySelector('.notification');
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    function openChat() {
        const chatModal = document.querySelector('.chat-modal');
        chatModal.style.display = 'block';
        // Aquí puedes añadir la lógica para el chat en vivo
    }

    function closeChat() {
        const chatModal = document.querySelector('.chat-modal');
        chatModal.style.display = 'none';
    }

    function addToCart(id) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity++;
        } else {
            cart.push({ id, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function addToFavorites(id) {
        if (!favorites.includes(id)) {
            favorites.push(id);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        }
    }

    function removeFromFavorites(id) {
        favorites = favorites.filter(i => i !== id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
    }

    function applyCoupon() {
        const discount = coupons[couponInput.value];
        if (discount) {
            const total = parseFloat(document.querySelector('.cart-total').textContent.replace('MX$', ''));
            const discountedTotal = total * (1 - discount);
            document.querySelector('.cart-total').textContent = `MX
            ${discountedTotal.toFixed(2)}`;
        }
    }

    function clearCart() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function checkout() {
        const order = {
            id: Date.now(),
            items: cart
        };
        history.push(order);
        localStorage.setItem('history', JSON.stringify(history));
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        renderHistory();
    }

    function viewDetails(id) {
        const product = products.find(p => p.id === id);
        productDetails.innerHTML = `
            <h3>${product.name}</h3>
            <img src="${product.image}" alt="${product.name}">
            <p>${product.description}</p>
        `;
        productReviews.innerHTML = '<h3>Reseñas:</h3>';
        product.reviews.forEach(review => {
            productReviews.innerHTML += `<p>${review.user} (${review.rating}): ${review.comment}</p>`;
        });
        const suggestions = products.filter(p => p.id !== id);
        productSuggestions.innerHTML = '<h3>Sugerencias:</h3>';
        suggestions.forEach(suggestion => {
            productSuggestions.innerHTML += `
                <div class="product-suggestion">
                    <img src="${suggestion.image}" alt="${suggestion.name}">
                    <p>${suggestion.name}</p>
                </div>
            `;
        });
        modal.style.display = 'block';
        if (!navigationHistory.includes(id)) {
            navigationHistory.push(id);
            localStorage.setItem('navigationHistory', JSON.stringify(navigationHistory));
            renderNavigationHistory();
        }
    }

    searchInput.addEventListener('input', renderProducts);
    sortSelect.addEventListener('change', renderProducts);
    applyCouponButton.addEventListener('click', applyCoupon);
    clearCartButton.addEventListener('click', clearCart);
    checkoutButton.addEventListener('click', checkout);
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    document.querySelector('.chat-button').addEventListener('click', openChat);
    // document.querySelector('.chat-modal').addEventListener('click', closeChat); // Ejemplo de cierre del chat

    productList.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            addToCart(parseInt(e.target.dataset.id));
            showNotification('Producto agregado al carrito');
        } else if (e.target.classList.contains('add-to-favorites')) {
            addToFavorites(parseInt(e.target.dataset.id));
            showNotification('Producto agregado a favoritos');
        } else if (e.target.classList.contains('view-details')) {
            viewDetails(parseInt(e.target.dataset.id));
        }
    });

    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart')) {
            removeFromCart(parseInt(e.target.dataset.id));
            showNotification('Producto eliminado del carrito');
        }
    });

    favoritesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-favorites')) {
            removeFromFavorites(parseInt(e.target.dataset.id));
            showNotification('Producto eliminado de favoritos');
        }
    });

    renderProducts();
    renderCart();
    renderFavorites();
    renderHistory();
    renderNavigationHistory();
});