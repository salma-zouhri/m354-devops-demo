import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  it("affiche les 8 exposés au chargement", () => {
    render(<App />);
    expect(screen.getAllByTestId("expose")).toHaveLength(8);
    expect(screen.getByRole("status")).toHaveTextContent("8 exposés");
  });

  it("filtre par date au clic sur une puce", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "11 nov. 2026" }));
    expect(screen.getAllByTestId("expose")).toHaveLength(2);
    expect(screen.getByText("Culture DevOps et chaîne CI/CD")).toBeInTheDocument();
  });

  it("revient à toutes les dates", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "25 nov. 2026" }));
    await userEvent.click(screen.getByRole("button", { name: "Toutes les dates" }));
    expect(screen.getAllByTestId("expose")).toHaveLength(8);
  });

  it("recherche par texte et affiche un message si rien ne correspond", async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText("Rechercher"), "terraform");
    expect(screen.getAllByTestId("expose")).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent("1 exposé");
    await userEvent.type(screen.getByLabelText("Rechercher"), "zzz");
    expect(screen.getByText("Aucun exposé ne correspond à votre recherche.")).toBeInTheDocument();
  });

  it("affiche la version et le commit déployés", () => {
    render(<App />);
    expect(screen.getByTestId("build-info")).toHaveTextContent("commit");
  });
});
