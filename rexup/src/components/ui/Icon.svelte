<!-- The component to create consistent icons all over the app. -->

<script lang="ts">
  // biome-ignore lint/style/useImportType: "icons.ts" is also used as a value
  import { icons } from "./icons";

  const {
    name,
    extraCSS,
    width,
    height,
    id,
  }: {
    name: keyof typeof icons;
    extraCSS?: string;
    width?: number;
    height?: number;
    id?: string;
  } = $props();
</script>

<svg class={extraCSS} {width} {height} viewBox="0 0 24 24" {id}>
  {@html icons[name]}
</svg>
