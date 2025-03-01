use std::{ fs::File, path::PathBuf };

use zip::ZipWriter;

use crate::backup::copy_utils::zip_file_safely;

use super::copy_utils::copy_file_safely;

// The function returns whether the process was successful
pub fn copy_file_procedure(
  input_src: &PathBuf, // safely is a file and not a folder
  input_target: &PathBuf,
  backup_parent_folder: &PathBuf,
  zip_writer: &mut Option<ZipWriter<File>>
) -> bool {
  // Creates file_name and folder_path
  let file_name: PathBuf;
  let mut folder_without_file_name: PathBuf;

  // Decides for the file_name:
  // If input_target ends with file-name its also the one of the target
  // otherwise the file_name of the input_src is chosen
  let target_ends_with_file = match input_target.extension() {
    Some(_x) => { true }
    None => { false }
  };

  if target_ends_with_file {
    file_name = match input_target.file_name() {
      Some(x) => { x.into() }
      None => {
        return false;
      }
    };
  } else {
    file_name = match input_src.file_name() {
      Some(x) => { x.into() }
      None => {
        return false;
      }
    };
  }

  // Takes backup_parent_folder and input_target without possible file-name to use it as parent
  folder_without_file_name = backup_parent_folder.clone();
  folder_without_file_name.push(input_target);

  // Remove file-name if input_target had one
  if target_ends_with_file {
    folder_without_file_name.pop();
  }

  match zip_writer {
    Some(zip_writer) => {
      if
        zip_file_safely(
          input_src,
          &backup_parent_folder,
          &folder_without_file_name,
          &file_name,
          zip_writer
        )
      {
        return true;
      } else {
        return false;
      }
    }
    None => {
      if copy_file_safely(input_src, &folder_without_file_name, &file_name) {
        return true;
      } else {
        return false;
      }
    }
  }
}
