//! Contains logic to unify the process of working with `Path`s in the entire backend. It includes os-specific code.

use std::path::PathBuf;
use std::env;

#[cfg(target_family = "windows")]
pub fn get_home_path() -> PathBuf {
	match env::var("USERPROFILE") {
		Ok(user_profile) => { PathBuf::from(user_profile) }
		Err(_err) => { PathBuf::from(format!("C:/Users/{}/", whoami::username())) }
	}
}

#[cfg(target_family = "windows")]
pub fn get_desktop_path() -> PathBuf {
	get_home_path().join("Desktop/")
}

#[cfg(target_family = "windows")]
pub fn get_config_directory() -> PathBuf {
	get_home_path().join("AppData/Roaming/rexup/")
}

#[cfg(target_family = "windows")]
pub fn get_config_file_path() -> PathBuf {
	get_config_directory().join("config.json")
}

#[cfg(target_family = "windows")]
pub fn get_backups_file_path() -> PathBuf {
	get_config_directory().join("backups.json")
}

#[cfg(target_family = "unix")]
pub fn get_home_path() -> PathBuf {
	match env::var("HOME") {
		Ok(user_profile) => { PathBuf::from(user_profile) }
		Err(_err) => { PathBuf::from(format!("/home/{}/", whoami::username())) }
	}
}

#[cfg(target_family = "unix")]
pub fn get_desktop_path() -> PathBuf {
	get_home_path().join("Desktop/")
}

#[cfg(target_family = "unix")]
pub fn get_config_directory() -> PathBuf {
	get_home_path().join(".config/rexup/")
}

#[cfg(target_family = "unix")]
pub fn get_config_file_path() -> PathBuf {
	get_config_directory().join("config.json")
}

#[cfg(target_family = "unix")]
pub fn get_backups_file_path() -> PathBuf {
	get_config_directory().join("backups.json")
}
