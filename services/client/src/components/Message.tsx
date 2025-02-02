import React from "react";

interface MessageProps {
  message: string;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return <div className="text-red-500 text-center mb-4">{message}</div>;
};

export default Message;
