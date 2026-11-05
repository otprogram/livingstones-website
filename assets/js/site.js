// Mobile menu, active nav item, form return URLs, copy-to-clipboard.
(function () {
  var t = document.querySelector('.nav-toggle'), nav = document.getElementById('nav');
  if (t) t.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    t.setAttribute('aria-expanded', open);
  });
  var page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    if (a.dataset.nav === page) a.classList.add('active');
  });
  // After a form is sent, FormSubmit returns the visitor to our thank-you page.
  var thanks = new URL(document.querySelector('.logo').getAttribute('href') + 'thanks/', location.href).href;
  document.querySelectorAll('input[name="_next"]').forEach(function (i) { i.value = thanks; });
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      navigator.clipboard.writeText(b.dataset.copy.replace(/\s/g, '')).then(function () {
        var old = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1500);
      });
    });
  });
})();
