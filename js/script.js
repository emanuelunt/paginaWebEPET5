document.addEventListener('DOMContentLoaded', function () {
    var currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    var menuToggle = document.getElementById('menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            var isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));
            mobileMenu.classList.toggle('hidden', isExpanded);
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.add('hidden');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    document.querySelectorAll('[data-epet-carousel]').forEach(function (carousel) {
        var slides = Array.from(carousel.querySelectorAll('.epet-carousel__slide'));
        var previous = carousel.querySelector('[data-carousel-previous]');
        var next = carousel.querySelector('[data-carousel-next]');
        var controls = carousel.querySelector('[data-carousel-controls]');
        var status = carousel.querySelector('[data-carousel-status]');
        var activeIndex = slides.findIndex(function (slide) {
            return slide.classList.contains('is-active');
        });

        if (slides.length < 2 || !previous || !next || !controls) return;
        if (activeIndex < 0) activeIndex = 0;

        var dots = slides.map(function (_, index) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'epet-carousel__dot';
            dot.setAttribute('aria-label', 'Mostrar imagen ' + (index + 1) + ' de ' + slides.length);
            dot.addEventListener('click', function () { showSlide(index); });
            controls.appendChild(dot);
            return dot;
        });

        function showSlide(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                var isActive = slideIndex === activeIndex;
                slide.classList.toggle('is-active', isActive);
                slide.setAttribute('aria-hidden', String(!isActive));
            });
            dots.forEach(function (dot, dotIndex) {
                if (dotIndex === activeIndex) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
            if (status) status.textContent = 'Imagen ' + (activeIndex + 1) + ' de ' + slides.length;
        }

        previous.addEventListener('click', function () { showSlide(activeIndex - 1); });
        next.addEventListener('click', function () { showSlide(activeIndex + 1); });

        var touchStartX = null;
        var stage = carousel.querySelector('.epet-carousel__stage');
        if (stage) {
            stage.addEventListener('touchstart', function (event) {
                if (event.changedTouches.length) touchStartX = event.changedTouches[0].clientX;
            }, { passive: true });
            stage.addEventListener('touchend', function (event) {
                if (touchStartX === null || !event.changedTouches.length) return;
                var distance = event.changedTouches[0].clientX - touchStartX;
                if (Math.abs(distance) > 48) showSlide(activeIndex + (distance < 0 ? 1 : -1));
                touchStartX = null;
            }, { passive: true });
        }

        showSlide(activeIndex);
    });

    var targetDateNode = document.getElementById('target-date');
    var daysNode = document.getElementById('days');
    var hoursNode = document.getElementById('hours');
    var minutesNode = document.getElementById('minutes');
    var secondsNode = document.getElementById('seconds');

    if (!(targetDateNode && daysNode && hoursNode && minutesNode && secondsNode)) {
        return;
    }

    var targetDate = new Date('2025-09-13T08:00:00-03:00');
    targetDateNode.textContent += targetDate.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    var countdown = setInterval(function () {
        var now = new Date().getTime();
        var distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdown);
            var countdownContainer = document.querySelector('.countdown-container');
            if (countdownContainer) {
                countdownContainer.innerHTML = '<div class="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700">El evento ha comenzado.</div>';
            }
            return;
        }

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysNode.textContent = String(days).padStart(2, '0');
        hoursNode.textContent = String(hours).padStart(2, '0');
        minutesNode.textContent = String(minutes).padStart(2, '0');
        secondsNode.textContent = String(seconds).padStart(2, '0');
    }, 1000);
});
