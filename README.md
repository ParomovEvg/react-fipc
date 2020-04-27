# react-fipc

[![Build Status](https://travis-ci.com/ParomovEvg/react-fipc.svg?branch=master)](https://travis-ci.com/ParomovEvg/react-fipc)
[![Coverage Status](https://coveralls.io/repos/github/ParomovEvg/react-fipc/badge.svg?branch=master)](https://coveralls.io/github/ParomovEvg/react-fipc?branch=master)
[![GitHub stars](https://img.shields.io/github/stars/ParomovEvg/react-fipc)](https://github.com/ParomovEvg/react-fipc/stargazers)

## What is fipc

Fipc is - Function Injecting Parameters using Currying

This package adds a `createFipc` function that calls to create a Fipc from any of your functional component

## Install

`npm i react-fipc`

## Examples

### Easy component composition

####Fipc definition

```ts
import { createFipc, saveNewDisplayName } from "react-fipc";
import { Button } from "./Button";

const Button$ = createFipc(Button);

export const BlueButton$ = Button$({ color: "blue" });
export const RedButton$ = Button$({ color: "red" });

export const BlueOutlinedButton$ = BlueButton$({ type: "outlined" });
export const RedOutlinedButton$ = RedButton$({ type: "outlined" });

// This function is only needed to correctly display Fipc in React Dev Tools
saveNewDisplayName({
  BlueOutlinedButton$,
  RedOutlinedButton$,
  BlueButton$,
  RedButton$,
});
```

By default, the Fipc `displayName` is equal to the name of the base component.
If you need to change it, react-fipc provides a `saveNewDisplayName` function to make changing the displayName easier

#### Fipc usage

There are two ways to use fipc in your component.

The first option is to call fipc from your component with prop \$.
Prop `$` allows the Fipc to understand that you need to stop currying component

```tsx
import React from "react";
import { BlueOutlinedButton$ } from "./buttons";
import { Button } from "./button";

export const Component = () => {
  return (
    <div>
      <Button color={"blue"} type={"outlined"}>
        Hello
      </Button>
      <BlueOutlinedButton$ $>Hello</BlueOutlinedButton$>
    </div>
  );
};
```

The second option is unwrap fipc before use.
In this case, your components don't know about fipc,
but you cannot continue currying this fipc

Call fipc with {\$:false} to unwrap fipc

```tsx
import React from "react";
import { BlueOutlinedButton$ } from "./buttons";
import { Button } from "./button";

const BlueOutlinedButton = BlueOutlinedButton$({ $: false });

export const Component = () => {
  return (
    <div>
      <Button color={"blue"} type={"outlined"}>
        Hello
      </Button>
      <BlueOutlinedButton>Hello</BlueOutlinedButton>
    </div>
  );
};
```

### Easy injecting of api

#### Fipc definition

```tsx
import React from "react";
import { createFipc, WithApi } from "react-fipc";
import { Button } from "./button";
import { SendInterface } from "api";

interface ButtonIdProps extends WithApi<{ send: SendInterface }> {
  id: number;
  className?: string;
}
const ButtonIdComponent: React.FC<ButtonIdProps> = ({ id, $api: { send } }) => {
  return (
    <Button
      onClick={() => {
        send(id);
      }}
    >
      {id}
    </Button>
  );
};
export const ButtonIdComponent$ = createFipc(ButtonIdComponent);
```

#### Fipc api injection

```tsx
import { send } from "api";
import { ButtonIdComponent$ } from "./component";
import { saveNewDisplayName } from "react-fipc";

// prop $:false unwrap fipc
export const ButtonId = ButtonIdComponent$({ $api: { send }, $: false });
saveNewDisplayName({
  ButtonId,
});
```

#### Fipc usage

You can use unwrapped fipc like a simple component

```tsx
import React from "react";
import { ButtonId } from "./button-id";

export const Component = () => {
  return (
    <div>
      <ButtonId id={123} />
    </div>
  );
};
```

#### Fipc test

Fipc makes your components easier to test

```tsx
import { ButtonIdComponent$ } from "./../component";
import { shallow } from 'enzyme';

describe("ButtonId test", () => {
  const send = jest.fn();
  const ButtonId = ButtonIdComponent$({ $api: { send } });

  it("Should call api", () => {
    const wrapper = shallow(<ButtonId id={1} />);
    wrapper.('button').simulate('click');
    expect(send).toBeCalledWith(1)
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
});
```
