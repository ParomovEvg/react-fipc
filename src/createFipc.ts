import { Fipc, FipcPropsCarry, FipcPropsRender, WithDisplayName } from "./Fipc";
export function createFipc<ComponentProps, Result>(
  component: (props: ComponentProps) => Result
): Fipc<ComponentProps, Result> {
  const name = component.name;
  const fipc = (props: Partial<FipcPropsCarry & FipcPropsRender>) => {
    const { $render, $carry, ...componentProps  } = props;
    if ($render) {
      return component(componentProps as ComponentProps);
    }
    if ($carry !== true) {
      const unwrappedFipc: WithDisplayName = (innerProps: any) => {
        return component({ ...componentProps, ...innerProps });
      };
      unwrappedFipc.displayName = name;
      return unwrappedFipc;
    }

    const innerFipc: WithDisplayName = (
      innerFipcProps: Partial<FipcPropsCarry & FipcPropsRender>
    ) => {
      const {
        $render: $renderInner,
        $carry: $carryInner,
        ...innerComponentProps
      } = {
        ...componentProps,
        ...innerFipcProps,
      };
      if ($renderInner) {
        return component(innerComponentProps as ComponentProps);
      }
      if (!$carryInner) {
        const unwrappedFipc: WithDisplayName = (innerProps: any) => {
          return component({ ...innerComponentProps, ...innerProps });
        };
        unwrappedFipc.displayName = name;
        return unwrappedFipc;
      }
      return fipc({...componentProps, ...innerFipcProps});
    };

    innerFipc.displayName = name;
    return innerFipc;
  };

  fipc.displayName = name;
  return fipc as Fipc<ComponentProps, Result>;
}
