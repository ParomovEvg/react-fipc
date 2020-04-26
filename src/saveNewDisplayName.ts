import { WithDisplayName } from "./Fipc";

type SaveNewDisplayName = (objectOfFipcs: {
  [name: string]: WithDisplayName;
}) => void;

export const saveNewDisplayName: SaveNewDisplayName = (objectOfFipcs) => {
  Object.entries(objectOfFipcs).forEach(([fipcName, fipc]) => {
    fipc.displayName = fipcName;
  });
};
