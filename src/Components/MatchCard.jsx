import React from "react";

export default function MatchCard({ match, onSelect, selectedTeam, disabled }) {
  // Por si disabled es undefined, por seguridad
  const isDisabled = disabled || false;

  const handleClick = (teamSlug) => {
    if (isDisabled) return;
    if (match.teamA.name === "TBD" || match.teamB.name === "TBD") return;
    onSelect(match.id, teamSlug);
  };

  // Estilo para el equipo seleccionado
  const getTeamClass = (teamSlug) => {
    const base = "rounded w-full transition-colors p-2 min-h-[64px]";
    const isSelected = selectedTeam === teamSlug;

    const selectedClass = isSelected
      ? "bg-[#b2a27e] text-black border border-yellow-300"
      : "bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] border border-gray-600";

    const interactionClass = isDisabled ? "cursor-not-allowed" : "cursor-pointer";

    return `${base} ${selectedClass} ${interactionClass}`;
  };

  return (
    <div className="flex flex-col border border-gray-700 rounded-lg p-4 shadow-sm gap-4 w-full max-w-[220px] min-w-[180px] mx-auto bg-[#1a1a1a]">
      <div
        className={getTeamClass(match.teamA.slug)}
        onClick={() => handleClick(match.teamA.slug)}
      >
        <div className="flex items-center justify-center gap-4 ">
          <img
            src={match.teamA.logo}
            alt={match.teamA.name}
            className="w-12 h-12 object-contain"
          />
          <span className="text-left">{match.teamA.name}</span>
        </div>
      </div>

      <div className="font-bold text-gray-300 text-center">vs</div>

      <div
        className={getTeamClass(match.teamB.slug)}
        onClick={() => handleClick(match.teamB.slug)}
      >
        <div className="flex items-center justify-center gap-4">
          <img
            src={match.teamB.logo}
            alt={match.teamB.name}
            className="w-12 h-12 object-contain"
          />
          <span className="text-left">{match.teamB.name}</span>
        </div>
      </div>
    </div>
  );
}
