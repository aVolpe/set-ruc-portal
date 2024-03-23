<script>
    // copied from https://github.com/shinokada/svelte-ant-design-icons/blob/main/src/lib/CopyOutlined.svelte
    import { getContext } from "svelte";
    const ctx = getContext("iconCtx") ?? {};
    export let size = ctx.size || "12";
    export let role = ctx.role || "img";
    export let color = ctx.color || "currentColor";
    export let ariaLabel = "copy";
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    {...$$restProps}
    {role}
    width={size}
    height={size}
    fill={color}
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
    viewBox="0 0 18 20"
>
    <path
        d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"
    />
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
