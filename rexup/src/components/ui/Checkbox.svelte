<!-- The checkbox-component takes a boolean as the value and an onclick-function to
handle the click-event. -->

<script lang="ts">
  import Icon from "./Icon.svelte";

  const {
    label,
    value,
    onClick,
    extraCSS,
  }: {
    label?: string;
    value: boolean;
    onClick: () => void;
    extraCSS?: string;
  } = $props();
</script>

<label class={`flex gap-2 items-center cursor-pointer ${extraCSS}`}>
  <div class="relative">
    <input
      type="checkbox"
      checked={value}
      onclick={onClick}
      class={`block -outline-offset-1 cursor-pointer w-5 h-5 rounded-md appearance-none outline-1 transition-[background] ${value ? "bg-sky-500 outline-sky-500" : "outline-gray-500"}`}
    />
    <div class="absolute top-1/2 left-1/2 -translate-1/2 cursor-pointer">
      {#if value}
        <Icon name="checked" width={20} height={20} extraCSS="fill-gray-50" />
      {/if}
    </div>
  </div>
  {label}
</label>
