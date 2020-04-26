export type WithDisplayName = {
    displayName?: string
} & Function
export type FipcProps = {
    $?: true
}

export type FipcRenderProps = {
    $?: true
}


export type ResProps<
    P extends FipcRenderProps,
    T extends FipcProps
    > = T extends FipcRenderProps ? P : T;

export type Fipc<P extends FipcRenderProps, R> = (<PartProp extends Partial<P>>(
    props: ResProps<P, PartProp>
) => PartProp extends FipcRenderProps
    ? R
    : Fipc<Omit<P, keyof PartProp> , R>) & WithDisplayName;