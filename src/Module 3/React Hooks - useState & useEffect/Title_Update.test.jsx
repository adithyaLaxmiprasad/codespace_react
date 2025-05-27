import { render, screen, fireEvent } from '@testing-library/react';
import Title_Update from './Title_Update';

describe('Title_Update Component', () => {
  beforeEach(() => {
    document.title = 'Original Title';
  });

  test('initial render shows 0 clicks', () => {
    render(<Title_Update />);
    expect(screen.getByText(/Clicks: 0/)).toBeInTheDocument();
  });

  test('button click increments count and updates title', () => {
    render(<Title_Update />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(screen.getByText(/Clicks: 1/)).toBeInTheDocument();
    expect(document.title).toBe('Clicked 1 times');

    fireEvent.click(button);
    expect(screen.getByText(/Clicks: 2/)).toBeInTheDocument();
    expect(document.title).toBe('Clicked 2 times');
  });

  test('error boundary test for title update', () => {
    const originalTitle = Object.getOwnPropertyDescriptor(document, 'title');
    Object.defineProperty(document, 'title', { set: () => { throw new Error('Test error') } });
    
    render(<Title_Update />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to update document title');
    
    Object.defineProperty(document, 'title', originalTitle);
  });
});