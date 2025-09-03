import { render } from '@testing-library/react';
it('renders', () => {
  const { container } = render(<div>ok</div>);
  expect(container.textContent).toContain('ok');
});
