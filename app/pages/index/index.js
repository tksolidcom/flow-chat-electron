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
    channelLink.textContent = `https://flow-chat-beta.vercel.app/flow-chat/${channelOptions.channelName}`;
    channelLinks.appendChild(channelLink);

    channelNameEl.value = "";
  });
});

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
