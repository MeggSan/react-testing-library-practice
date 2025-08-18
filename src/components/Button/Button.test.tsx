import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import userEvent from '@testing-library/user-event';

describe('<Button />', () => {
  it('Should render the button', () => {
    render(<Button label='Click' />); // Arrange
    const button = screen.getByText('Click'); // Act
    expect(button).toBeInTheDocument(); // Assert
  })

  it('Should call onClick function', async () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} />)
    const button = screen.getByText('Click');
    // fireEvent.click(button);
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  })
})