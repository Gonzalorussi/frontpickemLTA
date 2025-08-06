import React from 'react';

const RankingBadge = ({ position }) => {
  const getMedal = () => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${position}º`;
    }
  };

  return (
    <span className="text-xl font-bold mr-2 w-8 inline-block text-center">
      {getMedal()}
    </span>
  );
};

export default RankingBadge;