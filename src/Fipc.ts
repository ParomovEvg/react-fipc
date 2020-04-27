export type WithDisplayName = {
  displayName?: string;
} & Function;
export type FipcProps = {
  $: boolean;
};
export type FipcRenderProps = {
  $: true;
};
export type FipcUnwrapProps = {
  $: false;
};

export type ResProps<
  P extends FipcProps,
  T extends Partial<FipcProps>
> = T extends FipcRenderProps ? P : T;

export type UnwrappedFipc<P, R> = ((props: P) => R) & WithDisplayName;

export type Fipc<P, R> = (<PartProp extends Partial<P & FipcProps>>(
  props: ResProps<P & FipcProps, PartProp>
) => PartProp extends FipcRenderProps
  ? R
  : PartProp extends FipcUnwrapProps
  ? UnwrappedFipc<Omit<P, keyof PartProp>, R>
  : Fipc<Omit<P, keyof PartProp> & FipcProps, R>) &
  WithDisplayName;
