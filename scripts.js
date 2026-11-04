// ==========================================
// 3ND KARIM — RESTAURANT WEBSITE
// ==========================================

// Restaurant WhatsApp number (international format without +)
const WHATSAPP_NUMBER = "96171329923";

// Current language
let currentLanguage = "en";

// Shopping cart (resets when the page is refreshed)
let cart = [];

// ==========================================
// MENU DATA
// Prices are in Lebanese pounds (LBP)
// ==========================================

const menuItems = [
    {
        id: 1,
        name: { en: "Kofta", ar: "كفتة" },
        price: 210000
    },
    {
        id: 2,
        name: { en: "Sujuk", ar: "سجق" },
        price: 220000
    },
    {
        id: 3,
        name: { en: "Makanek", ar: "مقانق" },
        price: 220000
    },
    {
        id: 4,
        name: { en: "Roast Beef", ar: "روستو" },
        price: 250000
    },
    {
        id: 5,
        name: { en: "Basturma", ar: "بسطرما" },
        price: 270000
    },
    {
        id: 6,
        name: { en: "Smoked Chicken", ar: "دجاج مدخن" },
        price: 330000
    },
    {
        id: 7,
        name: { en: "Chicken Liver", ar: "سودة دجاج" },
        price: 210000
    },
    {
        id: 8,
        name: { en: "Sweetbreads", ar: "نخاعات" },
        price: 250000
    },
    {
        id: 9,
        name: { en: "Beef Tongue", ar: "لسانيات" },
        price: 220000
    },
    {
        id: 10,
        name: {
            en: "Two Skewers (Pan-Fried)",
            ar: "عالسيخين (بالمقلاية)"
        },
        price: 250000
    },
    {
        id: 11,
        name: { en: "Extra Cheese", ar: "إضافة جبنة" },
        price: 50000
    },
    {
        id: 12,
        name: { en: "Ayran", ar: "لبن عيران" },
        price: 100000
    },
    {
        id: 13,
        name: { en: "Soft Drinks", ar: "مشروبات غازية" },
        price: 100000
    }
];

// ==========================================
// HTML ELEMENTS
// ==========================================

const menuContainer = document.getElementById("menu-items");
const cartContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-btn");
const languageButton = document.getElementById("language-toggle");

// ==========================================
// FORMAT PRICE
// ==========================================

function formatPrice(price) {
    return `${price.toLocaleString("en-US")} LBP`;
}

// ==========================================
// DISPLAY MENU
// ==========================================

function renderMenu() {
    menuContainer.innerHTML = "";

    menuItems.forEach((item) => {
        const card = document.createElement("article");
        card.className = "menu-card";

        const info = document.createElement("div");
        info.className = "menu-info";

        const title = document.createElement("h3");
        title.textContent = item.name[currentLanguage];

        const price = document.createElement("p");
        price.className = "menu-price";
        price.textContent = formatPrice(item.price);

        info.appendChild(title);
        info.appendChild(price);

        const addButton = document.createElement("button");
        addButton.className = "add-to-cart";
        addButton.type = "button";
        addButton.textContent = "+";

        addButton.setAttribute(
            "aria-label",
            currentLanguage === "en"
                ? `Add ${item.name.en} to cart`
                : `إضافة ${item.name.ar} إلى السلة`
        );

        addButton.addEventListener("click", () => {
            addToCart(item.id);
        });

        card.appendChild(info);
        card.appendChild(addButton);

        menuContainer.appendChild(card);
    });
}

// ==========================================
// ADD TO CART
// ==========================================

function addToCart(itemId) {
    const existingItem = cart.find(
        (item) => item.id === itemId
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: itemId,
            quantity: 1
        });
    }

    renderCart();
}

// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(itemId, amount) {
    const item = cart.find(
        (cartItem) => cartItem.id === itemId
    );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(
            (cartItem) => cartItem.id !== itemId
        );
    }

    renderCart();
}

// ==========================================
// REMOVE ITEM
// ==========================================

function removeFromCart(itemId) {
    cart = cart.filter(
        (item) => item.id !== itemId
    );

    renderCart();
}

// ==========================================
// DISPLAY CART
// ==========================================

function renderCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-cart";

        emptyMessage.textContent =
            currentLanguage === "en"
                ? "Your cart is empty. Add something delicious!"
                : "سلّتكم فارغة. أضيفوا شيئاً لذيذاً!";

        cartContainer.appendChild(emptyMessage);
    }

    let total = 0;
    let totalQuantity = 0;

    cart.forEach((cartItem) => {
        const menuItem = menuItems.find(
            (item) => item.id === cartItem.id
        );

        if (!menuItem) return;

        const subtotal = menuItem.price * cartItem.quantity;

        total += subtotal;
        totalQuantity += cartItem.quantity;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const title = document.createElement("h3");
        title.textContent = menuItem.name[currentLanguage];

        const price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = formatPrice(subtotal);

        info.appendChild(title);
        info.appendChild(price);

        const controls = document.createElement("div");
        controls.className = "cart-item-controls";

        const decreaseButton = document.createElement("button");
        decreaseButton.className = "quantity-btn";
        decreaseButton.type = "button";
        decreaseButton.textContent = "−";

        decreaseButton.setAttribute(
            "aria-label",
            currentLanguage === "en"
                ? "Decrease quantity"
                : "تقليل الكمية"
        );

        decreaseButton.addEventListener("click", () => {
            changeQuantity(cartItem.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.className = "quantity";
        quantity.textContent = cartItem.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.className = "quantity-btn";
        increaseButton.type = "button";
        increaseButton.textContent = "+";

        increaseButton.setAttribute(
            "aria-label",
            currentLanguage === "en"
                ? "Increase quantity"
                : "زيادة الكمية"
        );

        increaseButton.addEventListener("click", () => {
            changeQuantity(cartItem.id, 1);
        });

        const removeButton = document.createElement("button");
        removeButton.className = "remove-btn";
        removeButton.type = "button";

        removeButton.textContent =
            currentLanguage === "en" ? "Remove" : "حذف";

        removeButton.addEventListener("click", () => {
            removeFromCart(cartItem.id);
        });

        controls.appendChild(decreaseButton);
        controls.appendChild(quantity);
        controls.appendChild(increaseButton);
        controls.appendChild(removeButton);

        itemElement.appendChild(info);
        itemElement.appendChild(controls);

        cartContainer.appendChild(itemElement);
    });

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(total);
}

// ==========================================
// ENGLISH / ARABIC TRANSLATION
// ==========================================

function updateLanguage() {
    document.documentElement.lang = currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar" ? "rtl" : "ltr";

    document.body.dir =
        currentLanguage === "ar" ? "rtl" : "ltr";

    // Translate normal text
    document.querySelectorAll("[data-en][data-ar]").forEach((element) => {
        element.textContent = element.dataset[currentLanguage];
    });

    // FIX: Translate input placeholders
    document.querySelectorAll(
        "[data-placeholder-en][data-placeholder-ar]"
    ).forEach((input) => {
        input.placeholder =
            currentLanguage === "ar"
                ? input.dataset.placeholderAr
                : input.dataset.placeholderEn;
    });

    languageButton.textContent =
        currentLanguage === "en" ? "العربية" : "English";

    document.title =
        currentLanguage === "en"
            ? "3nd Karim | Lebanese Restaurant"
            : "عند كريم | مطعم لبناني";

    renderMenu();
    renderCart();
}

// Language toggle button
languageButton.addEventListener("click", () => {
    currentLanguage =
        currentLanguage === "en" ? "ar" : "en";

    updateLanguage();
});

// ==========================================
// WHATSAPP CHECKOUT
// ==========================================

checkoutButton.addEventListener("click", () => {

    // Check whether the cart is empty
    if (cart.length === 0) {
        alert(
            currentLanguage === "en"
                ? "Your cart is empty. Please add items before ordering."
                : "سلّتكم فارغة. يرجى إضافة الأصناف قبل الطلب."
        );

        return;
    }

    // Get customer information
    const customerNameInput = document.getElementById("customer-name");
    const customerPhoneInput = document.getElementById("customer-phone");

    // Make sure the customer fields exist in the HTML
    if (!customerNameInput || !customerPhoneInput) {
        alert(
            currentLanguage === "en"
                ? "Customer information fields could not be found. Please check your HTML."
                : "لم يتم العثور على حقول معلومات الزبون. يرجى التحقق من ملف HTML."
        );

        return;
    }

    const customerName = customerNameInput.value.trim();
    const customerPhone = customerPhoneInput.value.trim();

    // Require the customer's name and phone number
    if (!customerName || !customerPhone) {
        alert(
            currentLanguage === "en"
                ? "Please enter your full name and phone number before ordering."
                : "يرجى إدخال الاسم الكامل ورقم الهاتف قبل إرسال الطلب."
        );

        if (!customerName) {
            customerNameInput.focus();
        } else {
            customerPhoneInput.focus();
        }

        return;
    }

    // Build the WhatsApp message with customer details
    let message =
        currentLanguage === "en"
            ? `Hello 3nd Karim! I would like to place an order.\n\nCustomer name: ${customerName}\nPhone number: ${customerPhone}\n\nOrder details:\n`
            : `مرحباً عند كريم! أود تقديم الطلب التالي.\n\nاسم الزبون: ${customerName}\nرقم الهاتف: ${customerPhone}\n\nتفاصيل الطلب:\n`;

    let total = 0;

    // Add order items
    cart.forEach((cartItem) => {
        const menuItem = menuItems.find(
            (item) => item.id === cartItem.id
        );

        if (!menuItem) return;

        const subtotal = menuItem.price * cartItem.quantity;

        total += subtotal;

        message +=
            `${menuItem.name[currentLanguage]} x ${cartItem.quantity}` +
            ` — ${formatPrice(subtotal)}\n`;
    });

    // Add order total
    message += "\n";

    message +=
        currentLanguage === "en"
            ? `Total: ${formatPrice(total)}\n\n`
            : `المجموع: ${formatPrice(total)}\n\n`;

    message +=
        currentLanguage === "en"
            ? "Thank you!"
            : "شكراً لكم!";

    // Open WhatsApp with the completed order
    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

// ==========================================
// FOOTER YEAR
// ==========================================

document.getElementById("current-year").textContent =
    new Date().getFullYear();

// ==========================================
// INITIALIZE WEBSITE
// ==========================================

renderMenu();
renderCart();
updateLanguage();