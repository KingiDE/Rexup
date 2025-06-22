//! Contains logic to navigate through directories on the users's file-system.
//! It allows the user to select directories/files to backup and choose a location to put the created backup.

use serde::{ Deserialize, Serialize };

use crate::FileOrDirectory;

pub mod get_remaining_drives;
pub mod get_user_path_to;
pub mod list_contents_of;
mod is_thing_at_path_hidden;

/// Is a segment of a path in the top bar in the PathSelector on the frontend.
#[derive(Debug, Serialize, Deserialize)]
pub struct PathElement {
	id: String,
	name: String,
	variant: FileOrDirectory,
}
