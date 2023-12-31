// Attach DOM controls
let textsubmit = document.getElementById("textsubmit");
let textinput = document.getElementById("textinput");
let tempProfile = document.querySelector("#characterinput .sel div");
let tempName = document.querySelector("#characterinput .sel span");
let messagecontainer = document.getElementById("message-container");
let chats = [];
let lastUser = "Unknown", lastMinute = -6, lastHour;

// Handle message entering
function enterMessage() {
    let msg = textinput.innerText;
    textinput.innerText = "";
    // Make sure message isn't empty
    if (msg !== "") {

        // Update user if necessary
        let user;
        if (msg.indexOf(':') != -1) {
            user = msg.split(':', 2)[0];
            msg = msg.split(':', 2)[1];
        }
        else {
            user = lastUser;
        }

        // Add time if ncessary
        let date = new Date();
        if (date.getHours() != lastHour || date.getMinutes() >= lastMinute + 5 || user != lastUser) {
            lastHour = date.getHours();
            lastMinute = date.getMinutes();
            let timeString = `${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
            let HTMLtime = document.createElement("div");
            HTMLtime.className = "chat-time";
            HTMLtime.innerText = `${user}, ${timeString}`;
            messagecontainer.insertAdjacentElement("beforeend", HTMLtime);

            // Add user profile
            let HTMLuser = document.createElement("div");
            HTMLuser.className = "chat-profile";
            HTMLuser.innerText = user.substring(0,1);
            tempProfile.innerText = user.substring(0,1);
            tempName.innerText = user;
            messagecontainer.insertAdjacentElement("beforeend", HTMLuser);
            lastUser = user;
        }

        // Add chat bubble
        let HTMLmessage = document.createElement("div");
        HTMLmessage.className = "chat-bubble";
        HTMLmessage.innerText = msg;
        messagecontainer.insertAdjacentElement("beforeend", HTMLmessage).scrollIntoView();
        chats.push({ usr: user, msg: msg, hr: date.getHours(), min: date.getMinutes() });
        localStorage.setItem("chat", JSON.stringify({ chats: chats }));
    }
}

// Attach event listeners
textsubmit.addEventListener('click', enterMessage);
textinput.addEventListener('keydown', function (e) {
    switch (e.key) {
        case "Enter":
            e.preventDefault();
            enterMessage();
            break;
        default:
            break;
    }
});

// Load previously stored messages
function onboard() {

    // Initialize storage
    try {
        chats = JSON.parse(localStorage.getItem("chat")).chats;
    }
    catch (e) {
        chats = [];
    }
    lastMinute = -6;
    lastHour = -6;
    for (let i = 0; i < chats.length; i++) {
        // Create message
        let HTMLmessage = document.createElement("div");
        HTMLmessage.className = "chat-bubble preloaded";
        try {
            HTMLmessage.innerText = chats[i].msg;
        }
        catch (e) {
            console.log("Outdated database");
            localStorage.clear();
        }
        if (chats[i].min >= lastMinute + 5 || chats[i].hr != lastHour || chats[i].usr != lastUser) {
            lastMinute = chats[i].min;
            lastHour = chats[i].hr;
            let HTMLtime = document.createElement("div");
            HTMLtime.innerText = `${chats[i].usr}, ${lastHour > 12 ? lastHour - 12 : lastHour}:${lastMinute >= 10 ? lastMinute : "0" + lastMinute} ${lastHour >= 12 ? 'PM' : 'AM'}`;
            HTMLtime.className = "chat-time preloaded";
            messagecontainer.insertAdjacentElement("beforeend", HTMLtime);
            let HTMLuser = document.createElement("div");
            HTMLuser.className = "chat-profile preloaded";
            try{
                HTMLuser.innerText = chats[i].usr.substring(0,1);
                tempProfile.innerText = chats[i].usr.substring(0,1);
                tempName.innerText = chats[i].usr;
            }
            catch(e){
                console.log("Outdated database");
                localStorage.clear();
            }
            messagecontainer.insertAdjacentElement("beforeend", HTMLuser);
            lastUser = chats[i].usr;
        }
        messagecontainer.insertAdjacentElement("beforeend", HTMLmessage).scrollIntoView();
    }
    console.log(messagecontainer.scrollHeight);
}
document.addEventListener('load', onboard());