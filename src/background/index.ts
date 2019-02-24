import { RuntimeMessage } from "../shared/models/runtime-message";
import { Tip } from "../shared/models/tip";
import { Message } from "../shared/models/message";

chrome.runtime.onMessage.addListener((message: RuntimeMessage) => {
  switch (message.type) {
    case "MUTATION_OBSERVED":
      mutationObserved(message.payload as MutationRecord);
      break;
    case "MESSAGE_RECEIVED":
      handleMessage(message.payload as Message);
      break;
    case "TIP_RECEIVED":
      handleTip(message.payload as Tip);
      break;
    case "USER_ENTERED":
      handleEnter(message.payload as string);
      break;
    case "USER_LEFT":
      handleLeave(message.payload as string);
      break;
    default:
      console.warn("Unknown action", message);
  }
});

export function mutationObserved(mutation: MutationRecord) {
  //console.log("mutation observed", JSON.stringify(mutation));
}

export function handleTip(tip: Tip) {
  console.info("onTip", tip);
}

export function handleMessage(message: Message) {
  console.info("onMessage", message);
}

export function handleEnter(user: string) {
  console.info("onEnter", user);
}

export function handleLeave(user: string) {
  console.info("onLeave", user);
}
