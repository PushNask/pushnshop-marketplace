import { renderHook, act } from '@testing-library/react';
import { useLanguage, LanguageProvider } from '@/hooks/useLanguage';

describe('useLanguage', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LanguageProvider>{children}</LanguageProvider>
  );

  it('initializes with default language', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe('en');
  });

  it('toggles language between en and fr', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.toggleLanguage();
    });
    expect(result.current.language).toBe('fr');

    act(() => {
      result.current.toggleLanguage();
    });
    expect(result.current.language).toBe('en');
  });

  it('persists language preference in localStorage', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.toggleLanguage();
    });

    expect(localStorage.getItem('language')).toBe('fr');
  });
});