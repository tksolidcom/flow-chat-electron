// eslint-disable-next-line no-unused-vars
let channelName;
let fontSize = "xx-large";
let defaultColor = "white";

window.addEventListener("DOMContentLoaded", () => {
  console.log("dom content loaded");

  window.api.receiveChannelName((channelOptions) => {
    console.log(channelOptions);
    channelName = channelOptions;

    document.getElementById(
      "title"
    ).textContent = `${channelOptions.channelName} channel`;

    // チャンネル初期化
    // eslint-disable-next-line no-undef
    var channels = new Pusher("04abbc088f6af203e82c", {
      cluster: "ap3",
    });
    var channel = channels.subscribe(channelOptions.channelName);
    channel.bind("chat", function (data) {
      console.log("flow chat received");
      console.log(data);
      addChat(data.chat, data.color);
    });

    changeFontSize(channelOptions.fontSize);
    changeColor(channelOptions.color);
  });
  window.api.changeFontSize((_fontSize) => {
    changeFontSize(_fontSize);
  });
  window.api.changeColor((_color) => {
    changeColor(_color);
  });
});

const addChat = (chat, color) => {
  console.log(`addChat: ${chat}`);
  const chatContainer = document.getElementById("chat-container");
  const chatMessage = document.createElement("div");
  chatMessage.classList.add("chat-message");
  chatMessage.innerText = chat;

  // ランダムな高さ
  //TODO: ランダムな高さが直近のものと被らないようにする
  const randomHeight = Math.floor(Math.random() * 90); // 0から90の範囲でランダムな値を生成
  chatMessage.style.top = randomHeight + "vh";

  // チャットの流れる速度を調整
  const commentTextLength = chat.length;
  // 速度調整値。
  //TODO: この値をメインウィンドウで設定可能にしてもいいかも
  const animationDurationMultiply = 3;
  let animationDuration = commentTextLength * 2 * animationDurationMultiply; // コメントの文字数 * 1秒
  if (15 * animationDurationMultiply < animationDuration) {
    animationDuration = 15 * animationDurationMultiply;
  }
  if (animationDuration < 10 * animationDurationMultiply) {
    animationDuration = 10 * animationDurationMultiply;
  }
  chatMessage.style.animationDuration = animationDuration + "s";

  chatMessage.style.fontSize = fontSize;
  chatMessage.style.color = color || defaultColor;

  chatContainer.appendChild(chatMessage);

  chatMessage.addEventListener("animationend", () => {
    console.log(`animation end${chat}`);
    chatContainer.removeChild(chatMessage);
  });
};

const changeFontSize = (_fontSize) => {
  if (_fontSize) {
    fontSize = _fontSize + "px";
  } else {
    fontSize = "xx-large";
  }
};

const changeColor = (_color) => {
  if (_color) {
    defaultColor = _color;
  } else {
    defaultColor = "white";
  }
};
