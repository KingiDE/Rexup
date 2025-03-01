import { SpacingSmall } from "../ui-lib/Spacing";
import { HeadingII, Text } from "../ui-lib/Texts";

export default function NoBackupSelectedScreen() {
  return (
    <div className="bg-gray-900 rounded-md p-4 grid place-items-center place-content-center h-full">
      <HeadingII>
        There's no Backup selected <span className="ml-2">:/</span>
      </HeadingII>
      <SpacingSmall />
      <Text>
        Click on an existing backup or create one to edit it here inside the
        overview.
      </Text>
    </div>
  );
}
