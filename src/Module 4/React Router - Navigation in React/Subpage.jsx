import React, { memo } from 'react';

class SubpageErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error('Subpage error:', error);
  }
  render() {
    if (this.state.hasError) {
      return <div role="alert">Failed to load subpage content.</div>;
    }
    return this.props.children;
  }
}

const SubpageContent = () => {
  // Future: fetch or receive dynamic data via props here

  return (
    <div>
      <h2>About Subpage</h2>
      <p>This is a nested subpage under About with static content.</p>
    </div>
  );
};

const Subpage = memo(() => (
  <SubpageErrorBoundary>
    <SubpageContent />
  </SubpageErrorBoundary>
));

export default Subpage;

// TEST SUGGESTIONS:
// - Test Subpage renders content
// - Test error boundary fallback UI on error
