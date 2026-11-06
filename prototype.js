const grid = document.querySelector('.art-grid');
const tiles = Array.from(grid.querySelectorAll('.art-tile'));
let selected;
let hovered;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const rotationOrder = [2, 0, 4, 3, 1];
let rotationIndex = 0;
let rotationTimer;

function scheduleRotation() {
    clearTimeout(rotationTimer);
    if (hovered || selected ||
        motionPreference.matches || document.hidden || grid.contains(document.activeElement)) return;

    rotationTimer = setTimeout(() => {
        rotationIndex = (rotationIndex + 1) % rotationOrder.length;
        render();
    }, 4200);
}

function render() {
    const active = hovered || selected || tiles[rotationOrder[rotationIndex]];
    for (const tile of tiles) {
        tile.classList.toggle('is-active', tile === active);
        tile.setAttribute('aria-pressed', String(tile === selected));
    }
    scheduleRotation();
}

for (const tile of tiles) {
    tile.addEventListener('click', () => {
        selected = selected === tile ? undefined : tile;
        render();
    });
}
grid.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const tile = event.target.closest('.art-tile');
    if (tile && tile !== hovered) {
        hovered = tile;
        render();
    }
});
grid.addEventListener('pointerleave', () => {
    hovered = undefined;
    render();
});

grid.addEventListener('focusin', scheduleRotation);
grid.addEventListener('focusout', () => queueMicrotask(scheduleRotation));
document.addEventListener('visibilitychange', scheduleRotation);
motionPreference.addEventListener('change', render);
render();
