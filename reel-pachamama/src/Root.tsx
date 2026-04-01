import "./index.css";
import { Composition } from "remotion";
import { PachamamaReel } from "./PachamamaReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PachamamaReel"
        component={PachamamaReel}
        durationInFrames={450} // 15 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
