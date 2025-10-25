// ----- Variables globales y carga inicial -----

// Objeto global del carrito (productId -> { name, price, qty })
let cart = {};

// Cargar carrito guardado en localStorage si existe
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
}

// Actualizar contador de carrito en navbar
function updateCartCount() {
    $('#cart-count').css('font-weight', 'normal');
    let count = 0;
    for (let id in cart) {
        count += cart[id].qty;
    }
    if (count > 0) {
        $('#cart-count').css('font-weight', 'bold');
    }
    $('#cart-count').text(count);
}
// Llamar una vez al cargar para reflejar si había algo en el carrito
updateCartCount();

// ----- Funcionalidad: Agregar al carrito -----

$('.add-to-cart').on('click', function () {
    // Obtener datos del producto desde atributos data
    let productId = $(this).data('id');
    let name = $(this).data('name');
    let price = parseFloat($(this).data('price'));

    // Actualizar el objeto carrito
    if (cart[productId]) {
        // Si ya existe, aumentar la cantidad
        cart[productId].qty += 1;
    } else {
        // Si no existe, agregar nuevo producto con qty 1
        cart[productId] = {
            name: name,
            price: price,
            qty: 1
        };
    }

    // Guardar carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    // Actualizar el contador en la navbar
    updateCartCount();
    // Mostrar mensaje de confirmación (fade in/out)
    $('#add-to-cart-msg').fadeIn().delay(1000).fadeOut();
});



// ----- Funcionalidad: Renderizar carrito en la página Cart -----

function renderCartItems() {
    let $cartItems = $('#cart-items');
    if ($cartItems.length === 0) {
        // Si no estamos en cart.html, no hacer nada
        return;
    }
    $cartItems.empty();
    let total = 0;
    let countItems = 0;
    for (let id in cart) {
        let item = cart[id];
        let name = item.name;
        let price = item.price;
        let qty = item.qty;
        let subtotal = price * qty;
        total += subtotal;
        countItems += qty;
        // Fila de tabla para el producto
        let row = `
      <tr>
        <td>${name}</td>
        <td class="text-end">$ ${price}</td>
        <td class="text-center">${qty}</td>
        <td class="text-end">$ ${subtotal}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-danger remove-item" data-id="${id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>`;
        $cartItems.append(row);
    }
    // Actualizar total
    $('#totalPrecioCarrito').text(total);
    // Mostrar mensaje "carrito vacío" si corresponde
    if (countItems === 0) {
        $('#empty-cart-msg').show();
    } else {
        $('#empty-cart-msg').hide();
    }
}

// Llamar a renderCartItems() una vez al cargar la página (si estamos en cart.html)
renderCartItems();

// ----- Funcionalidad: Eliminar item del carrito -----

$(document).on('click', '.remove-item', function () {
    let productId = $(this).data('id');
    // Eliminar del objeto carrito
    if (cart[productId]) {
        delete cart[productId];
    }
    // Guardar cambios en storage
    localStorage.setItem('cart', JSON.stringify(cart));
    // Re-renderizar la lista
    renderCartItems();
    // Actualizar contador en navbar
    updateCartCount();
});

// ----- Funcionalidad: Finalizar compra (vaciar carrito) -----

$('#finalizarPedido').on('click', function () {
    // Si el carrito está vacío, avisar, si no, proceder
    if ($.isEmptyObject(cart)) {
        alert('El carrito está vacío.');
    } else {
        alert('¡Compra finalizada! Gracias por tu compra.');
        // Vaciar carrito
        cart = {};
        localStorage.removeItem('cart');
        // Actualizar UI
        updateCartCount();
        renderCartItems();
    }
});

// ----- Funcionalidad: Envío de Formulario de Contacto -----

$('#contact-form').on('submit', function (e) {
    console.log("Entro al metodo")
    e.preventDefault();
    // Obtener y limpiar valores
    console.log("Entro al metodo")
    let name = $('#name').val().trim();
    let email = $('#email').val().trim();
    let message = $('#message').val().trim();
    // Validar campos vacíos
    if (name === '' || email === '' || message === '') {
        $('#form-status').text('Por favor, completa todos los campos.').css('color', 'red');
        return;
    }
    // (Podríamos validar formato de email aquí si es necesario)
    // Si validación pasa, mostrar mensaje de éxito
    $('#form-status').text('¡Gracias ' + name + '! Tu mensaje ha sido enviado.').css('color', 'green');
    // Resetear formulario
    $(this)[0].reset();
});

// === Chatbot Widget === 
(function (){
  //1. Url del Space
  const CHATBOT_URL = "https://miguelvegaramirez-chatboot.hf.space";
  //2. Botón "Abrir en nueva pestaña"
  const openNew = document.getElementById('chatbotOpenNew');
  if(openNew) openNew.setAttribute('href', CHATBOT_URL);
  //3. Carga del iframe
  const offcanvasEl = document.getElementById('chatbotOffcanvas');
  if(offcanvasEl){
    offcanvasEl.addEventListener('show.bs.offcanvas', function(){
      const frame = document.getElementById('chatbotFrame');
      if(frame && !frame.getAttribute('src')){
        frame.setAttribute('src', CHATBOT_URL);
      }
    });
  }
})();
