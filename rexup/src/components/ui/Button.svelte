<!-- The foundational component for everything that should be clicked.
The button-component has consistent styles over all three variants and can be further customized by adding extra rules and styles.  -->

<script lang="ts">
  type Props = {
    text?: () => any;
    icon?: () => any;
    meaning: "negative" | "neutral" | "positive" | "discrete-neutral";
    onClick: (e: MouseEvent) => void;
    extraCSS?: string;
    extraRules?: Array<
      "no-padding" | "no-bg" | "no-outline" | "overflow-visible"
    >;
    disabled?: boolean;
    id?: string;
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
    onlyOnExactClick?: boolean;
  };

  const {
    text,
    icon,
    meaning,
    onClick,
    extraCSS,
    extraRules,
    disabled,
    id,
    onMouseEnter,
    onMouseLeave,
    onlyOnExactClick,
  }: Props = $props();

  const meaningClass = $derived.by(() => {
    switch (meaning) {
      case "negative":
        return `${extraRules?.includes("no-bg") ? "" : "bg-red-500 hover:bg-red-400"}`;
      case "positive":
        return `${extraRules?.includes("no-bg") ? "" : "bg-sky-500 hover:bg-sky-400"}`;
      case "neutral":
        return `${extraRules?.includes("no-bg") ? "" : "bg-gray-800 hover:bg-gray-500"} ${extraRules?.includes("no-outline") ? "" : "-outline-offset-1 outline-1 outline-gray-500"}`;
      case "discrete-neutral":
        return "";
    }
  });

  const layoutClass = $derived.by(() => {
    if (text !== undefined && icon !== undefined) return "flex gap-2";
    return "";
  });
</script>

<button
  {id}
  class={`
    ${meaningClass}
    ${extraRules && extraRules.includes("no-padding") ? "" : "p-2"} 
    ${extraRules && extraRules.includes("overflow-visible") ? "" : "overflow-hidden"} 
    ${disabled ? "opacity-50" : "cursor-pointer"} 
    ${extraCSS ? extraCSS : ""} 
    ${layoutClass ? layoutClass : ""}
    transition-[background] rounded-md 
  `}
  onclick={(e) => {
    if (onlyOnExactClick) {
      if (e.target === e.currentTarget) {
        onClick(e);
      }
    } else {
      onClick(e);
    }
  }}
  {disabled}
  onmouseenter={onMouseEnter}
  onmouseleave={onMouseLeave}
>
  {#if icon !== undefined}
    {@render icon()}
  {/if}
  {#if text !== undefined}
    {@render text()}
  {/if}
</button>
