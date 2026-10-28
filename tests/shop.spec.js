const { test, expect } = require('@playwright/test');

test('Вход в магазин', async ({ page }) => {
  await test.step('Проверить текст на странице', async () => {
    await page.goto('/');
    await expect(page.getByText('Swag Labs', { exact: true })).toBeVisible();
  });

  await test.step('Заполнить форму входа', async () => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await expect(page.getByPlaceholder('Username')).toHaveValue('standard_user');
  });

  await test.step('Перейти в каталог', async () => {
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.getByTestId('title')).toHaveText('Products');
  });
});

test.describe('Каталог', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('Сортировка товаров', async ({ page }) => {
    await test.step('Проверить название товара', async () => {
      await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    });

    await test.step('Выбрать сортировку по названию', async () => {
      await page.getByTestId('product-sort-container').selectOption('za');
      await expect(page.getByTestId('product-sort-container')).toHaveValue('za');
      await expect(page.getByTestId('inventory-item-name').first()).toHaveText('Test.allTheThings() T-Shirt (Red)');
      await expect(page.getByTestId('inventory-item-name').last()).toHaveText('Sauce Labs Backpack');
    });

    await test.step('Открыть страницу товара', async () => {
      await page.getByText('Sauce Labs Backpack', { exact: true }).click();
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
      await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();
      await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    });
  });

  test('Добавление товара в корзину', async ({ page }) => {
    await test.step('Проверить текст в каталоге', async () => {
      await expect(page.getByTestId('title')).toHaveText('Products');
      await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    });

    await test.step('Добавить товар', async () => {
      await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
      await expect(page.getByTestId('remove-sauce-labs-backpack')).toHaveText('Remove');
    });

    await test.step('Перейти в корзину', async () => {
      await page.getByTestId('shopping-cart-link').click();
      await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
      await expect(page.getByTestId('title')).toHaveText('Your Cart');
      await expect(page.getByTestId('inventory-item')).toHaveCount(1);
      await expect(page.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    });
  });
});
