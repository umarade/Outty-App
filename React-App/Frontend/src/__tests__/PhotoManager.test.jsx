// Import the testing utilities
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import the component we want to test
import PhotoManager from '../components/PhotoManager';

// Group all tests for the PhotoManager
describe('PhotoManager Component', () => {

  // ✅ Test 1: Check if component renders correctly
  it('should render Photo Manager heading', () => {
    render(<PhotoManager />);

    // Check if heading is present
    expect(screen.getByText('Photo Manager')).toBeInTheDocument();
  });

  // ✅ Test 2: Initial state (no photo)
  it('should show "No photo uploaded" initially', () => {
    render(<PhotoManager />);

    // Should show placeholder text
    expect(screen.getByText('No photo uploaded')).toBeInTheDocument();
  });

  // ✅ Test 3: Upload button works
  it('should upload photo when Upload button is clicked', () => {
    render(<PhotoManager />);

    // Click the upload button
    fireEvent.click(screen.getByText('Upload Photo'));

    // Now image should appear
    expect(screen.getByAltText('uploaded')).toBeInTheDocument();
  });

  // ✅ Test 4: Delete button works
  it('should delete photo after uploading', () => {
    render(<PhotoManager />);

    // First upload a photo
    fireEvent.click(screen.getByText('Upload Photo'));

    // Then delete it
    fireEvent.click(screen.getByText('Delete Photo'));

    // Should go back to "no photo" state
    expect(screen.getByText('No photo uploaded')).toBeInTheDocument();
  });

  // ✅ Test 5: Error when deleting without photo
  it('should show error if delete is clicked with no photo', () => {
    render(<PhotoManager />);

    // Click delete without uploading first
    fireEvent.click(screen.getByText('Delete Photo'));

    // Expect error message
    expect(screen.getByText('No photo to delete.')).toBeInTheDocument();
  });

});
// Test: Upload button works
it('should upload a photo when button is clicked', () => {
  render(<PhotoManager />);

  // Click upload button
  fireEvent.click(screen.getByText('Upload Photo'));

  // Image should appear
  const image = screen.getByAltText('uploaded');
  expect(image).toBeInTheDocument();
});

// Test: Delete button works
it('should delete the photo when delete button is clicked', () => {
  render(<PhotoManager />);

  // Upload first
  fireEvent.click(screen.getByText('Upload Photo'));

  // Then delete
  fireEvent.click(screen.getByText('Delete Photo'));

  // Should go back to no photo
  expect(screen.getByText('No photo uploaded')).toBeInTheDocument();
});