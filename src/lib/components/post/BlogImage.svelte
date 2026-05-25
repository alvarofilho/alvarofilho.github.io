<script lang="ts">
  type Props = {
    src: string;
    alt: string;
    caption?: string;
  };

  let { src, alt, caption }: Props = $props();
</script>

<figure class="post-image">
  <img {src} {alt} loading="lazy" decoding="async" />
  {#if caption}
    <figcaption>{caption}</figcaption>
  {/if}
</figure>
