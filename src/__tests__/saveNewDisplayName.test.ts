import { createFipc } from "../createFipc";
import { saveNewDisplayName } from "../saveNewDisplayName";

describe("saveNewDisplayName test", () => {

  it("Should save new display name of fipc", () => {
    const Button = (props: { color: "red" | "blue" }) => {
      return `Button ${props.color}`;
    };
    const fipc = createFipc(Button);
    const RedButton = fipc({ color: "red" });
    const BlueButton = fipc({ color: "blue" });

    expect(RedButton.displayName).toBe("Button");
    expect(BlueButton.displayName).toBe("Button");

    saveNewDisplayName({
      RedButton,
      BlueButton,
    });

    expect(RedButton.displayName).toBe("RedButton");
    expect(BlueButton.displayName).toBe("BlueButton");
  });
});
