import "./index.css";
import { Composition } from "remotion";
import { HantverkskollenPremium, HantverkskollenSearchJourney } from "./HantverkskollenAnimation";
import { HanellGoogleVideo } from "./HanellGoogleVideo";

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
      <Composition
        id="HanellGoogleVideo"
        component={HanellGoogleVideo}
        durationInFrames={330}
        fps={30}
        width={960}
        height={540}
      />
      <Composition
        id="HantverkskollenSearchJourney"
        component={HantverkskollenSearchJourney}
        durationInFrames={650}
        fps={60}
        width={2520}
        height={2831}
      />
    </>
  );
};
