import { Fipc, FipcRenderProps, WithDisplayName } from "./Fipc";
export function createFipc<
    ComponentProps,
    FipcProps extends FipcRenderProps & ComponentProps,
    Result
    >(component: (props: ComponentProps) => Result): Fipc<FipcProps, Result> {
    const res = function fipc(prop) {
        if (prop.$) {
            const copy = { ...prop };
            delete copy.$;
            return component(copy as ComponentProps);
        } else {
            const innerFipc: WithDisplayName = (innerProps: any) => {
                if (innerProps.$) {
                    const copy = { ...prop, ...innerProps };
                    delete copy.$;
                    return component(copy);
                } else {
                    return fipc({ ...prop, ...innerProps });
                }
            };
            innerFipc.displayName = component.name;
            return innerFipc;
        }
    } as Fipc<FipcProps, Result>;
    res.displayName = component.name;
    return res;
}
