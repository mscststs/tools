<script setup lang="ts">
import { ref, onBeforeUnmount, watchEffect, reactive } from "vue";
import { useClipboard } from "@vueuse/core";
import { success, error } from "../../components/message";
import getPeerId from "./peerid-prompt";
import getUserMediaOptions from "./userMedia-prompt"
import { formatTime } from "../../utils";

const peer = new window.Peer();
const peerId = ref("");
const remotePeerId = ref("");
const dataConnection = ref<any>(null);
const remoteMediaConnection = ref<any>(null);
const mediaConnection = ref<any>(null);

const chatInput = ref("");
const chatHistory = reactive<ChatItem[]>([]);
const chatHistoryView = ref();


watchEffect(() => {
  if (chatHistory.length && chatHistoryView.value) {
    setTimeout(() => {
      chatHistoryView.value.scrollTop = chatHistoryView.value.scrollHeight;
    }, 100);
  }
})

const { copy, copied } = useClipboard();
watchEffect(() => {
  if (copied.value) {
    success("复制成功");
  }
});

peer.on("open", (id: string) => {
  peerId.value = id;
});
onBeforeUnmount(() => {
  if (dataConnection.value) {
    handleCloseConnection();
  }
  peer.destroy();
});

peer.on("connection", (conn: any) => {
  if (dataConnection.value) {
    error("已拒绝其他连接");
  } else {
    dataConnection.value = conn;
  }
});
peer.on("call", (call: any) => {
  call.answer();
  call.on("stream", (data: MediaStream) => {
    remoteVideoRef.value.srcObject = data;
  });
  call.on("close", () => {
    addSystemInfo("对方关闭了视频");
    remoteMediaConnection.value = null;
    remoteVideoRef.value.srcObject = null;
  })
  remoteMediaConnection.value = call;
});

watchEffect(() => {
  if (dataConnection.value) {
    dataConnection.value.on("open", () => {
      addSystemInfo("连接成功");
      remotePeerId.value = dataConnection.value.peer;
      // success(dataConnection.value.peer, "连接成功");
    });
    dataConnection.value.on("data", (data: any) => {
      if (data.as === "chat") {
        handleRemoteChatMessage(data.data);
      }
    });
    dataConnection.value.on("close", () => {
      addSystemInfo("已断开数据连接");

      dataConnection.value = null;
    });
  }
});
watchEffect(() => {
  if (mediaConnection.value) {
    mediaConnection.value.on("close", () => {
      addSystemInfo("已断开视频连接");
      if (userMediaStream.value) {
        userMediaStream.value.getTracks().forEach(track => track.stop());
        userMediaStream.value = undefined;
      }
      mediaConnection.value = null;
    });
  }
})

const myVideoRef = ref();
const remoteVideoRef = ref();


/**
 * 处理远程消息回调
 */
async function handleRemoteChatMessage(data: any) {
  if (data.type === "text") {

    chatHistory.push({
      ...data,
      from: "other",
    })
  } else if (data.type === "image") {
    const blob = new Blob([data.data], { type: "image/*" });
    chatHistory.push({
      ...data,
      url: URL.createObjectURL(blob),
      from: "other",
    })
  }
}




async function handleCreateConnection() {
  let { peerid } = await getPeerId();
  remotePeerId.value = peerid;
  dataConnection.value = peer.connect(peerid);
};

async function handleCloseConnection() {

  if (userMediaStream.value) {
    userMediaStream.value.getTracks().forEach(track => track.stop());
    userMediaStream.value = undefined;
  }
  mediaConnection.value?.close();
  remoteMediaConnection.value?.close();
  dataConnection.value?.close();
};

function addSystemInfo(msg: string) {
  const message = createChatMessage("info", msg);
  chatHistory.push({
    ...message,
    from: "local",
  });
}


function createChatMessage(type = "text", data: string | ArrayBuffer) {
  if (type === "text") {
    return {
      type: "text",
      ts: Date.now(),
      data: data
    }
  } else if (type === "image") {
    return {
      type: "image",
      ts: Date.now(),
      data: data
    }
  } else if (type === "info") {
    return {
      type: "info",
      ts: Date.now(),
      data: data
    }
  }
  throw new Error("unsupported Type");
}

function createDataMessage(type = "chat", data: any) {
  return {
    as: type,
    data,
  }
}

async function sendText() {
  if (!dataConnection.value) {
    return;
  }
  const chatObject = createChatMessage("text", chatInput.value);
  chatHistory.push({
    ...chatObject,
    from: "local",
  });

  dataConnection.value?.send(createDataMessage("chat", chatObject));
  chatInput.value = "";
}

async function sendImage(blob: Blob) {
  const buf = await blob.arrayBuffer();
  const chatObject = createChatMessage("image", buf);
  chatHistory.push({
    ...chatObject,
    url: URL.createObjectURL(blob),
    from: "local",
  });
  dataConnection.value?.send(createDataMessage("chat", chatObject));
}


/**
 * 处理粘贴图片事件
 * @param e 
 */
async function handleReadPaste(e: ClipboardEvent) {
  if (e?.clipboardData?.items) {
    const image = [...e?.clipboardData?.items].find(item => {
      return item.kind === "file" && item.type.startsWith("image/");
    });
    if (image) {
      const imageFile = image?.getAsFile();
      if (imageFile) {
        const blob = new Blob([imageFile], { type: image.type || 'application/*' });
        sendImage(blob);
      }
    } else {
      error("不支持的格式");
    }
  }
}

const userMediaStream = ref<MediaStream>();

async function handleReadUserMedia() {
  if (userMediaStream.value) {
    userMediaStream.value.getTracks().forEach(track => track.stop());
    mediaConnection.value.close();
    userMediaStream.value = undefined;
    myVideoRef.value.srcObject = null;
    return;
  }
  try {
    const { facingMode, audio } = await getUserMediaOptions();
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode }, // 优先使用后置摄像头
      audio: audio,
    });
    userMediaStream.value = mediaStream;
    try {
      mediaConnection.value = peer.call(remotePeerId.value, mediaStream);
      myVideoRef.value.srcObject = mediaStream;
    } catch (e: any) {
      console.error(e);
    }
  } catch (e: any) {
    error(e);
  }
}



</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-none flex-row justify-center gap-4 flex-wrap">
      <template v-if="!dataConnection">
        <button type="button" class="btn btn-outline" @click="copy(peerId)">
          <template v-if="!peerId">
            <span class="loading loading-spinner"></span>
            获取 Peer Id
          </template>
          <template v-else>
            <i-icon icon="ext:clipboard"></i-icon>
            {{ peerId }}
          </template>
        </button>
        <button type="button" class="btn btn-primary" @click="handleCreateConnection">连接到...</button>

      </template>
      <template v-else>
        <button type="button" class="btn btn-primary" @click="handleReadUserMedia">
          <template v-if="userMediaStream">
            <span class="loading loading-ring"></span>
            视频中
          </template>
          <template v-else>
            打开视频
          </template>
        </button>
        <button type="button" class="btn btn-error" @click="handleCloseConnection">
          断开连接</button>
      </template>

    </div>
    <div class="divider"></div>
    <div class="flex flex-col sm:flex-row flex-auto">
      <div class="video-panel flex flex-row sm:flex-col sm:w-1/4" v-show="mediaConnection || remoteMediaConnection">
        <video controls autoplay ref="remoteVideoRef" class="w-1/2 sm:w-full sm:h-1/2 object-contain flex-auto"></video>
        <video controls autoplay ref="myVideoRef" class="w-1/2 sm:w-full sm:h-1/2 object-contain flex-auto"></video>
      </div>
      <div class="chat-panel flex flex-col flex-auto ">
        <div class="chat-history flex-grow h-[300px] flex-col border-primary border overflow-auto p-4"
          ref="chatHistoryView">
          <template v-for="item of chatHistory" :key="item.ts">
            <div class="flex flex-row justify-center text-sm opacity-50" v-if="item.type === 'info'">
              <div class="time px-4 text-info">{{ formatTime(new Date(item.ts), "HH:mm:ss") }}</div>
              <div class="">{{ item.data }}</div>
            </div>
            <div class="chat" :class="item.from === 'other' ? 'chat-start' : 'chat-end'" v-else>
              <div class="chat-header">
                <time class="text-xs opacity-50">{{ formatTime(new Date(item.ts), "HH:mm:ss") }}</time>
              </div>
              <template v-if="item.type === 'text'">
                <div class="chat-bubble chat-bubble-info ">{{ item.data }}</div>
              </template>
              <template v-else-if="item.type === 'image'">
                <div class="chat-bubble chat-bubble-info ">
                  <img :src="item.url" alt="" class="max-h-48 object-contain">
                </div>
              </template>
            </div>
          </template>
        </div>
        <div class="chat-input flex flex-none relative">
          <textarea id="chat-input-area" name="chatinput" rows="4" class="textarea textarea-bordered w-full resize-none"
            v-model="chatInput" @keydown.enter.ctrl="sendText" @keydown.enter.meta="sendText" @paste="handleReadPaste"
            placeholder="说些什么吧...." :disabled="!dataConnection"></textarea>
          <label for="chat-input-area" class="btn btn-primary btn-sm absolute right-4 bottom-4"
            @click="sendText">SEND</label>
        </div>
      </div>
    </div>
  </div>
</template>