import { createFipc } from "./createFipc";

describe("CreateFipc", () => {
  const Test = (props: { id: string }): number => {
    return 1;
  };

  it("Should return fipc", () => {
    const fipc = createFipc(Test);
    expect(fipc({ $: true, id: "123" })).toBe(1);
  });

  it("Should save displayName", () => {
    const fipc = createFipc(Test);
    expect(fipc.displayName).toBe("Test");
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

    it("Should call component if there is $ prop", () => {
      const fipc = createFipc(component);
      expect(fipc({ $: true, ...props })).toEqual(props);
      expect(component).toHaveBeenCalledWith(props);
    });

    it("Should call component if fipc was partially applied ", () => {
      const fipc = createFipc(component);
      const result = fipc({ name: "asdaf" })({ id: 123 })({ $: true });
      expect(result).toEqual({ name: "asdaf", id: 123 });
    });

    it("Should not call a component if not $", () => {
      const fipc1 = createFipc(component);
      const fipc2 = createFipc(component);
      fipc1(props);
      fipc2({ id: 123 })({ name: "1232" })({ className: "2113123" })({});
      expect(component).not.toHaveBeenCalled();
    });

    it("Should remove $ from props", () => {
      const fipc = createFipc(component);
      expect(fipc({ $: true, ...props })).not.toHaveProperty("$");
    });


    it("Should work independently", () => {
      const Button = (props: {color:'red'|'blue'}) => {
        return `Button ${props.color}`
      }
      const fipc = createFipc(Button)
      const RedButton = fipc({color:"red"})
      const BlueButton = fipc({color:"blue"})

      expect(RedButton({$:true})).toBe("Button red")
      expect(BlueButton({$:true})).toBe("Button blue")

    })
  });
});
