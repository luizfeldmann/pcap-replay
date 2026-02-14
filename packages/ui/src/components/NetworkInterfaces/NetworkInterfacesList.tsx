import { Alert, LinearProgress } from "@mui/material";
import { useNetworkInterfaces } from "../../api/networkInterfaces";
import { NetworkInterfaceCard } from "./NetworkInterfaceCard";

export const NetworkInterfacesList = () => {
  // Query interfaces from the server
  const interfaces = useNetworkInterfaces();

  // Show loading or error
  if (interfaces.isLoading) return <LinearProgress />;
  else if (interfaces.isError)
    return <Alert severity="error">{interfaces.error.message}</Alert>;

  // Render the grid
  return (
    <>
      {interfaces.data?.map((item) => (
        <NetworkInterfaceCard key={item.name} data={item} />
      ))}
    </>
  );
};
