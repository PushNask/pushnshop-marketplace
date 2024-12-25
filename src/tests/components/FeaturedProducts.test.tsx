import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FeaturedProducts } from '@/components/FeaturedProducts';

const mockProducts = [
  {
    id: '1',
    title: 'Featured Product 1',
    price: 299,
    image: 'test-image-1.jpg',
    isFeatured: true,
    seller_whatsapp: '1234567890',
    seller_id: '1',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_verified: true
  },
  {
    id: '2',
    title: 'Featured Product 2',
    price: 399,
    image: 'test-image-2.jpg',
    isFeatured: true,
    seller_whatsapp: '1234567890',
    seller_id: '1',
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_verified: true
  }
];

describe('FeaturedProducts', () => {
  it('renders featured products section', () => {
    render(
      <BrowserRouter>
        <FeaturedProducts />
      </BrowserRouter>
    );

    expect(screen.getByText('Featured Deals')).toBeInTheDocument();
  });

  it('renders correct number of product cards', () => {
    render(
      <BrowserRouter>
        <FeaturedProducts />
      </BrowserRouter>
    );

    const productTitles = screen.getAllByRole('heading', { level: 3 });
    expect(productTitles).toHaveLength(2);
  });

  it('displays product prices in correct format', () => {
    render(
      <BrowserRouter>
        <FeaturedProducts />
      </BrowserRouter>
    );

    expect(screen.getByText('XAF 299')).toBeInTheDocument();
    expect(screen.getByText('XAF 399')).toBeInTheDocument();
  });
});