window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("enterButton").addEventListener("click", async () => {
    let channelNameEl = document.getElementById("channelNameInput");

    const channelOptions = {
      channelName: channelNameEl.value,
      fontSize: getFontSize(),
      color: getColor(),
    };

    window.api.ipcRenderer.invoke("channelNameEntered", channelOptions);

    const channelLinks = document.getElementById("openedChannels");
    const channelLink = document.createElement("li");
    channelLink.style.display = "flex";

    const linkText = `https://flow-chat-beta.vercel.app/flow-chat/${channelOptions.channelName}`;
    const linkSpan = document.createElement("span");
    linkSpan.textContent = linkText;

    const copyButton = document.createElement("button");
    copyButton.innerHTML = '<i class="fas fa-copy copy-icon"></i>';
    copyButton.className = "btn btn-primary copy-button";
    copyButton.addEventListener("click", () => {
      copyToClipboard(linkText);
    });

    channelLink.appendChild(linkSpan);
    channelLink.appendChild(copyButton);
    channelLinks.appendChild(channelLink);

    channelNameEl.value = "";
  });
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

// eslint-disable-next-line no-unused-vars
const changeFontSize = () => {
  window.api.ipcRenderer.invoke("changeFontSize", getFontSize());
};

// eslint-disable-next-line no-unused-vars
const changeColor = () => {
  window.api.ipcRenderer.invoke("changeColor", getColor());
};

const getFontSize = () => {
  const numberInput = document.getElementById("fontSize");
  const number = parseInt(numberInput.value);
  console.log("入力された数字:", number);
  return number;
};

const getColor = () => {
  const color = document.getElementById("color").value;
  return color;
};
