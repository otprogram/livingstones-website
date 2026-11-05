// PayPal donation buttons. Orders are created in the browser with the public client ID; no server needed.
(function () {
  var input = document.getElementById('pp-amount'), msg = document.getElementById('pp-msg');
  document.querySelectorAll('.amounts button').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.amounts button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on'); input.value = b.dataset.amount; msg.textContent = '';
    });
  });
  input.addEventListener('input', function () {
    document.querySelectorAll('.amounts button').forEach(function (x) { x.classList.toggle('on', x.dataset.amount === input.value.trim()); });
  });
  function amount() {
    var v = parseFloat(String(input.value).replace(/[^0-9.,]/g, '').replace(',', '.'));
    return v >= 1 ? v.toFixed(2) : null;
  }
  if (!window.paypal) { msg.textContent = 'PayPal could not be loaded. Please use the bank transfer details below.'; return; }
  paypal.Buttons({
    style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'donate' },
    onClick: function (data, actions) {
      if (!amount()) { msg.textContent = 'Please enter an amount of at least CHF 1.'; return actions.reject(); }
      msg.textContent = ''; return actions.resolve();
    },
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{ description: 'Donation to LivingStones Association', amount: { currency_code: 'CHF', value: amount() } }],
        application_context: { shipping_preference: 'NO_SHIPPING', brand_name: 'LivingStones Association' }
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (d) {
        var name = d.payer && d.payer.name ? ' ' + d.payer.name.given_name : '';
        document.getElementById('paypal-buttons').innerHTML = '';
        msg.textContent = 'Thank you' + name + '! Your donation of CHF ' + amount() + ' was received.';
      });
    },
    onError: function () { msg.textContent = 'Something went wrong with PayPal. Please try again or use the bank transfer details below.'; }
  }).render('#paypal-buttons');
})();
