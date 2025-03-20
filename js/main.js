let collectedLeaves = 0;
let maxLeaves = 15;
let upgrades = {
    speed: 0.5,
    basket: 1,
    extraLeaves: false,
    double: false
};
let gamePaused = false;
let extraLeavesActive = false;
let doubleActive = false;
let basketUpgradeCost = 15;

function createLeaf() {
    const leaf = document.createElement("img");
    leaf.classList.add("leaf");

    const isGreen = Math.random() > (extraLeavesActive ? 0.2 : 0.3);
    leaf.src = isGreen ? "./img/green.png" : "./img/red.png";
    leaf.style.left = Math.random() * (window.innerWidth - 40) + "px";

    document.getElementById("game-area").appendChild(leaf);

    leaf.addEventListener("click", () => {
        if (collectedLeaves < maxLeaves) {
            collectLeaf(leaf, isGreen);
        } else if (isGreen) {
            showNotification("Корзина переполнена! Освободите место!");
        }
    });

    let pos = 0;
    const speed = 0.1 + upgrades.speed;

    function fall() {
        if (!gamePaused) {
            pos += speed;
            leaf.style.top = `${pos}px`;

            if (pos < window.innerHeight - 120) {
                requestAnimationFrame(fall);
            } else {
                leaf.remove();
            }
        } else {
            requestAnimationFrame(fall);
        }
    }

    fall();
}

function collectLeaf(leaf, isGreen) {
    if (isGreen) {
        collectedLeaves += doubleActive ? 2 : 1;
    } else {
        collectedLeaves = Math.max(0, collectedLeaves - 3);
        showNotification("Красный лист! Потеряно 3 листика!");
    }
    updateCollectedCount();
    leaf.remove();
}

function updateCollectedCount() {
    document.getElementById("collected-count").innerText = `🍃: ${Math.floor(collectedLeaves)} / ${maxLeaves}`;
}

function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerText = message;
    document.getElementById("notifications").appendChild(notification);

    setTimeout(() => notification.remove(), 2000);
}

function openShop() {
    gamePaused = true;
    document.getElementById("shop-modal").style.display = "block";
}

function closeShop() {
    gamePaused = false;
    document.getElementById("shop-modal").style.display = "none";
}

function buyUpgrade(upgrade) {
    const cost = {
        basket: basketUpgradeCost,
        speed: 15 * 5 ** (Math.floor(upgrades.speed) - 1),
        extraLeaves: 30,
        double: 50
    };

    if (collectedLeaves >= cost[upgrade]) {
        collectedLeaves -= cost[upgrade];

        if (upgrade === "basket") {
            maxLeaves += 5;
            basketUpgradeCost += 5;  // Увеличиваем стоимость на 5 после каждой покупки
            document.getElementById("basket-cost").innerText = basketUpgradeCost;
        }

        if (upgrade === "speed") {
            upgrades.speed += 1;
            document.getElementById("speed-level").innerText = upgrades.speed;  // Убрали Math.floor
            document.getElementById("speed-cost").innerText = 30 * 1 ** (upgrades.speed - 1);  // Скорректировано
        }

        if (upgrade === "extraLeaves") {
            extraLeavesActive = true;
            setTimeout(() => extraLeavesActive = false, 30000);
        }

        if (upgrade === "double") {
            doubleActive = true;
            setTimeout(() => doubleActive = false, 15000);
        }

        updateCollectedCount();
    } else {
        showNotification("Недостаточно листиков для покупки!");
    }
}

function dropLeaf() {
    const leaf = document.createElement("img");
    leaf.src = Math.random() < 0.5 ? "img/green.png" : "img/red.png";
    leaf.className = "leaf";
    leaf.style.left = `${Math.random() * window.innerWidth}px`;
    leaf.style.top = "-40px";
    document.body.appendChild(leaf);

    let fallingSpeed = 0.1 * upgrades.speed;

    function falling() {
        leaf.style.top = `${parseFloat(leaf.style.top) + fallingSpeed}px`;

        // Если ширина экрана меньше 768px (мобильное устройство), листья пропадают на 60% высоты экрана
        const threshold = window.innerWidth < 768 ? 0.6 : 0.8;

        if (parseFloat(leaf.style.top) > window.innerHeight * threshold) {
            leaf.remove();
        } else {
            requestAnimationFrame(falling);
        }
    }

    leaf.onclick = () => collectLeaf(leaf);
    falling();
}

setInterval(() => {
    if (!gamePaused) createLeaf();
}, 1000);
