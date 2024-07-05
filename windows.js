let windows = {}

function stopAllDrag(event) {
    Object.keys(windows).forEach((key) => {
        windows[key].stopDrag(event);
    });
}
window.addEventListener("mouseup", stopAllDrag);
window.addEventListener("mousemove", (event) => {
    Object.keys(windows).forEach((key) => {
        windows[key].onMove(event);
    })
});
// window.addEventListener("mouseout", stopAllDrag)

function Window(id) {
    const WINDOW = document.createElement("div");
    WINDOW.id = id; WINDOW.className = "window-container";
    WINDOW.innerHTML = `
        <div class="window-header">
            Test
            <div class="window-controls">
                <button>-</button>
                <button>◻</button>
                <button>×</button>
            </div>
        </div>
        <div class="window-content">
            Hi
        </div>`;
    const HEADER = WINDOW.querySelector(`.window-header`);

    let deltaX = 0; let deltaY = 0;
    let windowX = 30; let windowY = 30;
    let dragging = false;

    HEADER.addEventListener("mousedown", (event) => {
        console.log(id)
        if (dragging) {
            dragging = false;
            return;
        }
        if (event.button != 0) return; // if user doesn't left click, he isn't trying to drag you dipshit
        deltaX = windowX - event.clientX;
        deltaY = windowY - event.clientY;
        dragging = true;
    });

    function onMove(event) {
        if (!dragging) return;
        windowX = event.clientX + deltaX;
        windowY = Math.max(0, event.clientY + deltaY);
        updatePosition();
    }
    function stopDrag(event) {
        if (event.button != 0 || !dragging) return;
        dragging = false;
    }
    function updatePosition() {
        WINDOW.style.top = `${windowY}px`;
        WINDOW.style.left = `${windowX}px`;
    }
    
    updatePosition();
    const OBJECT = {onMove, stopDrag};
    windows[id] = OBJECT;
    document.body.appendChild(WINDOW);
    return OBJECT;
}