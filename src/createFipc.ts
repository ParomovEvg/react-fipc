import { Fipc, UnwrappedFipc, WithDisplayName } from "./Fipc";
export function createFipc<ComponentProps extends {}, Result>(
  component: (props: ComponentProps) => Result
): Fipc<ComponentProps, Result> {
  const res = function fipc(props) {
    if (props.$ === true) {
      const copy = { ...props };
      delete copy.$;
      return component(copy as ComponentProps);
    }
    if (props.$ === false) {
      const innerComponent: UnwrappedFipc<
        Omit<ComponentProps, keyof typeof props>,
        Result
      > = (componentProps) => {
        const copy = { ...props, ...componentProps };
        delete copy.$;
        return component(copy as ComponentProps);
      };
      innerComponent.displayName = component.name;
      return innerComponent;
    } else {
      const innerFipc: WithDisplayName = (innerProps: any) => {
        if (innerProps.$ === true) {
          const copy = { ...props, ...innerProps };
          delete copy.$;
          return component(copy as ComponentProps);
        } else if (innerProps.$ === false) {
          const innerComponent: UnwrappedFipc<
            Omit<ComponentProps, keyof typeof props>,
            Result
          > = (componentProps) => {
            const copy = { ...props, ...innerProps, ...componentProps };
            delete copy.$;
            return component(copy as ComponentProps);
          };
          innerComponent.displayName = component.name;
          return innerComponent;
        } else {
          return fipc({ ...props, ...innerProps });
        }
      };
      innerFipc.displayName = component.name;
      return innerFipc;
    }
  } as Fipc<ComponentProps, Result>;
  res.displayName = component.name;
  return res;
}
