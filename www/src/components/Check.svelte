<script>
    // copied from https://github.com/shinokada/svelte-ant-design-icons/blob/main/src/lib/CopyOutlined.svelte
    import { getContext } from "svelte";
    const ctx = getContext("iconCtx") ?? {};
    export let size = ctx.size || "12";
    export let role = ctx.role || "img";
    export let ariaLabel = "copy";
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    {...$$restProps}
    {role}
    width={size}
    height={size}
    fill="none"
    class={$$props.class}
    aria-label={ariaLabel}
    on:click
    on:keydown
    on:keyup
    on:focus
    on:blur
    on:mouseenter
    on:mouseleave
    on:mouseover
    on:mouseout
    viewBox="0 0 16 12"
>
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
</svg>

<!--
  @component
  [Go to docs](https://svelte-ant-design-icons.vercel.app/)
  ## Props
  @prop export let size = ctx.size || '24';
  @prop export let role = ctx.role || 'img';
  @prop export let color = ctx.color || 'currentColor';
  @prop export let ariaLabel = 'copy';
  -->
