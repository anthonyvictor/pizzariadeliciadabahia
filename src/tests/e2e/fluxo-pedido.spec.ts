import { test, expect } from "@playwright/test";

test("usuário vê cardápio e adiciona pizza ao carrinho", async ({ page }) => {
  await page.goto("http://localhost:5002");

  await page.getByRole("button", { name: "PEÇA JÁ" }).first().click();

  //   await page.click("button:has-text('Meus itens')");
  //   await expect(page.locator("text=Pizza Calabresa")).toBeVisible();

  //   await page.click("text=Adicionar ao carrinho");

  //   await page.click("text=Carrinho");
  //   await expect(page.locator(".cart-item")).toContainText("Pizza Calabresa");
});
