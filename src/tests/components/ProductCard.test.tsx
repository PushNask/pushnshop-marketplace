import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '@/components/ProductCard';
import { useAnalytics } from '@/hooks/useAnalytics';

vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    trackProductView: vi.fn(),
    trackWhatsAppClick: vi.fn()
  }))
}));

const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 1000,
  currency: 'XAF',
  images: ['test-image.jpg'],
  description: 'Test description',
  seller_whatsapp: '1234567890',
  is_verified: true
};

const defaultProps = {
  product: mockProduct,
  language: 'en',
  formatCurrency: (price: number, currency: string) => `${currency} ${price}`,
  linkNumber: 1
};

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(`XAF ${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('tracks product view when clicking on product link', () => {
    const mockTrackProductView = vi.fn();
    (useAnalytics as jest.Mock).mockReturnValue({
      trackProductView: mockTrackProductView,
      trackWhatsAppClick: vi.fn()
    });

    render(
      <BrowserRouter>
        <ProductCard {...defaultProps} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(mockProduct.title));
    expect(mockTrackProductView).toHaveBeenCalledWith(mockProduct.id);
  });

  it('tracks WhatsApp click when clicking on WhatsApp button', () => {
    const mockTrackWhatsAppClick = vi.fn();
    (useAnalytics as jest.Mock).mockReturnValue({
      trackProductView: vi.fn(),
      trackWhatsAppClick: mockTrackWhatsAppClick
    });

    render(
      <BrowserRouter>
        <ProductCard {...defaultProps} />
      </BrowserRouter>
    );

    const whatsappButton = screen.getByLabelText('Contact seller on WhatsApp');
    fireEvent.click(whatsappButton);
    expect(mockTrackWhatsAppClick).toHaveBeenCalledWith(mockProduct.id);
  });

  it('shows verified badge for verified products', () => {
    render(
      <BrowserRouter>
        <ProductCard {...defaultProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('handles missing product images', () => {
    render(
      <BrowserRouter>
        <ProductCard
          {...defaultProps}
          product={{ ...mockProduct, images: [] }}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('No Image')).toBeInTheDocument();
  });
});