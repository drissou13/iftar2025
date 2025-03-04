document.addEventListener("DOMContentLoaded", function () {
    const iftarTimeElem = document.getElementById("iftar-time");
    const countdownElem = document.getElementById("countdown");

    function fetchIftarTime() {
        const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=Paris&country=France&method=2`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const maghrebTime = data.data.timings.Maghrib;
                iftarTimeElem.textContent = `🕒 ${maghrebTime}`;
                startCountdown(maghrebTime);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des horaires :", error);
                iftarTimeElem.textContent = "Impossible de charger l'heure.";
                countdownElem.textContent = "Erreur de connexion.";
            });
    }

    function startCountdown(iftarTime) {
        const now = new Date();
        const [hours, minutes] = iftarTime.split(":").map(Number);
        const iftarDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        function updateCountdown() {
            const currentTime = new Date();
            const timeDiff = iftarDate - currentTime;

            if (timeDiff > 0) {
                const h = Math.floor(timeDiff / 1000 / 60 / 60);
                const m = Math.floor((timeDiff / 1000 / 60) % 60);
                const s = Math.floor((timeDiff / 1000) % 60);
                countdownElem.textContent = `${h}h ${m}m ${s}s`;
                requestAnimationFrame(updateCountdown);
            } else {
                countdownElem.textContent = "🕌 C'est l'heure de l'Iftar !";
            }
        }

        updateCountdown();
    }

    function updateBackground() {
        const now = new Date();
        const hour = now.getHours();
        const body = document.body;

        if (hour >= 6 && hour < 12) {
            body.className = "morning"; // Matin
        } else if (hour >= 12 && hour < 18) {
            body.className = "afternoon"; // Après-midi
        } else {
            body.className = "evening"; // Soir
        }
    }

    function updatePage() {
        fetchIftarTime();
        updateBackground();
    }

    updatePage(); // Charger les infos au démarrage
});