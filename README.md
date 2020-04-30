# react-fipc

[![Build Status](https://travis-ci.com/ParomovEvg/react-fipc.svg?branch=master)](https://travis-ci.com/ParomovEvg/react-fipc)
[![Coverage Status](https://coveralls.io/repos/github/ParomovEvg/react-fipc/badge.svg?branch=master)](https://coveralls.io/github/ParomovEvg/react-fipc?branch=master)
[![GitHub stars](https://img.shields.io/github/stars/ParomovEvg/react-fipc)](https://github.com/ParomovEvg/react-fipc/stargazers)

## What is fipc

Fipc is - Function Injecting Parameters using Currying

This package adds a `createFipc` function that calls to create a Fipc from any of your functional component

## Install

`npm i react-fipc`

## Usage

To create a Fipc, you need to call `createFipc` with any of your functional components

I prefer to use \$ for Fipc's names

```tsx
export const Button$ = createFipc(Button);
```

There are 3 ways to use the Fipc

The first option is to call Fipc with props you want to bind
It will return a simple component

```tsx
const BlueButton = Button$({ color: "blue" });
export const Component = () => {
  return <BlueButton outlined>Hello</BlueButton>;
};
```

The second option is to call it with the `$carry` flag

```tsx
import { Button$ } from "./Button$";
const BlueButton$ = Button$({ $carry: true, color: "blue" });
const BlueOutlinedButton$ = BlueButton$({ $carry: true, outlined: true });

const RedButton$ = Button$({ $carry: true, color: "red" })({ $carry: true })({
  $carry: true,
})({ $carry: true });
```

Use `$carry`, if you plan to add props in another place

The third option is to render fipc in your component.
Use `$render` prop for it.

```tsx
const RedButton$ = Button$({ $carry: true, color: "red" });
export const Component = () => {
  return (
    <RedButton$ $render outlined>
      Hello
    </RedButton$>
  );
};
```

## Examples

### Injecting hooks

Fipc definition

```tsx
import React from "react";
import { createFipc, WithHooks } from "react-fipc";
import { Button } from "..";

interface ButtonHooks {
  useText: () => string;
  useClickHandler: () => () => void;
}
interface ButtonProps extends WithHooks<ButtonHooks> {
  className?: string;
  color?: string;
}
const ButtonComponent: React.FC<ButtonProps> = ({
  $hooks: { useText, useClickHandler },
  color,
  className,
}) => {
  const text = useText();
  const clickHandler = useClickHandler();
  return (
    <Button className={className} color={color} onClick={clickHandler}>
      {text}
    </Button>
  );
};
export const ButtonComponent$ = createFipc(ButtonComponent);
```

Fipc props injection

```tsx
import { useCallback } from "react";
import { ButtonComponent$ } from "..";
import { useSelector, useDispatch } from "react-redux";
import { saveNewDisplayName } from "react-fipc";

export const HomeSubmitButton = ButtonComponent$({
  color: "primary",
  $hooks: {
    useText: () => useSelector((state) => state.homeScreen.submitText),
    useClickHandler: () => {
      const dispatch = useDispatch();
      return useCallback(() => dispatch({ type: "home/submit" }));
    },
  },
});

export const HomeCancelButton = ButtonComponent$({
  color: "secondary",
  $hooks: {
    useText: () => "Cancel",
    useClickHandler: () => {
      const dispatch = useDispatch();
      return useCallback(() => dispatch({ type: "home/cancel" }));
    },
  },
});

saveNewDisplayName({
  HomeSubmitButton,
  HomeCancelButton,
});
```

By default, the Fipc `displayName` is equal to the name of the base component.
If you need to change it, react-fipc provides a `saveNewDisplayName` function to make changing the displayName easier

Fipc usage

```tsx
import { HomeSubmitButton, HomeCancelButton } from "..";

export const Home = () => {
  return (
    <div className="Home">
      <footer>
        <HomeSubmitButton />
        <HomeCancelButton />
      </footer>
    </div>
  );
};
```

Fipc tests

```tsx
import { ButtonComponent$ } from "..";
import { shallow } from 'enzyme';

describe("Button test", () => {
  const handler = jest.fn();
  const Button = ButtonComponent$({ $hooks: { useText: () => 'button', useClickHandler: () => handler } });

  it("Should call callback", () => {
    const wrapper = shallow(<Button/>);
    wrapper.('button').simulate('click');
    expect(handler).toBeCalled()
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
});
```
