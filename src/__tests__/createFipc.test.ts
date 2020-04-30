import { createFipc } from "../createFipc";

describe("CreateFipc", () => {
  const Test = (props: { id: string }): number => {
    return 1;
  };

  it("Should return fipc", () => {
    const fipc = createFipc(Test);
    expect(fipc({ $render: true, id: "123" })).toBe(1);
  });

  it("Should unwrap fipc", () => {
    const fipc = createFipc(Test);
    expect(fipc({ id: "123" })({})).toBe(1);
  });

  it("Should save displayName", () => {
    const fipc = createFipc(Test);
    expect(fipc.displayName).toBe("Test");
  });
  it("Should save displayName if carry", () => {
    const fipc = createFipc(Test);
    expect(fipc({ $carry: true, id: "123" }).displayName).toBe("Test");
  });
  it("Should save displayName if unwrap", () => {
    const fipc = createFipc(Test);
    expect(
      fipc({ $carry: true, id: "123" })({ $carry: true })({ $carry: true })({})
        .displayName
    ).toBe("Test");
  });

  describe("Fipc test", () => {
    type Props = {
      name: string;
      id: number;
      className?: string;
    };

    const props: Props = {
      name: "evgeny",
      id: 666,
      className: "btn",
    };

    type Component = (props: Props) => Props;
    const component: Component = jest.fn((props) => props);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("Should unwrap component if call without $render or $carry", () => {
      const fipc = createFipc(component);
      expect(fipc({ ...props })({})).toEqual(props);
      expect(component).toHaveBeenCalledWith(props);
    });

    it("Should call component if  $render:true", () => {
      const fipc = createFipc(component);
      expect(fipc({ $render: true, ...props })).toEqual(props);
      expect(component).toHaveBeenCalledWith(props);
    });

    it("Should call component if fipc was partially applied (unwrap)", () => {
      const fipc = createFipc(component);
      const result = fipc({ $carry: true, name: "asdaf" })({
        $carry: true,
        id: 123,
      })({})({});
      expect(result).toEqual({ name: "asdaf", id: 123 });
    });

    it("Should call component if fipc was partially applied ($render)", () => {
      const fipc = createFipc(component);
      const result = fipc({ $carry: true, name: "asdaf" })({
        $carry: true,
        id: 123,
      })({ $render: true });
      expect(result).toEqual({ name: "asdaf", id: 123 });
    });

    it("Should not call a component if not $render", () => {
      const fipc1 = createFipc(component);
      const fipc2 = createFipc(component);
      fipc1(props);
      fipc2({ $carry: true, id: 123 })({ $carry: true, name: "1232" })({
        $carry: true,
        className: "2113123",
      })({});
      expect(component).not.toHaveBeenCalled();
    });

    it("Should remove $render from props", () => {
      const fipc = createFipc(component);
      expect(fipc({ $: true, ...props })).not.toHaveProperty("$");
    });

    it("Should work independently", () => {
      const Button = (props: { color: "red" | "blue" }) => {
        return `Button ${props.color}`;
      };
      const fipc = createFipc(Button);
      const RedButton = fipc({  color: "red" });
      const BlueButton = fipc({  color: "blue" });

      expect(RedButton({})).toBe("Button red");
      expect(BlueButton({})).toBe("Button blue");
    });
  });
});
