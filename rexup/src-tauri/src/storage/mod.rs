mod write_read;

use write_read::{
  safely_read_file,
  safely_write_file,
  BackupHistoryEntry,
  BackupWithId,
  ConfigFile,
  FileVariants,
};

// Make the `BackupsFileFilters` struct accessible for the execution of a backup
pub use write_read::BackupsFileFilters;

//
// SECTION: Manages storing and reading files from specific location
//
#[tauri::command]
pub fn read_config_file() -> String {
  match safely_read_file(FileVariants::Config) {
    Ok(read_value) => read_value,
    Err(_err) => "{}".to_owned(),
  }
}

#[tauri::command]
pub fn read_history_file() -> String {
  match safely_read_file(FileVariants::History) {
    Ok(read_value) => read_value,
    Err(_err) => "[]".to_owned(),
  }
}

#[tauri::command]
pub fn read_backup_file() -> String {
  match safely_read_file(FileVariants::Backups) {
    Ok(read_value) => read_value,
    Err(_err) => "[]".to_owned(),
  }
}

#[tauri::command]
pub fn write_config_file(value: ConfigFile) {
  match serde_json::to_string(&value) {
    Ok(data) => safely_write_file(FileVariants::Config, data),
    Err(_err) => { println!("Error: Could not convert data to JSON: {:#?}", &value) }
  }
}

#[tauri::command]
pub fn write_history_file(value: Vec<BackupHistoryEntry>) {
  match serde_json::to_string(&value) {
    Ok(data) => safely_write_file(FileVariants::History, data),
    Err(_err) => { println!("Error: Could not convert data to JSON: {:#?}", &value) }
  }
}

#[tauri::command]
pub fn write_backup_file(value: Vec<BackupWithId>) {
  match serde_json::to_string(&value) {
    Ok(data) => {
      safely_write_file(FileVariants::Backups, data);
    }
    Err(_err) => { println!("Error: Could not convert data to JSON: {:#?}", &value) }
  }
}
