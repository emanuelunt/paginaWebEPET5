document.addEventListener('DOMContentLoaded', function () {
    var currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    var menuToggle = document.getElementById('menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.add('hidden');
            });
        });
    }

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
