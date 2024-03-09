<script>
    // copied from https://github.com/shinokada/svelte-ant-design-icons/blob/main/src/lib/CopyOutlined.svelte
    import { getContext } from "svelte";
    const ctx = getContext("iconCtx") ?? {};
    export let size = ctx.size || "24";
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
    viewBox="0 0 1024 1024"
>
    <path
        d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"
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
