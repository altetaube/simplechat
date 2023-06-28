const socket = new WebSocket(location.origin.replace(/^http/, 'ws'));

const chatMessageAmount = 10;


socket.sendEvent = (eventName, eventData) => {
    const message = {
        event: eventName,
        data: eventData,
    };
    socket.send(JSON.stringify(message));
}

const fileName = location.href.split("/").slice(-1)

socket.onopen = function () {
    if (fileName == "dashboard") {
        socket.sendEvent("fetchChats", "");
    }
};

function loginUser(data) {
    if (data.status) {
        const result = getValues()
        document.cookie = "username= " + result.username + ";";
        document.cookie = "password= " + result.password + ";secure";
        window.location.href = "/dashboard";
    }
}

function buildChatOverview(chats) {
    chats.forEach(data => {

        const navigator = document.createElement("div");
        navigator.classList.add("chat-contact");
        navigator.onclick = () => {
            if (data.type === "user") injectPage("../subpages/dashboard/chat.html");
            else injectPage("../subpages/dashboard/group.html");
            TESTBUILDCHATMESSAGES();
            // chat_clicked(data.chatID);
        }

        const icon = document.createElement("i");
        icon.classList.add("fas", data.type === "user" ? "fa-user" : "fa-users");
        navigator.appendChild(icon);

        const name = document.createElement("p");
        name.innerHTML = data.name;
        navigator.appendChild(name);

        document.getElementById("chats").appendChild(navigator);
    });
}

function TESTBUILDCHATMESSAGES() {
    let testdata = [
        {
            message: "message",
            timestamp: "12 nov 2003 17:01",
            readConfirmation: true,
            author: "Honulullu"
        },
        {
            message: "answer",
            timestamp: "13 nov 2003 17:01",
            readConfirmation: true,
            author: "self"
        },
        {
            message: "some other message",
            timestamp: "28 jun 2023 18:00",
            readConfirmation: true,
            author: "Honulullu"
        },
        {
            message: "some other message",
            timestamp: "28 jun 2023 19:00",
            readConfirmation: true,
            author: "Honulullu"
        },
    ]
    // try {
    //     buildChatMessages(testdata, true);
    // } catch (e) {
    //     setTimeout(() => buildChatMessages(testdata, true), 1000);
    // }
    setTimeout(() => buildChatMessages(testdata, true), 10);

}

function buildChatMessages(chatMessages, group) {
    const chatBox = document.createElement("div");
    chatBox.id = "chat-box";
    let lastAuthor;
    chatMessages.forEach(data => {
        console.log(data);
        const chatElement = document.createElement("div");
        chatElement.classList.add("chat-element");
        chatElement.classList.add(data.author === "self" ? "chat-element-right" : "chat-element-left");

        if (group === true && lastAuthor !== data.author) {
            if (data.author !== "self") {
                const senderElement = document.createElement("span");
                senderElement.classList.add("sender");
                senderElement.innerHTML = data.author;
                chatElement.appendChild(senderElement);
            }
            lastAuthor = data.author;
        }


        const messageElement = document.createElement("p");
        messageElement.innerHTML = data.message;
        chatElement.appendChild(messageElement);

        const timeElement = document.createElement("span");
        let messageDate = new Date(data.timestamp); // bspw: "28 Jun 2023 18:50:59"
        let timeDifference = Math.floor((Date.now() - messageDate.valueOf()) / 1000 / 60)
        if (timeDifference < 15) {
            timeElement.innerHTML = timeDifference.toString() + "min ago";
        } else if (timeDifference < 60 * 24) {
            timeElement.innerHTML = `${messageDate.getHours()}:${messageDate.getMinutes()}`
            timeElement.innerHTML = messageDate.toLocaleTimeString("en-UK", {hour: '2-digit', minute: '2-digit'});
        } else {
            timeElement.innerHTML = messageDate.toLocaleString();
        }
        timeElement.classList.add("subtitle");
        chatElement.appendChild(timeElement);

        // TODO style and insert read indicator
        const readIndicator = document.createElement("span");
        readIndicator.innerHTML = "READELEMENT";
        // chatElement.appendChild(readIndicator);

        chatBox.appendChild(chatElement);
    });
    // document.getElementById("chat")
    let a = document.getElementById("chat-box");
    document.getElementById("chat-box").replaceWith(chatBox);
}

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    switch (data.event) {
        case 'login':
            loginUser(data);
            break;
        case 'fetchChats':
            try {
                buildChatOverview(data.chats);
            } catch (e) { // if the element is not yet loaded
                setTimeout(() => buildChatOverview(data.chats), 1000);
            }
            break;
        case 'chatMessages':
            try {
                buildChatMessages(data.content, data.isgroup)
            } catch (e) {
                setTimeout(() => buildChatMessages(data.chats, data.isgroup), 1000);
            }
    }
};

socket.onclose = function (event) {
};

function getValues() {
    let usr = document.getElementById("usr").value;
    let pwd = document.getElementById("pwd").value;
    let pwdElement = document.getElementById("pwd-check");

    // further client side checking
    if (usr === "" || pwd === "" || (pwdElement && pwdElement.value === "")) {
        pwdError("Please fill in the missing fields!")
        return null;
    }

    if (
        !(
            pwd.match(/[a-z]/g) &&
            pwd.match(/[A-Z]/g) &&
            pwd.match(/[0-9]/g) &&
            pwd.match(/\W/g) &&
            pwd.length >= 8
        )
    ) {
        pwdError("Password must at least 8 characters and upper- and lowercase character, " +
            "number and a special character");
        return null;
    }
    if (pwdElement && pwdElement.value !== pwd) {
        pwdError("Passwords doesn't match");
        return null;
    }
    pwdError("OK");
    return {
        username: usr,
        password: pwd
    };
}

function pwdError(errorMessage) {
    document.getElementById("pwdError").innerHTML = errorMessage;

}

function loginRequest() {
    const result = getValues()
    if (result === null) {
        console.log("Not in format")
        return;
    }

    socket.sendEvent('login', {username: result.username, password: result.password})
}

function chat_clicked(socket, chatId) {
    console.log("selected chat: ", chatId)
    socket.sendEvent('fetch-chat-message', {
        chatID: chatId,
        start: 0,
        amount: chatMessageAmount
    });
}

function chat_scrolled(socket, chatId) {
    let times = 2;
    socket.sendEvent('fetch-chat-message', {
        chatID: chatId,
        start: (chatMessageAmount * times),
        amount: (chatMessageAmount * (times + 1))
    });
}

function chat_overview(socket) {
    socket.sendEvent('fetchChats', {})
}