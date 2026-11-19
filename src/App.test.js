import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the studio at the site root", () => {
  window.history.pushState({}, "BUINI", "/");
  render(<App />);
  expect(screen.getAllByText("BUINI").length).toBeGreaterThan(0);
});
