import { Observer } from "./Observer";
import { CBEventHandler } from "./cb-event-handler";
import { RuntimeMessage } from "../shared/models/runtime-message";

const target = document.querySelector("#defchat");
if (target === null) {
  console.error("target not found", target);
}

const chatContainer = document.querySelector(".chat-list");

console.info("Observing", chatContainer);

const observer = new Observer(chatContainer);

observer.onTip = CBEventHandler.onTip;
observer.onMessage = CBEventHandler.onMessage;
observer.onEnter = CBEventHandler.onEnter;
observer.onLeave = CBEventHandler.onLeave;

observer.onMutation = (mutation: MutationRecord) => {
  const runtimeMessage: RuntimeMessage = {
    origin: "content",
    type: "MUTATION_OBSERVED",
    payload: mutation
  };

  chrome.runtime.sendMessage(runtimeMessage);
};

observer.start();
