const apiBase = "/api/produtos";
const ordersBase = "http://localhost:8080/api/orders";
const menuList = document.getElementById("menu-list");
const refreshButton = document.getElementById("refresh-button");
const categoriesContainer = document.getElementById("categories");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const finalizeOrderButton = document.getElementById("finalize-order-button");
const itemForm = document.getElementById("item-form");
const nameInput = document.getElementById("item-name");
const categoryInput = document.getElementById("item-category");
const imageInput = document.getElementById("item-image");
const descriptionInput = document.getElementById("item-description");
const priceInput = document.getElementById("item-price");

let menuItems = [];
let cart = [];
let activeCategory = "Todos";

async function loadMenu() {
  menuList.textContent = "Carregando...";

  try {
    const response = await fetch(apiBase);
    const items = await response.json();

    if (!Array.isArray(items)) {
      throw new Error("Resposta inesperada do servidor");
    }

    menuItems = items;
    renderCategories();
    renderMenu();
  } catch (error) {
    menuList.innerHTML = `<p class="error">Falha ao carregar o cardápio: ${error.message}</p>`;
  }
}

function renderCategories() {
  const categories = [
    "Todos",
    ...new Set(menuItems.map((item) => item.category || "Outros")),
  ];
  categoriesContainer.innerHTML = categories
    .map(
      (category) => `
        <button class="category-button ${category === activeCategory ? "active" : ""}" data-category="${category}">
          ${category}
        </button>
      `,
    )
    .join("");

  categoriesContainer.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderCategories();
      renderMenu();
    });
  });
}

function renderMenu() {
  const filteredItems =
    activeCategory === "Todos"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  if (filteredItems.length === 0) {
    menuList.innerHTML = `<p class="empty-state">Nenhum item encontrado para esta categoria.</p>`;
    return;
  }

  menuList.innerHTML = filteredItems.map(renderMenuItem).join("");
  attachMenuHandlers();
}

function renderMenuItem(item) {
  return `
    <article class="item-card">
      <img class="item-image" src="${item.imageUrl || "https://via.placeholder.com/320x200?text=Cardapio"}" alt="${item.name}" />
      <div class="item-content">
        <span class="item-tag">${item.category || "Outros"}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="item-bottom">
          <strong class="item-price">R$ ${Number(item.price).toFixed(2)}</strong>
          <div class="item-actions">
            <button class="secondary add-to-cart" data-id="${item.id}">Adicionar ao carrinho</button>
            <button class="danger remove-item" data-id="${item.id}">Remover</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function attachMenuHandlers() {
  document.querySelectorAll("button.add-to-cart").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.id));
  });

  document.querySelectorAll("button.remove-item").forEach((button) => {
    button.addEventListener("click", async () => {
      const itemId = button.dataset.id;
      if (!confirm("Deseja remover este item do cardápio?")) {
        return;
      }
      await deleteItem(itemId);
    });
  });
}

function addToCart(itemId) {
  const item = menuItems.find(
    (product) => String(product.id) === String(itemId),
  );
  if (!item) {
    alert("Item não encontrado.");
    return;
  }

  const existing = cart.find(
    (cartItem) => String(cartItem.id) === String(item.id),
  );
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  renderCart();
}

function removeCartItem(itemId) {
  cart = cart.filter((cartItem) => String(cartItem.id) !== String(itemId));
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-state">O carrinho está vazio.</p>`;
    cartCount.textContent = "0 itens";
    cartTotal.textContent = "R$ 0,00";
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-info">
            <strong>${item.name}</strong>
            <span>${item.quantity} x R$ ${Number(item.price).toFixed(2)}</span>
          </div>
          <button class="cart-remove" data-id="${item.id}">Remover</button>
        </div>
      `,
    )
    .join("");

  cartCount.textContent = `${cart.reduce((sum, item) => sum + item.quantity, 0)} itens`;
  cartTotal.textContent = `R$ ${cart.reduce((sum, item) => sum + item.quantity * Number(item.price), 0).toFixed(2)}`;

  cartItemsContainer
    .querySelectorAll("button.cart-remove")
    .forEach((button) => {
      button.addEventListener("click", () => removeCartItem(button.dataset.id));
    });
}

async function deleteItem(id) {
  const response = await fetch(`${apiBase}/${id}`, { method: "DELETE" });

  if (!response.ok) {
    alert("Erro ao remover o item.");
    return;
  }

  await loadMenu();
}

itemForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newItem = {
    name: nameInput.value.trim(),
    category: categoryInput.value.trim(),
    imageUrl: imageInput.value.trim(),
    description: descriptionInput.value.trim(),
    price: parseFloat(priceInput.value),
  };

  if (
    !newItem.name ||
    !newItem.category ||
    !newItem.imageUrl ||
    !newItem.description ||
    Number.isNaN(newItem.price)
  ) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const response = await fetch(apiBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  });

  if (!response.ok) {
    alert("Erro ao salvar o item.");
    return;
  }

  itemForm.reset();
  await loadMenu();
});

finalizeOrderButton.addEventListener("click", async () => {
  if (cart.length === 0) {
    alert("Adicione itens ao carrinho antes de finalizar o pedido.");
    return;
  }

  const customerName = prompt("Nome do cliente:", "Cliente");
  if (customerName === null) {
    return; // Cancela se o usuário fechar o prompt
  }

  // Monta o payload exatamente como sua classe Java espera receber
  const order = {
    customerName: customerName.trim() || "Cliente",
    items: cart.map((item) => ({
      productId: item.id,
      name: item.name,
      category: item.category,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      unitPrice: Number(item.price),
    })),
  };

  try {
    const response = await fetch(ordersBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error("Erro na resposta do servidor");
    }

    const pedidoSalvo = await response.json();

    // Feedback profissional contendo o número do pedido gerado pelo PostgreSQL
    alert(`Pedido nº ${pedidoSalvo.id} finalizado com sucesso!`);

    // Zera o estado do carrinho no JavaScript e renderiza a tela limpa
    cart = [];
    renderCart();
  } catch (error) {
    console.error("Erro ao enviar pedido:", error);
    alert("Erro ao finalizar o pedido. Verifique se o servidor está ativo.");
  }
});

refreshButton.addEventListener("click", loadMenu);
window.addEventListener("DOMContentLoaded", () => {
  loadMenu();
  renderCart();
});
