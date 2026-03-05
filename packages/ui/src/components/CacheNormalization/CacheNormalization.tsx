import { useFilesCacheNormalization } from "../../api/files/useFilesCacheNormalization";
import { useReplaysCacheNormalization } from "../../api/replays/useReplaysCacheNormalization";

export const CacheNormalization = () => {
  useFilesCacheNormalization();
  useReplaysCacheNormalization();
  return <></>;
};
