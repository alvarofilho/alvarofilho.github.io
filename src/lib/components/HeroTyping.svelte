<script lang="ts">
  import { onMount } from 'svelte';

  type Props = {
    roles: string[];
  };

  let { roles }: Props = $props();
  let text = $state('');
  let timeoutId: number | undefined;

  function startTyping() {
    if (timeoutId) window.clearTimeout(timeoutId);
    text = roles[0] ?? '';

    let roleIndex = 0;
    let charIndex = text.length;
    let deleting = false;

    const typeRole = () => {
      const currentRole = roles[roleIndex] ?? '';
      text = deleting ? currentRole.slice(0, charIndex - 1) : currentRole.slice(0, charIndex + 1);
      charIndex += deleting ? -1 : 1;

      let delay = deleting ? 42 : 72;
      if (!deleting && charIndex === currentRole.length) {
        deleting = true;
        delay = 2400;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 360;
      }

      timeoutId = window.setTimeout(typeRole, delay);
    };

    timeoutId = window.setTimeout(typeRole, 900);
  }

  onMount(() => {
    const shouldAnimate =
      window.matchMedia('(min-width: 721px)').matches &&
      window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

    if (!shouldAnimate) {
      return;
    }

    startTyping();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  });
</script>

<span>{text || roles[0] || ''}</span><span class="blink"></span>
