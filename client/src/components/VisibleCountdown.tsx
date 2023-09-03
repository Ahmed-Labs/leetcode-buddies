import { useState } from "react";
import Countdown, { zeroPad } from "react-countdown";

type CountdownProps = {
  date: Date;
};

type rendererProps = {
  hours: any;
  minutes: any;
  seconds: any;
};

const renderer = ({ minutes, seconds }: rendererProps) => {
  return (
    <span>
      {zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );
};

const VisibleCountdown = ({ date }: CountdownProps) => {
  const [showCountdown, setShowCountdown] = useState<boolean>(true);
  if (showCountdown) {
    return (
      <Countdown
        date={date}
        onComplete={() => setShowCountdown(false)}
        renderer={renderer}
      />
    );
  } else {
    return null;
  }
};

export default VisibleCountdown;
