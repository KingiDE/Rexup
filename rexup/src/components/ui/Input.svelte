<!-- The foundational component for creating input-fields of any type (text and number). 
The getter function returns the actual value while the setter function updates the state. -->

<script lang="ts">
  let {
    getter,
    setter,
    label,
    placeholder,
    labelExtraCSS,
    inputExtraCSS,
    disabled,
    alwaysReadable,
    type,
    searchbar = $bindable(),
    onFocus,
  }: {
    getter: () => string;
    setter: (newValue: string) => void;
    label?: string;
    placeholder?: string;
    labelExtraCSS?: string;
    inputExtraCSS?: string;
    disabled?: boolean;
    alwaysReadable?: boolean;
    type?: "text" | "number";
    searchbar?: HTMLInputElement | null;
    onFocus?: () => void;
  } = $props();
</script>

<label class={labelExtraCSS}>
  {label}
  <input
    bind:this={searchbar}
    onfocus={onFocus}
    {type}
    class={`
      block -outline-offset-1 outline-1 outline-gray-500 rounded-md px-2 py-1.5 w-full focus-visible:outline-white transition-[outline] 
      ${inputExtraCSS} 
      ${label ? "mt-1" : ""}
      ${disabled && !alwaysReadable ? "opacity-50" : ""} 
    `}
    bind:value={getter, setter}
    {placeholder}
    {disabled}
  />
</label>
