import { useState } from "react";
import "./App.css";
import useBackupActions from "./hooks/useBackupActions";
import useStoredValues from "./hooks/useStoredValues";
import useCurrentSelectedBackup, {
  LocalStateBackupWithId,
} from "./hooks/useCurrentSelectedBackup";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";

export type CurrentPopup =
  | {
      variant: "addbackup";
      value: null;
    }
  | {
      variant: "deletebackup";
      value: LocalStateBackupWithId;
    }
  | {
      variant: "renamebackup";
      value: LocalStateBackupWithId;
    }
  | {
      variant: "configurebackup";
      value: LocalStateBackupWithId;
    }
  | {
      variant: "editbackupentry";
      value: LocalStateBackupWithId;
    }
  | {
      variant: "settings";
      value: null;
    }
  | null;

export default function App() {
  const {
    storedConfig,
    storedHistory,
    storedBackups,
    setStoredConfig,
    setStoredHistory,
    setStoredBackups,
  } = useStoredValues();

  const [currentPopup, setCurrentPopup] = useState<CurrentPopup>(null);

  const {
    createBackup,
    renameBackup,
    deleteBackup,
    toggleBackupZipping,
    updateBackupLocation,
  } = useBackupActions(storedBackups, setStoredBackups);

  const { currentSelectedBackup, setCurrentSelectedBackup } =
    useCurrentSelectedBackup();

  return (
    <div className="p-2 font-inter bg-gray-950 text-gray-50 grid grid-cols-[300px_auto] h-[100vh] gap-2">
      <Sidebar
        currentPopup={currentPopup}
        setCurrentPopup={setCurrentPopup}
        currentSelectedBackup={currentSelectedBackup}
        setCurrentSelectedBackup={setCurrentSelectedBackup}
        createBackup={createBackup}
        renameBackup={renameBackup}
        deleteBackup={deleteBackup}
        storedConfig={storedConfig}
        setStoredConfig={setStoredConfig}
        setStoredHistory={setStoredHistory}
        storedBackups={storedBackups}
        toggleBackupZipping={toggleBackupZipping}
        updateBackupLocation={updateBackupLocation}
      />
      <div className="max-h-full overflow-y-scroll">
        <Overview
          currentSelectedBackup={currentSelectedBackup}
          storedHistory={storedHistory}
          storedConfig={storedConfig}
          storedBackups={storedBackups}
          setStoredHistory={setStoredHistory}
          setStoredBackups={setStoredBackups}
          setCurrentPopup={setCurrentPopup}
          currentPopup={currentPopup}
        />
      </div>
    </div>
  );
}
