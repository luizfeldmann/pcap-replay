import { useState } from "react";

export type ListGridOption = "list" | "grid";

export const useToggleListGrid = () => useState<ListGridOption>("list");
