export type WithDisplayName = {
  displayName?: string;
} & Function;

export type UnwrappedFipc<P, R> = (props: P) => R;

export type FipcPropsCarry = {
  $carry: true;
};

export type FipcPropsRender = {
  $render: true;
};

export type ResProps<
  Props,
  PartProps extends Partial<Props & FipcPropsRender>
> = PartProps extends FipcPropsRender ? Props & FipcPropsRender : PartProps;

export type Fipc<Props, Res> = (<
  PartProps extends Partial<Props & FipcPropsCarry & FipcPropsRender>
>(
  props: ResProps<Props, PartProps>
) => PartProps extends FipcPropsRender
  ? Res
  : PartProps extends FipcPropsCarry
  ? Fipc<Omit<Props, keyof PartProps>, Res> & WithDisplayName
  : UnwrappedFipc<Omit<Props, keyof PartProps>, Res> & WithDisplayName) &
  WithDisplayName;
