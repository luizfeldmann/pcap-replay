import { useReplayLogs } from "../../api/replays/useReplayLogs";
import { LogTextContainer, LogTextPreformatted } from "./ReplayLogsText.style";
import { Virtuoso } from "react-virtuoso";

export const ReplayLogsText = (props: { id: string }) => {
  const { logs } = useReplayLogs(props.id);

  return (
    <LogTextContainer>
      <Virtuoso
        data={logs}
        followOutput={true}
        itemContent={(index, lineText) => (
          <LogTextPreformatted key={index}>{lineText}</LogTextPreformatted>
        )}
      />
    </LogTextContainer>
  );
};
