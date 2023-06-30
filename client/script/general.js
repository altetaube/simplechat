const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function detectColorScheme() {
    let theme = "light";    //default to light
    let oldTheme = localStorage.getItem("theme")
    console.log("local-storage:", oldTheme);
    //local storage is used to override OS theme settings
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") === "dark") {
            theme = "dark";
        }
        if (localStorage.getItem("theme") === "high-contrast") {
            theme = "high-contrast";
        }
    } else if (!window.matchMedia) {
        //matchMedia method not supported
        return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //OS theme setting detected as dark
        theme = "dark";
    }
    if (window.matchMedia("(prefers-contrast: more)").matches) {
        console.log("High-Contrast");
        // Future Feature
        // theme = "high-contrast"
    }
    console.log("detected: ", theme)
    
    //dark theme preferred, set document with a `data-theme` attribute
    localStorage.setItem("theme", theme)
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
    } else if (theme === "high-contrast") {
        // Future Feature
        // document.documentElement.setAttribute("data-theme", "high-contrast")
    }
}

function changeColorScheme() {
    let oldTheme = document.documentElement.getAttribute("data-theme");
    let theme = "light";
    if (oldTheme === "dark") {
        console.log("dark")
        theme = "light";
    } else if (oldTheme === "light") {
        theme = "dark";
    }
    localStorage.setItem("theme", theme)
    document.documentElement.setAttribute("data-theme", theme);
}

mediaQuery.addEventListener('change', () => {
    localStorage.removeItem("theme");
    detectColorScheme()
});
detectColorScheme();

function getCookie(name) {
    const value = `; ${ document.cookie }`;
    const parts = value.split(`; ${ name }=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function logout() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
}

function toggleChatOverview(event) {
    const chatOverview = document.querySelector('.chat-overview-wrapper')
    const openedChatId = localStorage.getItem("openedChat");

    if (!chatOverview || !openedChatId) return
    const type = getChatNodeById(openedChatId).getAttribute("chattype");
    // TODO change overview by type group <-> user
    
    let attr = chatOverview.getAttribute('data-overview-open')
    attr = (attr === 'true') ? 'false' : 'true'
    chatOverview.setAttribute('data-overview-open', attr)
    
    if (event.target.hasAttribute("data-selected"))
        event.target.removeAttribute("data-selected")
    else
        event.target.setAttribute("data-selected", "")

    chat_get_group_users(socket, openedChatId);
}