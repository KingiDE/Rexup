use std::{ fs::{ self, File }, io::Write, path::PathBuf };

use zip::{ write::SimpleFileOptions, ZipWriter };

pub fn add_zero_in_front(number: u32) -> String {
  if number < 10 { format!("0{}", number) } else { number.to_string() }
}

// The real copy-file method which additionally creates needed parent-dirs in case they don't exist already.
// The return value (boolean) marks whether everything worked fine
pub fn copy_file_safely(
  origin_with_filename: &PathBuf,
  target_without_filename: &PathBuf,
  target_only_file_name: &PathBuf
) -> bool {
  match fs::create_dir_all(&target_without_filename) {
    Ok(_x) => {}
    Err(_err) => {
      return false;
    }
  }

  let mut target_with_filename = target_without_filename.clone();
  target_with_filename.push(&target_only_file_name);

  match fs::copy(&origin_with_filename, &target_with_filename) {
    Ok(_x) => { true }
    Err(_err) => { false }
  }
}

// Zips the file at input_src by reading its contents into a Vec and then writing it into the relative path
// inside the zip-file
pub fn zip_file_safely(
  input_src: &PathBuf,
  backup_parent_folder: &PathBuf,
  folder_without_file_name: &PathBuf,
  file_name: &PathBuf,
  zip_writer: &mut ZipWriter<File>
) -> bool {
  // Read the conents of the file at input_src
  let file_contents = match fs::read(&input_src) {
    Ok(x) => { x }
    Err(_err) => {
      return false;
    }
  };

  // Remove prefix (= backup_parent_folder) and write to this location with the help of zip_writer
  let mut relative_path_inside_parent_folder = PathBuf::from(&folder_without_file_name);
  relative_path_inside_parent_folder.push(&file_name);
  relative_path_inside_parent_folder = match
    relative_path_inside_parent_folder.strip_prefix(&backup_parent_folder)
  {
    Ok(x) => { x.to_path_buf() }
    Err(_err) => {
      return false;
    }
  };

  // Start a file in zip_writer
  if
    zip_writer
      .start_file_from_path(&relative_path_inside_parent_folder, SimpleFileOptions::default())
      .is_err()
  {
    return false;
  }

  // Write to a file in zip_writer
  if zip_writer.write(&file_contents).is_err() {
    return false;
  }

  return true;
}
