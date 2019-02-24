import { RuntimeMessage } from "../shared/models/runtime-message";

export class Observer {
  private _observer: MutationObserver;
  private _observationTarget: Node;

  constructor(target: Node) {
    this._observer = new MutationObserver(this._mutationCallback);
    this._observationTarget = target;
    console.info(
      "initialized observer",
      this._observer,
      "on target",
      this._observationTarget
    );
  }

  public onMutation: (mutation: MutationRecord) => void;
  public onTip: (user: string, amount: string, message: string) => void;
  public onMessage: (user: string, message: string) => void;
  public onEnter: (user: string) => void;
  public onLeave: (user: string) => void;

  public start = () => {
    this._observer.observe(this._observationTarget, this._getConfiguration());
    console.info(
      "started observation on target",
      this._observationTarget,
      "with config",
      this._getConfiguration()
    );
  };

  public stop = () => {
    this._observer.disconnect();
  };

  private _mutationCallback = (mutations: MutationRecord[]) => {
    console.info("mutation callback called", mutations);
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        console.info("evaluating single mutation", mutation);
        try {
          if (
            mutation.addedNodes.length > 0 &&
            mutation.addedNodes[0].childNodes.length > 0
          ) {
            this.onMutation(mutation);
            console.info("relevant mutation observed", mutation);

            // Tips get wrapped inside another child node; if no tip can't get parsed out of this, continue to try get other data..
            const tip = mutation.addedNodes[0].childNodes[0].childNodes[0];
            if (tip && tip.childNodes[0]) {
              const sender = tip.childNodes[0].textContent;
              const tipString = tip.textContent;

              const re = /.*tipped ([0-9]*) token/g;
              const m = re.exec(tipString);

              if (m) {
                const [, tipAmount] = m || [null, null];
                console.info("tip received", tipString, sender, tipAmount);
                this.onTip(sender, tipAmount, tipString);
                return;
              }
            }

            const userInterAction = mutation.addedNodes[0].childNodes;

            if (
              (userInterAction[0] as Element).className &&
              (userInterAction[0] as Element).className.includes("username")
            ) {
              // This probably means, this is a message sent by a user
              console.info(
                "User Interaction received with username as classname member",
                userInterAction
              );
              const userNode = userInterAction[0];
              const messageNode = userInterAction[1];

              console.info(
                "User Interaction: ",
                "received a message",
                userNode,
                messageNode
              );

              this.onMessage(userNode.textContent, messageNode.textContent);
              return;
            }

            if (
              (userInterAction[0].childNodes[0] as Element).className &&
              (userInterAction[0].childNodes[0] as Element).className.includes(
                "username"
              )
            ) {
              // This probably means, this is a OnEnter / OnLeave message.
              console.info(
                "User Interaction received with username as as childnodes classname member",
                userInterAction[0]
              );

              const userNode = userInterAction[0].childNodes[0];
              const messageNode = userInterAction[0].childNodes[1];

              console.info(
                "User Interaction: ",
                "received a onEnter/onLeave/message",
                userNode,
                messageNode
              );

              const messageText = messageNode.textContent;
              if (messageText.includes("has joined the room")) {
                this.onEnter(userNode.textContent);
              } else if (messageText.includes("has left the room")) {
                this.onLeave(userNode.textContent);
              } else {
                // can still me any kind of message; taking the data to store
                this.onMessage(userNode.textContent, messageText);
              }
            }
          }
        } catch (e) {
          console.error(e, mutation);
        }
      }
    }
  };

  private _getConfiguration: () => MutationObserverInit = () => {
    return {
      attributes: false,
      childList: true,
      characterData: false
    };
  };
}
