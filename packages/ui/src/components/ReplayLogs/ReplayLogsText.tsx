import { LogTextContainer, LogTextPreformatted } from "./ReplayLogsText.style";
import { Virtuoso } from "react-virtuoso";
import { useReplayLogsText } from "./useReplayLogsText";

export const ReplayLogsText = (props: { id: string }) => {
  const { logLines } = useReplayLogsText(props.id);

  return (
    <LogTextContainer>
      <Virtuoso
        data={logLines}
        followOutput={true}
        itemContent={(index, lineText) => (
          <LogTextPreformatted key={index}>{lineText}</LogTextPreformatted>
        )}
      />
    </LogTextContainer>
  );
};
