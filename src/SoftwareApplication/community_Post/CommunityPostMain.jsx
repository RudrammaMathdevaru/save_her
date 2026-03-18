/**
 * File: src/SoftwareApplication/community/CommunityPostMain.jsx
 * Updated: 2026-02-04
 *
 * Purpose:
 * - Main container component for the community page
 * - Orchestrates the community post component
 *
 * Changes:
 * - Added proper export structure
 * - Maintains simple composition pattern
 *
 * Connected Modules:
 * - CommunityPost.jsx (child component)
 *
 * Dependencies:
 * - React: Core library
 */

import React from 'react';
import CommunityPost from './community_post_components/CommunityPost';

const CommunityPostMain = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityPost />
    </div>
  );
};

export default React.memo(CommunityPostMain);
