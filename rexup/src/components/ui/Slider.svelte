<script lang="ts">
  let {
    sizeOfSingleElement,
    indexOfSelectedElement,
    elements,
    extraCSS,
    vertical,
  }: {
    sizeOfSingleElement: number;
    indexOfSelectedElement: number;
    elements: () => any;
    extraCSS?: string;
    vertical?: boolean;
  } = $props();
</script>

<div
  class={`${vertical ? "grid" : "flex"} relative isolate -outline-offset-1 outline-1 outline-gray-500 rounded-md ${extraCSS}`}
>
  <div
    class={`-z-10 absolute bg-gray-500 rounded-md transition-[left,_top] ${vertical ? "w-full" : "h-full"}`}
    style={`
      ${vertical ? "height" : "width"}: ${sizeOfSingleElement}px; 
      ${vertical ? "top" : "left"}: ${sizeOfSingleElement * indexOfSelectedElement}px;
    `}
  ></div>
  {@render elements()}
</div>
