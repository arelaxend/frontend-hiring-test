import { CloseOutlined, InboundOutlined, OutboundOutlined, TransferOutlined, VoicemailOutlined } from "@aircall/tractor";
import React from "react";

const IconCall = ({
  type,
  direction,
  height,
}: {
  type: string;
  direction: string;
  height: number;
}) => {
  switch (type) {
    case "missed":
      return <CloseOutlined height={height} />;
    case "voicemail":
      return <VoicemailOutlined height={height} />;
    case "answered":
      return direction === "outbound" ? (
        <OutboundOutlined height={height} />
      ) : (
        <InboundOutlined height={height} />
      );
    default:
      return <TransferOutlined height={height} />;
  }
};

const areEqual = () => {
  return true;
};

export default React.memo(IconCall, areEqual);