import "./index.css";
import { Composition } from "remotion";
import {
  HantverkskollenAd,
  HantverkskollenPremium,
} from "./HantverkskollenAnimation";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HantverkskollenPremium"
        component={HantverkskollenPremium}
        durationInFrames={660}
        fps={60}
        width={3840}
        height={2160}
      />
    </>
  );
};
