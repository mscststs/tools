/**
 * FrameController
 * 传递一个 fps 参数，即可设定一个基于 requestAnimationFrame 的回调的频率
 * 无论外部的状态，始终每一帧回调一次
 * 也可以通过在循环内 await nextFrame() 的方式，来等待下一帧
 */
export class FrameController {
  frameDelay: number;

  callback?: Function;

  resolve?: Function;
  reject?: Function;

  lastFrameTs?: number;
  running = true;
  constructor(fps: number, callback?: Function) {
    this.frameDelay = Math.floor(1000 / fps);
    this.callback = callback;
    this.step = this.step.bind(this);
    window.requestAnimationFrame(this.step);
  }

  private step(timestamp: number) {
    if (!this.lastFrameTs) {
      this.lastFrameTs = timestamp;
    } else {
      const gap = Math.floor(timestamp - this.lastFrameTs);
      if (gap >= this.frameDelay) {
        this.lastFrameTs = timestamp;

        // 触发回调/resolve
        this.callback?.();
        this.resolve?.();
      }
    }

    // 检查是否已经关闭
    if (this.running) {
      window.requestAnimationFrame(this.step);
    }
  }

  public end() {
    this.running = false;
  }

  public nextFrame() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
