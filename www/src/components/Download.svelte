<script>
    import { getContext } from 'svelte';
    const ctx = getContext('iconCtx') ?? {};
    export let size = ctx.size || '24';
    export let role = ctx.role || 'img';
    export let color = ctx.color || 'currentColor';
    export let ariaLabel = 'download';
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
      d="M505.7 661a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
    />
  </svg>
  
  <!--
  @component
  [Go to docs](https://svelte-ant-design-icons.codewithshin.com/)
  ## Props
  @prop export let size = ctx.size || '24';
  @prop export let role = ctx.role || 'img';
  @prop export let color = ctx.color || 'currentColor';
  @prop export let ariaLabel = 'download';
  -->