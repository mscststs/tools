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
    this.dom.className = "toast z-[100]";
    document.body.appendChild(this.dom);
  }

  async showMessage(options: MessageType) {
    options.duration = options.duration || 6000;

    const msgInstance = document.createElement("div");
    msgInstance.className = classNames[options.type];
    msgInstance.innerHTML = `
      <div class="flex flex-col">
        ${options.title ? `<h4 class="alert-heading">${options.title}</h4>` : ""}
        ${options.message ? `<span class="alert-text">${options.message}</span>` : ""}
      </div>
    `;
    this.dom.prepend(msgInstance);

    setTimeout(() => {
      this.dom.removeChild(msgInstance);
    }, options.duration);
  }

  async info(message: string, title = "") {
    this.showMessage({
      type: "info",
      message: message,
      title: title,
    });
  }
  async success(message: string, title = "") {
    this.showMessage({
      type: "success",
      message: message,
      title: title,
    });
  }
  async warning(message: string, title = "") {
    this.showMessage({
      type: "warning",
      message: message,
      title: title,
    });
  }
  async error(err: string | Error, title = "") {
    if (typeof err === "string") {
      this.showMessage({
        type: "error",
        message: err,
        title: title,
      });
    } else {
      this.showMessage({
        type: "error",
        message: err.message,
        title: title,
      });
    }
  }
}

export default Message;
