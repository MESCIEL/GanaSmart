const STORAGE_KEY = "ganasmart_products";


// PRODUCTOS DE EJEMPLO

const defaultProducts = [

  {
    id: 1,
    name: "Audífonos inalámbricos",
    price: "$499 MXN",
    category: "Tecnología",
    emoji: "🎧",
    url: "https://example.com"
  },

  {
    id: 2,
    name: "Lámpara LED",
    price: "$249 MXN",
    category: "Hogar",
    emoji: "💡",
    url: "https://example.com"
  },

  {
    id: 3,
    name: "Reloj inteligente",
    price: "$799 MXN",
    category: "Accesorios",
    emoji: "⌚",
    url: "https://example.com"
  },

  {
    id: 4,
    name: "Mochila",
    price: "$599 MXN",
    category: "Accesorios",
    emoji: "🎒",
    url: "https://example.com"
  },

  {
    id: 5,
    name: "Soporte para celular",
    price: "$199 MXN",
    category: "Tecnología",
    emoji: "📱",
    url: "https://example.com"
  },

  {
    id: 6,
    name: "Organizador de escritorio",
    price: "$299 MXN",
    category: "Hogar",
    emoji: "🗂️",
    url: "https://example.com"
  }

];


let products =
  JSON.parse(
    localStorage.getItem(STORAGE_KEY)
  ) || defaultProducts;


let selectedCategory = "Todos";


let clicks =
  Number(
    localStorage.getItem("ganasmart_clicks")
  ) || 0;



// ELEMENTOS

const productsContainer =
  document.getElementById("products");

const categoriesContainer =
  document.getElementById("categories");

const searchInput =
  document.getElementById("search");

const productForm =
  document.getElementById("productForm");



// GUARDAR PRODUCTOS

function saveProducts() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(products)
  );

}



// ESCAPAR HTML

function escapeHTML(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}



// URL SEGURA

function safeURL(url) {

  try {

    const parsed =
      new URL(url);

    if (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:"
    ) {

      return parsed.href;

    }

  } catch (error) {}

  return "#";

}



// MOSTRAR CATEGORÍAS

function renderCategories() {

  const categories = [

    "Todos",

    ...new Set(
      products.map(
        product => product.category
      )
    )

  ];


  categoriesContainer.innerHTML =
    categories.map(category => {

      return `

        <button
          class="category
          ${category === selectedCategory
            ? "active"
            : ""}"

          onclick="selectCategory('${category}')"
        >

          ${escapeHTML(category)}

        </button>

      `;

    }).join("");

}



// MOSTRAR PRODUCTOS

function renderProducts() {

  const search =
    searchInput.value
      .toLowerCase()
      .trim();


  const filteredProducts =
    products.filter(product => {

      const matchesCategory =
        selectedCategory === "Todos" ||
        product.category === selectedCategory;


      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search);


      return (
        matchesCategory &&
        matchesSearch
      );

    });


  if (filteredProducts.length === 0) {

    productsContainer.innerHTML = `

      <p>
        No encontramos productos.
      </p>

    `;

    return;

  }


  productsContainer.innerHTML =
    filteredProducts.map(product => {

      return `

        <article class="product">

          <div class="product-image">

            ${escapeHTML(
              product.emoji || "🛍️"
            )}

          </div>


          <div class="product-info">

            <h3>
              ${escapeHTML(product.name)}
            </h3>


            <p>
              ${escapeHTML(product.category)}
            </p>


            <div class="price">

              ${escapeHTML(
                product.price || "Consultar"
              )}

            </div>


            <a

              class="button"

              href="${safeURL(product.url)}"

              target="_blank"

              rel="nofollow sponsored noopener"

              onclick="registerClick()"

            >

              Ver oferta

            </a>

          </div>

        </article>

      `;

    }).join("");

}



// CATEGORÍA

function selectCategory(category) {

  selectedCategory =
    category;

  renderCategories();

  renderProducts();

}



// REGISTRAR CLIC

function registerClick() {

  clicks++;

  localStorage.setItem(
    "ganasmart_clicks",
    clicks
  );


  document.getElementById(
    "clickCount"
  ).textContent = clicks;

}



// AGREGAR PRODUCTO

productForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const name =
      document
        .getElementById("name")
        .value
        .trim();


    const price =
      document
        .getElementById("price")
        .value
        .trim();


    const category =
      document
        .getElementById("category")
        .value;


    const emoji =
      document
        .getElementById("emoji")
        .value
        .trim();


    const url =
      document
        .getElementById("affiliateUrl")
        .value
        .trim();


    if (!url.startsWith("http://") &&
        !url.startsWith("https://")) {

      alert(
        "El enlace debe comenzar con http:// o https://"
      );

      return;

    }


    const newProduct = {

      id: Date.now(),

      name: name,

      price:
        price || "Consultar",

      category:

        category,

      emoji:

        emoji || "🛍️",

      url:

        url

    };


    products.unshift(
      newProduct
    );


    saveProducts();


    productForm.reset();


    selectedCategory =
      "Todos";


    render();


    alert(
      "Producto agregado correctamente."
    );

  }
);



// BUSCADOR

searchInput.addEventListener(
  "input",
  renderProducts
);



// RENDER PRINCIPAL

function render() {

  renderCategories();

  renderProducts();


  document.getElementById(
    "productCount"
  ).textContent =
    products.length;


  document.getElementById(
    "clickCount"
  ).textContent =
    clicks;

}


render();
