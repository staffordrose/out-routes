export const triggerTextareaChange = (
  node: HTMLTextAreaElement,
  value = ''
) => {
  const setNativeValue = () => {
    const valueSetter = Object.getOwnPropertyDescriptor(node, 'value')?.set;
    const prototype = Object.getPrototypeOf(node);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(
      prototype,
      'value'
    )?.set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      typeof prototypeValueSetter === 'function' &&
        prototypeValueSetter.call(node, value);
    } else {
      typeof valueSetter === 'function' && valueSetter.call(node, value);
    }
  };

  if (Object.getPrototypeOf(node).constructor === window.HTMLTextAreaElement) {
    const event = new Event('input', { bubbles: true });
    setNativeValue();
    node.dispatchEvent(event);
  }
};
