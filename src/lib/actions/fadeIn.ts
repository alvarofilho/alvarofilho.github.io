export function fadeIn(node: HTMLElement) {
  if (!('IntersectionObserver' in window)) {
    node.classList.add('on');
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        node.classList.add('on');
        observer.unobserve(node);
      }
    },
    { threshold: 0.07, rootMargin: '0px 0px -36px 0px' }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
