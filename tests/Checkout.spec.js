import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Cart and Checkout tests', () => {
  let inventoryPage, cartPage, checkoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('add item to cart shows badge count', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('remove item from cart', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.removeFromCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  test('sort products by price low to high', async () => {
    await inventoryPage.sortDropdown.selectOption('lohi');
    await expect(inventoryPage.itemNames.first()).toHaveText('Sauce Labs Onesie');
  });

  test('complete checkout flow', async ({ page }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(1);

    await cartPage.checkout();
    await checkoutPage.fillInfo('Anurag', 'Jaiswar', '400001');
    await checkoutPage.finishButton.click();

    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('checkout without first name shows error', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo('', 'Jaiswar', '400001');

    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });
});