interface MessageType {
  duration?: number;
  message?: string;
  title?: string;
  type: "primary" | "secondary" | "accent" | "neutral" | "success" | "warning" | "error" | "info";
}

const classNames = {
  primary: "alert alert-primary",
  secondary: "alert alert-secondary",
  accent: "alert alert-accent",
  neutral: "alert alert-neutral",
  success: "alert alert-success",
  warning: "alert alert-warning",
  error: "alert alert-error",
  info: "alert alert-info",
};

class Message {
  private dom: HTMLElement = document.createElement("div");
  constructor() {
    this.dom.className = "toast";
    document.body.appendChild(this.dom);
  }

  async showMessage(options: MessageType) {
    options.duration = options.duration || 6000;

    const msgInstance = document.createElement("div");
    msgInstance.className = classNames[options.type];
    msgInstance.innerHTML = `
      ${options.title ? `<h4 class="alert-heading">${options.title}</h4>` : ""}
      ${options.message ? `<span class="alert-text">${options.message}</span>` : ""}
    `;
    this.dom.prepend(msgInstance);

    setTimeout(() => {
      this.dom.removeChild(msgInstance);
    }, options.duration);
  }

  async info(message: string) {
    this.showMessage({
      type: "info",
      message: message,
    });
  }
  async success(message: string) {
    this.showMessage({
      type: "success",
      message: message,
    });
  }
  async warning(message: string) {
    this.showMessage({
      type: "warning",
      message: message,
    });
  }
  async error(err: string | Error) {
    if (typeof err === "string") {
      this.showMessage({
        type: "error",
        message: err,
      });
    } else {
      this.showMessage({
        type: "error",
        message: err.message,
      });
    }
  }
}

export default Message;
