const adminEmail = "juan1@gmail.com";

const products = [
    { id: 1, name: "Coca Cola 1.5 x12und", price: 60000, img:"https://laprincipaldelicores.com/cdn/shop/files/gaseosacocacola1.5lt.png?v=1693316806"},
    { id: 2, name: "Atun Perlado", price: 4000, img: "https://cdnx.jumpseller.com/supermercados-k/image/58184863/resize/610/610?1733838467" },
    { id: 3, name: "Sardina Ovalada La España", price: 5900, img: "https://web.superboom.net/web/image/product.template/31884/image_1024?unique=bdedc18" },
    { id: 4, name: "Azucar Mayagüez x500", price: 2100, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOvSDPh40lEmef3Biruhua3UgFDrtPpxEt7Q&s" },
    { id: 5, name: "Arroz Diana x500", price: 1700, img: "https://grupodiana.co/wp-content/uploads/2019/12/arroz-valor01.png" },
    { id: 6, name: "Huevos Extra", price: 16500, img: "https://avinal.com.co/wp-content/uploads/2022/10/x-60.png" },
    { id: 7, name: "Salsa Bary x12 und", price: 10200, img: "https://alejandraz1.sg-host.com/wp-content/uploads/2021/07/Salsas-general-bary.png" },
    { id: 8, name: "Pepsi 2.5 x12und", price: 67000, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_ncJL8LkMD1CtSCyUHkE4Thi7-GNsdt0H0w&s" },
    { id: 9, name: "Queso Colanta 350gr", price: 4200, img: "https://colanta.com/sabe-mas/wp-content/uploads/Quesito-colanta-380-redondo.jpg" },
    { id: 10, name: "Gomas Trululu x90gr", price: 2200, img: "https://megatiendas.vtexassets.com/arquivos/ids/168861/7702993051801.png?v=638513795847070000" }
];

let cart = [];

function renderProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-sm-6 col-md-4 col-lg-3";
        col.innerHTML = `
            <div class="card shadow-sm h-100">
                <img src="${product.img}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text mb-3">Precio: $${product.price.toFixed(2)}</p>
                    <button class="btn btn-success mt-auto" onclick="addToCart(${product.id})">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(col);
    });

    const adminBtn = document.getElementById("adminBtn");
    const currentUser = localStorage.getItem("loggedInUser");
    adminBtn.style.display = currentUser === adminEmail ? "inline-block" : "none";
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            ${item.name} - $${item.price.toFixed(2)}
            <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">Eliminar</button>
        `;
        cartList.appendChild(li);
    });

    document.getElementById("total").textContent = total.toFixed(2);
}

function showView(view) {
    document.getElementById("authSection").style.display = view === "auth" ? "block" : "none";
    document.getElementById("storeSection").style.display = view === "store" ? "block" : "none";
    document.getElementById("cartSection").style.display = view === "cart" ? "block" : "none";
    document.getElementById("adminSection").style.display = view === "admin" ? "block" : "none";
}

function goToCart() {
    renderCart();
    showView("cart");
}

function backToStore() {
    showView("store");
}

function logout() {
    localStorage.removeItem("loggedInUser");
    showView("auth");
}

// 🔐 Registro
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (localStorage.getItem(email)) {
        alert("Este correo ya está registrado.");
    } else {
        localStorage.setItem(email, JSON.stringify({ password }));
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        this.reset();
    }
});

// 🔐 Login
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const user = JSON.parse(localStorage.getItem(email));
    if (user && user.password === password) {
        localStorage.setItem("loggedInUser", email);
        alert("Bienvenido/a");
        renderProducts();
        showView("store");
    } else {
        alert("Credenciales inválidas.");
    }
});

// 🛠️ ADMIN
function showAdminView() {
    const currentUser = localStorage.getItem("loggedInUser");
    if (currentUser !== adminEmail) {
        alert("Acceso denegado. Solo el administrador puede acceder.");
        return;
    }
    renderAdminTable();
    showView("admin");
}

function renderAdminTable() {
    const table = document.getElementById("adminProductTable");
    table.innerHTML = "";
    products.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${product.img}" width="60"></td>
            <td>${product.name}</td>
            <td><input type="number" class="form-control" value="${product.price}" onchange="updatePrice(${index}, this.value)"></td>
            <td><button class="btn btn-warning btn-sm" onclick="updatePrice(${index}, this.previousElementSibling.value)">Actualizar</button></td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Eliminar</button></td>
        `;
        table.appendChild(row);
    });
}

document.getElementById("addProductForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("newName").value;
    const price = parseFloat(document.getElementById("newPrice").value);
    const img = document.getElementById("newImg").value;

    const newProduct = {
        id: Date.now(),
        name,
        price,
        img
    };

    products.push(newProduct);
    this.reset();
    renderProducts();
    renderAdminTable();
});

function updatePrice(index, newPrice) {
    products[index].price = parseFloat(newPrice);
    renderProducts();
    renderAdminTable();
}

function deleteProduct(index) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        products.splice(index, 1);
        renderProducts();
        renderAdminTable();
    }
}

// On load
window.onload = function () {
    if (localStorage.getItem("loggedInUser")) {
        renderProducts();
        showView("store");
    } else {
        showView("auth");
    }
};

function openPaymentModal() {
    const total = document.getElementById("total").textContent;
    document.getElementById("modalTotal").textContent = total;
    const modal = new bootstrap.Modal(document.getElementById("paymentModal"));
    modal.show();
}

function processPayment() {
    // Aquí puedes integrar una pasarela real como Stripe o PayU
    alert("Pago procesado con éxito. Gracias por tu compra.");
    cart = [];
    renderCart();
    const modal = bootstrap.Modal.getInstance(document.getElementById("paymentModal"));
    modal.hide();
}
