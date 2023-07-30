import React, { ReactNode, useState } from "react";

type SwipeableProps = {
  children: ReactNode;
  onSwipe: () => void;
  onSwipeBack: () => void;
  direction: "Left" | "Right";
};

function Swipeable({
  children,
  onSwipe,
  onSwipeBack,
  direction,
}: SwipeableProps) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe)
      console.log("swipe", isLeftSwipe ? "left" : "right");

    if (isLeftSwipe) {
      if (direction == "Left") {
        onSwipe();
      } else {
        onSwipeBack();
      }
    }

    if (isRightSwipe) {
      if (direction == "Right") {
        onSwipe();
      } else {
        onSwipeBack();
      }
    }

    // add your conditional logic here
  };

  return (
    <div
      className="w-full"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
}

export default Swipeable;
