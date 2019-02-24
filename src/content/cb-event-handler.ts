import { Tip } from "../shared/models/tip";
import { RuntimeMessage } from "../shared/models/runtime-message";
import { Message } from "../shared/models/message";

export class CBEventHandler {
  public static onTip(user: string, amount: string, message: string) {
    const tip: Tip = {
      user: user,
      amount: parseInt(amount, 10),
      message: message,
      time: new Date()
    };

    const runtimeMessage: RuntimeMessage = {
      origin: "content",
      type: "TIP_RECEIVED",
      payload: tip
    };

    chrome.runtime.sendMessage(runtimeMessage);
  }

  public static onMessage(user: string, message: string) {
    const _message: Message = {
      user: user,
      message: message
    };

    const runtimeMessage: RuntimeMessage = {
      origin: "content",
      type: "MESSAGE_RECEIVED",
      payload: _message
    };

    chrome.runtime.sendMessage(runtimeMessage);
  }

  public static onEnter(user: string) {
    const runtimeMessage: RuntimeMessage = {
      origin: "content",
      type: "USER_ENTERED",
      payload: user
    };

    chrome.runtime.sendMessage(runtimeMessage);
  }

  public static onLeave(user: string) {
    const runtimeMessage: RuntimeMessage = {
      origin: "content",
      type: "USER_LEFT",
      payload: user
    };

    chrome.runtime.sendMessage(runtimeMessage);
  }
}
