import React from 'react'
import CompletedBox from '~/components/CompletedBox';
import PageTransitionLayout from '~/components/PageTransitionLayout'

function history() {
  return (
    <PageTransitionLayout>
      <CompletedBox />
    </PageTransitionLayout>
  );
}

export default history