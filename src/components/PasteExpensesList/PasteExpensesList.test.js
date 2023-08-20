import { render, screen } from "@testing-library/react";
import PasteExpensesList from "./PasteExpensesList";

describe.only('Paste Expenses List', () => {
  test('User should see a textarea and paste text', async () => {
    // Arrange
    render(<PasteExpensesList/>);
    
    // Assert
    expect(await screen.findByRole('textbox')).toBeInTheDocument();
  });
  
  test('User should not see a duplicated expense', () => {});
});