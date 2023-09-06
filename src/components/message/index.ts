import Message from "./Message.class";

const MessageInstance = new Message();

export default MessageInstance;
export const message = MessageInstance.showMessage.bind(MessageInstance);
export const error = MessageInstance.error.bind(MessageInstance);
export const warning = MessageInstance.warning.bind(MessageInstance);
export const info = MessageInstance.info.bind(MessageInstance);
export const success = MessageInstance.success.bind(MessageInstance);
