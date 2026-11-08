
// ==========================================
// 3ND KARIM — RESTAURANT WEBSITE
// ==========================================

// WhatsApp number (international format without +)
const WHATSAPP_NUMBER = "96171329923";

// Current language
let currentLanguage = "en";

// Shopping cart
let cart = [];

// Bread selection
// Arabic bread is selected by default.
const selectedBread = {};

const sandwichItemIds = [3, 4, 5, 6, 7, 8, 9, 10];


// ==========================================
// MENU DATA
// Prices are in Lebanese pounds (LBP)
// ==========================================

const menuItems = [
    {
        id: 1,
        name: { en: "Kafta", ar: "كفتة" },
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
        name: { en: "Rosto", ar: "روستو" },
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
        price: 230000
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
        name: { en: "Beef Tongue", ar: "لسانات" },
        price: 220000
    },
    {
        id: 10,
        name: { en: "3al Sekhien (Pan-Fried)", ar: "عالسيخين (بالمقلاية)" },
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
        name: { en: "Pepsi", ar: "بيبسي" },
        price: 100000
    },
    {
        id: 14,
        name: { en: "7up", ar: "سفن اب" },
        price: 100000
    },
    {
        id: 15,
        name: { en: "Miranda", ar: "ميرندا" },
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

        // Item information
        const info = document.createElement("div");
        info.className = "menu-info";

        const title = document.createElement("h3");
        title.textContent = item.name[currentLanguage];

        const price = document.createElement("p");
        price.className = "menu-price";
        price.textContent = formatPrice(item.price);

        info.appendChild(title);
        info.appendChild(price);

        // Item actions
        const actions = document.createElement("div");
        actions.className = "menu-actions";


        // ======================================
        // BREAD SELECTOR
        // Only items 3–10 have bread options.
        // ======================================

        if (sandwichItemIds.includes(item.id)) {

            // Default bread: Arabic
            if (!selectedBread[item.id]) {
                selectedBread[item.id] = "arabic";
            }

            const breadSelector = document.createElement("div");
            breadSelector.className = "bread-selector";

            // franji bread button
            const franjiButton = document.createElement("button");
            franjiButton.type = "button";
            franjiButton.className = "bread-option";

            franjiButton.textContent =
                currentLanguage === "en" ? "Franji" : "فرنجي";

            franjiButton.setAttribute("aria-pressed", "false");


            // Arabic bread button
            const arabicButton = document.createElement("button");
            arabicButton.type = "button";
            arabicButton.className = "bread-option";

            arabicButton.textContent =
                currentLanguage === "en" ? "Arabic" : "عربي";

            arabicButton.setAttribute("aria-pressed", "false");


            // Update selected button
            function updateBreadSelection() {
                const isfranji = selectedBread[item.id] === "franji";

                franjiButton.classList.toggle("active", isfranji);
                arabicButton.classList.toggle("active", !isfranji);

                franjiButton.setAttribute(
                    "aria-pressed",
                    String(isfranji)
                );

                arabicButton.setAttribute(
                    "aria-pressed",
                    String(!isfranji)
                );
            }


            // Select franji bread
            franjiButton.addEventListener("click", () => {
                selectedBread[item.id] = "franji";
                updateBreadSelection();
            });


            // Select Arabic bread
            arabicButton.addEventListener("click", () => {
                selectedBread[item.id] = "arabic";
                updateBreadSelection();
            });


            breadSelector.appendChild(franjiButton);
            breadSelector.appendChild(arabicButton);

            updateBreadSelection();

            actions.appendChild(breadSelector);
        }


        // ======================================
        // ADD TO CART BUTTON
        // ======================================

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
            const breadType = sandwichItemIds.includes(item.id)
                ? selectedBread[item.id] || "arabic"
                : null;

            addToCart(item.id, breadType);
        });

        actions.appendChild(addButton);

        card.appendChild(info);
        card.appendChild(actions);

        menuContainer.appendChild(card);
    });
}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(itemId, breadType = null) {

    // Items with different bread types are separate cart items.
    const existingItem = cart.find(
        (item) =>
            item.id === itemId &&
            item.breadType === breadType
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: itemId,
            quantity: 1,
            breadType: breadType
        });
    }

    renderCart();
}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(itemId, breadType, amount) {

    const item = cart.find(
        (cartItem) =>
            cartItem.id === itemId &&
            cartItem.breadType === breadType
    );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(
            (cartItem) =>
                !(
                    cartItem.id === itemId &&
                    cartItem.breadType === breadType
                )
        );
    }

    renderCart();
}


// ==========================================
// REMOVE ITEM
// ==========================================

function removeFromCart(itemId, breadType) {

    cart = cart.filter(
        (item) =>
            !(
                item.id === itemId &&
                item.breadType === breadType
            )
    );

    renderCart();
}


// ==========================================
// DISPLAY CART
// ==========================================

function renderCart() {

    cartContainer.innerHTML = "";

    // Empty cart message
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


        // Cart item container
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";


        // Item information
        const info = document.createElement("div");
        info.className = "cart-item-info";

        const title = document.createElement("h3");

        let breadLabel = "";

        if (cartItem.breadType === "franji") {
            breadLabel =
                currentLanguage === "en"
                    ? " - on franji bread"
                    : " - على خبز فرنسي";
        } else if (cartItem.breadType === "arabic") {
            breadLabel =
                currentLanguage === "en"
                    ? " - on Arabic bread"
                    : " - على خبز عربي";
        }

        title.textContent =
            menuItem.name[currentLanguage] + breadLabel;

        const price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = formatPrice(subtotal);

        info.appendChild(title);
        info.appendChild(price);


        // Quantity controls
        const controls = document.createElement("div");
        controls.className = "cart-item-controls";


        // Decrease quantity
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
            changeQuantity(
                cartItem.id,
                cartItem.breadType,
                -1
            );
        });


        // Quantity display
        const quantity = document.createElement("span");

        quantity.className = "quantity";
        quantity.textContent = cartItem.quantity;


        // Increase quantity
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
            changeQuantity(
                cartItem.id,
                cartItem.breadType,
                1
            );
        });


        // Remove item
        const removeButton = document.createElement("button");

        removeButton.className = "remove-btn";
        removeButton.type = "button";

        removeButton.textContent =
            currentLanguage === "en"
                ? "Remove"
                : "حذف";

        removeButton.addEventListener("click", () => {
            removeFromCart(
                cartItem.id,
                cartItem.breadType
            );
        });


        // Add controls
        controls.appendChild(decreaseButton);
        controls.appendChild(quantity);
        controls.appendChild(increaseButton);
        controls.appendChild(removeButton);

        itemElement.appendChild(info);
        itemElement.appendChild(controls);

        cartContainer.appendChild(itemElement);
    });


    // Update cart count and total
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


    // Translate HTML elements
    document.querySelectorAll("[data-en][data-ar]").forEach((element) => {

        element.textContent = element.dataset[currentLanguage];

    });


    // Update input placeholders
    document.querySelectorAll(
        "[data-placeholder-en][data-placeholder-ar]"
    ).forEach((input) => {

        input.placeholder =
            currentLanguage === "ar"
                ? input.dataset.placeholderAr
                : input.dataset.placeholderEn;

    });


    // Update language button
    languageButton.textContent =
        currentLanguage === "en"
            ? "العربية"
            : "English";


    // Update page title
    document.title =
        currentLanguage === "en"
            ? "3nd Karim | Lebanese Restaurant"
            : "عند كريم | مطعم لبناني";


    // Refresh menu and cart
    renderMenu();
    renderCart();
}


// Language button event
languageButton.addEventListener("click", () => {

    currentLanguage =
        currentLanguage === "en"
            ? "ar"
            : "en";

    updateLanguage();
});


// ==========================================
// WHATSAPP CHECKOUT
// ==========================================

checkoutButton.addEventListener("click", () => {

    // Check if cart is empty
    if (cart.length === 0) {
        alert(
            currentLanguage === "en"
                ? "Your cart is empty. Please add items before ordering."
                : "سلّتكم فارغة. يرجى إضافة الأصناف قبل الطلب."
        );

        return;
    }


    // Get customer information
    const customerName = document
        .getElementById("customer-name")
        .value
        .trim();

    const customerPhone = document
        .getElementById("customer-phone")
        .value
        .trim();


    // Validate customer information
    if (!customerName || !customerPhone) {
        alert(
            currentLanguage === "en"
                ? "Please enter your full name and phone number before ordering."
                : "يرجى إدخال الاسم الكامل ورقم الهاتف قبل إرسال الطلب."
        );

        return;
    }


    // Create WhatsApp message
    let message = currentLanguage === "en"
        ? `Hello 3nd Karim! I would like to place an order.\n\nCustomer name: ${customerName}\nPhone number: ${customerPhone}\n`
        : `مرحباً عند كريم! أود تقديم الطلب التالي.\n\nاسم الزبون: ${customerName}\nرقم الهاتف: ${customerPhone}\n`;


    message += currentLanguage === "en"
        ? "\nOrder details:\n"
        : "\nتفاصيل الطلب:\n";


    let total = 0;


    // Add cart items to message
    cart.forEach((cartItem) => {

        const menuItem = menuItems.find(
            (item) => item.id === cartItem.id
        );

        if (!menuItem) return;

        const subtotal = menuItem.price * cartItem.quantity;

        total += subtotal;


        // Add bread type
        let breadText = "";

        if (cartItem.breadType === "franji") {
            breadText =
                currentLanguage === "en"
                    ? " on franji bread"
                    : " على خبز فرنسي";
        } else if (cartItem.breadType === "arabic") {
            breadText =
                currentLanguage === "en"
                    ? " on Arabic bread"
                    : " على خبز عربي";
        }


        message +=
            `${menuItem.name[currentLanguage]}${breadText} x ${cartItem.quantity} — ${formatPrice(subtotal)}\n`;
    });


    // Add total
    message += "\n" + (
        currentLanguage === "en"
            ? `Total: ${formatPrice(total)}\n\nThank you!`
            : `المجموع: ${formatPrice(total)}\n\nشكراً لكم!`
    );


    // Open WhatsApp
    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
});


// ==========================================
// FOOTER YEAR
// ==========================================

const currentYearElement = document.getElementById("current-year");

if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}
// ==========================================
// INITIALIZE WEBSITE
// ==========================================

renderMenu();
renderCart();
updateLanguage();