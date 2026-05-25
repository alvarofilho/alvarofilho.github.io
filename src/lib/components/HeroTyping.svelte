<script lang="ts">

  type Props = {
    roles: string[];
  };

  let { roles }: Props = $props();
  let text = $state('');
  let timeoutId: number | undefined;

  function startTyping() {
    if (timeoutId) window.clearTimeout(timeoutId);
    text = '';

    let roleIndex = 0;
    let charIndex = 0;
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

  $effect(() => {
    roles; // track prop — restarts when lang changes
    startTyping();
    return () => { if (timeoutId) window.clearTimeout(timeoutId); };
  });
</script>

<span>{text}</span><span class="blink"></span>
