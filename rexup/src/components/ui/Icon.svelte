<!-- The component to create consistent icons all over the app. -->

<script lang="ts">
  import { icons } from "./icons";

  const {
    name,
    extraCSS,
    width = 24,
    height = 24,
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
