import { test, expect } from '@playwright/test';
import { supabase } from '@/integrations/supabase/client';
import { faker } from '@faker-js/faker';

const TEST_SELLER = {
  email: 'test.seller@example.com',
  password: 'testpassword123',
  whatsapp: '+237600000000'
};

const TEST_ADMIN = {
  email: 'test.admin@example.com',
  password: 'adminpassword123'
};

test.describe('Product Listing Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear test data
    await supabase.from('products').delete().eq('seller_id', TEST_SELLER.email);
  });

  test('complete product listing flow', async ({ page }) => {
    // 1. Test Seller's New Listing Creation
    await test.step('seller creates new listing', async () => {
      await loginAsSeller(page);
      await page.goto('/seller/products/new');
      
      // Upload test images
      const testImages = ['test1.jpg', 'test2.jpg'];
      for (const image of testImages) {
        await page.setInputFiles('input[type="file"]', `test-assets/${image}`);
      }

      // Fill form
      await page.fill('[name="title"]', faker.commerce.productName());
      await page.fill('[name="description"]', faker.commerce.productDescription());
      await page.fill('[name="price"]', '5000');
      await page.selectOption('[name="duration_hours"]', '24');
      await page.fill('[name="whatsapp_number"]', TEST_SELLER.whatsapp);

      // Submit and verify
      await page.click('button[type="submit"]');
      await expect(page.getByText('Product created successfully')).toBeVisible();

      // Verify in database
      const { data: product } = await supabase
        .from('products')
        .select()
        .eq('seller_id', TEST_SELLER.email)
        .single();

      expect(product.status).toBe('pending');
    });

    // 2. Test Admin Approval Process
    await test.step('admin approves listing', async () => {
      await loginAsAdmin(page);
      await page.goto('/admin/products');

      // Verify pending product
      await expect(page.getByText('Test Product')).toBeVisible();
      
      // Approve product
      await page.click('[aria-label="Approve product"]');
      await expect(page.getByText('Product approved successfully')).toBeVisible();

      // Verify link assignment
      const { data: link } = await supabase
        .from('permanent_links')
        .select()
        .eq('product_id', TEST_SELLER.email)
        .single();

      expect(link.status).toBe('active');
    });

    // 3. Test Home Page Display
    await test.step('verify product display', async () => {
      await page.goto('/');
      
      // Check product visibility
      await expect(page.getByText('Test Product')).toBeVisible();
      
      // Verify WhatsApp button
      const whatsappButton = page.getByRole('link', { name: 'Contact seller on WhatsApp' });
      await expect(whatsappButton).toBeVisible();
      expect(whatsappButton.getAttribute('href')).toContain('wa.me/237600000000');

      // Check product details page
      await page.click('a[href*="/p"]');
      await expect(page.getByText('Test Product')).toBeVisible();
    });

    // 4. Test Analytics
    await test.step('verify analytics events', async () => {
      // Wait for analytics events to be recorded
      await page.waitForTimeout(1000);

      const { data: events } = await supabase
        .from('analytics_events')
        .select()
        .eq('product_id', TEST_SELLER.email);

      expect(events.length).toBeGreaterThan(0);
    });
  });

  // Error cases
  test('handles validation errors', async ({ page }) => {
    await loginAsSeller(page);
    await page.goto('/seller/products/new');

    // Submit empty form
    await page.click('button[type="submit"]');
    await expect(page.getByText('Title is required')).toBeVisible();

    // Test image size limit
    const largeImage = 'test-assets/large-image.jpg'; // > 2MB
    await page.setInputFiles('input[type="file"]', largeImage);
    await expect(page.getByText('Image must be less than 2MB')).toBeVisible();
  });
});

async function loginAsSeller(page) {
  await page.goto('/auth/login');
  await page.fill('[name="email"]', TEST_SELLER.email);
  await page.fill('[name="password"]', TEST_SELLER.password);
  await page.click('button[type="submit"]');
  await expect(page.getByText('Seller Dashboard')).toBeVisible();
}

async function loginAsAdmin(page) {
  await page.goto('/auth/login');
  await page.fill('[name="email"]', TEST_ADMIN.email);
  await page.fill('[name="password"]', TEST_ADMIN.password);
  await page.click('button[type="submit"]');
  await expect(page.getByText('Admin Dashboard')).toBeVisible();
}