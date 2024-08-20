const delay = ms => new Promise(res => setTimeout(res, ms));

let windows = {}
let windowsCount = {}

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

function addNewWindowInTaskbar(id, window) {
    document.getElementById("tasks").innerHTML += `<button class="col-2 task" id="${id}_task">${window.name}</button>`;
    document.querySelector(`#tasks #${id}_task`).addEventListener("click", () => {
        window.toggleMinimize();
    });
}

function Window(id, name = "Window") {
    if (windowsCount[id] !== undefined) {
        windowsCount[id]++;
    }
    else {
        windowsCount[id] = 1;
    }

    const actualId = `${id}_${windowsCount[id]}`;

    const WINDOW = document.createElement("div");
    WINDOW.id = actualId; WINDOW.className = "window-container";
    WINDOW.innerHTML = `
        <div class="window-header">
            ${name}
            <div class="window-controls">
                <button class="minimize-button">-</button>
                <!-- <button class="maximize-button">□</button> -->
                <button class="close-button">×</button>
            </div>
        </div>
        <div class="window-content container p-0">
            Hey, the developer of this app didn't remove this text; so hi.
        </div>`;
    const HEADER = WINDOW.querySelector(".window-header");
    const CONTENT = WINDOW.querySelector(".window-content");

    let deltaX = 0; let deltaY = 0;
    let windowX = 20 + 30 * windowsCount[id];
    let windowY = 20 + 30 * windowsCount[id];
    let dragging = false;

    HEADER.addEventListener("mousedown", (event) => {
        console.log(WINDOW.id)
        if (dragging) {
            dragging = false;
            return;
        }
        if (event.button != 0) return; // if user doesn't left click, he isn't trying to drag you dipshit
        deltaX = windowX - event.clientX;
        deltaY = windowY - event.clientY;
        dragging = true;
    });

    function close() {
        windowsCount[id]--;
        WINDOW.remove();
        document.querySelector(`#tasks #${actualId}_task`).remove();
    }
    function toggleMinimize() {
        WINDOW.classList.toggle("minimized");
    }

    HEADER.querySelector(".close-button").addEventListener("click", close);
    HEADER.querySelector(".minimize-button").addEventListener("click", toggleMinimize);

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
    function setSize(width, height) {
        WINDOW.style.width = `${width}px`;
        WINDOW.style.height = `${height}px`;
    }
    
    updatePosition();
    const OBJECT = {onMove, stopDrag, setSize, close, toggleMinimize, name, WINDOW, HEADER, CONTENT};
    addNewWindowInTaskbar(actualId, OBJECT);
    windows[actualId] = OBJECT;
    document.body.appendChild(WINDOW);

    return OBJECT;
}

function ErrorMessage(message, height = 155, iconId) {
    const WINDOW = new Window("error", "Alert");
    WINDOW.setSize(450, height);
    WINDOW.CONTENT.innerHTML = `
        <div class="p-3 row">
            <div class="col-2">
            </div>
            <div class="col">
                <p>${message}</p>
                <button>Okay</button>
            </div>
        </div>
    `;
    WINDOW.CONTENT.querySelector("button").addEventListener("click", WINDOW.close);
}

urls = {
    "wexp://errpage": "./browsererror.html",
    "roogle.wvg": "./sites/roogle.html",
    "maz3d.wvg": "https://jessewithoutani.github.io/raycasting-demo/",
    "xhub.wvg": "./sites/nonosite.html",
    "rebay.wvg": "./sites/rebay.html"
}

function WebExplorer() {
    const WINDOW = new Window("web-explorer", "Web Explorer v0.1");
    WINDOW.setSize(1000, 625);

    WINDOW.CONTENT.innerHTML = `
        <form class="container row w-100 p-1">
            <div class="col-1">
                Address:
            </div>
            <div class="col">
                <input type="text" class="w-100" placeholder="Enter address here..." id="url-bar" autocomplete="off">
            </div>
            <div class="col-1">
                <button class="w-100" type="submit">Go</button>
            </div>
        </form>
        <hr class="m-0">
        <div class="container row w-100 p-1">
            <div class="col">
                Bookmarks:&nbsp;&nbsp;&nbsp;
                <a href="#" id="roogle-bookmark">Roogle Search</a>&nbsp;&nbsp;&nbsp;
                <a href="#" id="rebay-bookmark">Rebay</a>&nbsp;&nbsp;&nbsp;
            </div>
        </div>
        <hr class="m-0">
        <iframe src="" style="background: #fff; height: calc(100% - 18px * 2 - 1.6px * 2 - 35px); box-sizing: border-box;" class="container"></iframe>
    `;
    WINDOW.CONTENT.querySelector("#roogle-bookmark").addEventListener("click", () => { renderPage("roogle.wvg"); });
    WINDOW.CONTENT.querySelector("#rebay-bookmark").addEventListener("click", () => { renderPage("rebay.wvg"); });

    WINDOW.CONTENT.querySelector("form").addEventListener("submit", (event) => {
        const url = WINDOW.CONTENT.querySelector("#url-bar").value;
        event.preventDefault();

        if (!(url in urls)) {
            renderPage("wexp://errpage");
            return;
        }

        renderPage(url);
    })

    function renderPage(url) {
        WINDOW.CONTENT.querySelector("iframe").src = urls[url];
        WINDOW.CONTENT.querySelector("#url-bar").value = url;
    }
    renderPage("roogle.wvg");
    return WINDOW;
}

function Notepad() {
    const WINDOW = new Window("notepad", "Word VG Edition");
    WINDOW.setSize(700, 560);
    WINDOW.CONTENT.innerHTML = `
        <div class="container row w-100 p-1">
            <div class="col">
                Tools:&nbsp;
                <button id="save-document">Save Document</button>&nbsp;
                Font:&nbsp;
                <button id="font">Trebuchet MS</button>&nbsp;|&nbsp;
                <button class="unable-format"><b>B</b></button>&nbsp;
                <button class="unable-format"><i>i</i></button>&nbsp;
                <button class="unable-format"><u>U</u></button>&nbsp;
            </div>
        </div>
        <hr class="m-0">
        <textarea style="width: 100%; height: 100%; resize: none; height: calc(100% - 18px - 1.6px - 15px);" class="p-5"></textarea>
    `;
    WINDOW.CONTENT.querySelector("#save-document").addEventListener("click", () => {new ErrorMessage("Word was unable to save your document because you stink.")});
    WINDOW.CONTENT.querySelector("#font").addEventListener("click", () => {new ErrorMessage("Unable to load fonts")});
    WINDOW.CONTENT.querySelectorAll(".unable-format").forEach(element => {
        element.addEventListener("click", async function () {
            for (let i = 0; i < 3 + Math.random() * 4; i++) {
                new ErrorMessage(
                    `Word has made ${Math.ceil(Math.random() * 50000)} illegal operations and is unable to complete your request`, 185);
                await delay(100);
            }
        });
    });
    return WINDOW;
}

function Terminal() {
    const WINDOW = new Window("terminal", "Command Prompt");
    WINDOW.setSize(700, 560);
    WINDOW.CONTENT.innerHTML = `
        <div style="width: 100%; height: 100%; resize: none; height: 100%;" id="terminal-content">
        Micosoft Windows VG [Version 10.0.1342388.859]<br>
        (c) Micosoft Corporation. All rights reserved.<br><br>
        <span id="output"></span>
        >&nbsp;
        <form style="display: inline-block;" class="w-75">
            <input id="terminal-input" placeholder="Click to start typing..." class="w-100" autocomplete="off">
        </form>
        </div>
    `;
    const input = WINDOW.CONTENT.querySelector("input");
    const output = WINDOW.CONTENT.querySelector("#output");

    WINDOW.CONTENT.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault();
        const value = input.value;
        output.innerText += `>  ${value}\n`;
        input.value = "";

        if (value == "netstat") {
            output.innerText += "Viewing active connections...\n\n";
            for (let i = 0; i < 5 + Math.random() * 5; i++) {
                output.innerText += `126.0.0.1:${10000 + Math.ceil(Math.random() * 40000)} -> ESTABLISHED\n`;
            }
            output.innerText += "\n";
        }
        else if (value == "tree") {
            output.innerText += `A tree has been ordered for delivery! [Order ID: 0x${10000 + Math.ceil(Math.random() * 80000)}]\n\n`;
        }
        else {
            output.innerText += `Bad or invalid command. Did you mean 'wipesystem'?\n`;
        }
    })

    return WINDOW;
}