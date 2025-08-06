// src/Components/BracketLayout.jsx
import React from "react";
import MatchCard from "./MatchCard";

export default function BracketLayout({ matches, onSelect, selectedTeamGetter, disabled }) {
  if (matches.length < 6) {
    return <p className="text-center text-red-600">Faltan partidas para estructurar la ronda 6.</p>;
  }

  return (
    <div className="flex justify-center w-full px-4 relative min-h-[100vh]">
      <div className="grid grid-cols-4 grid-rows-6 gap-4 w-full max-w-7xl relative">
        {/*Caminos de llaves M1 a M3*/}        
        <div className="absolute left-[calc(100%/4*0.56)] top-[calc(100%/6*3.25)] w-[calc(100%/4*0.2)] h-0.5 bg-gray-700" />
        <div className="absolute left-[calc(100%/4*0.76)] top-[calc(100%/6*3.25)] w-0.5 h-[calc(100%/6*0.45)] bg-gray-700" />
        <div className="absolute left-[calc(100%/4*0.76)] top-[calc(100%/6*3.7)] w-[calc(100%/4*0.4)] h-0.5 bg-gray-700" />
        {/*Caminos de llaves M2 a M3 */}
        <div className="absolute left-[calc(100%/4*0.56)] top-[calc(100%/6*5)] w-[calc(100%/4*0.2)] h-0.5 bg-gray-700" />
        <div className="absolute left-[calc(100%/4*0.76)] top-[calc(100%/6*4.5)] w-0.5 h-[calc(100%/6*0.515)] bg-gray-700" />
        <div className="absolute left-[calc(100%/4*0.76)] top-[calc(100%/6*4.5)] w-[calc(100%/4*0.4)] h-0.5 bg-gray-700" />
        {/*Caminos de llaves M3 a M5 */}
        <div className="absolute left-[calc(100%/4*1.56)] top-[calc(100%/6*4.1)] w-[calc(100%/4*0.2)] h-0.5 bg-gray-700" />
        <div className="absolute left-[calc(100%/4*1.76)] top-[calc(100%/6*4.1)] w-0.5 h-[calc(100%/6*0.4)] bg-gray-700" />
        <div className="absolute left-[calc(100%/4*1.76)] top-[calc(100%/6*4.5)] w-[calc(100%/4*0.4)] h-0.5 bg-gray-700" />        
        {/*Caminos de llaves M4 a M5*/} 
        <div className="absolute left-[calc(100%/4*1.76)] top-[calc(100%/6*0.83)] w-[calc(100%/4*0.4)] h-0.5 bg-gray-700" />
        <div className="absolute left-[calc(100%/4*1.76)] top-[calc(100%/6*0.83)] w-0.5 h-[calc(100%/6*2.87)] bg-gray-700" />
        <div className="absolute left-[calc(100%/4*1.76)] top-[calc(100%/6*3.7)] w-[calc(100%/4*0.4)] h-0.5 bg-gray-700" />
        {/*Caminos de llaves M4 a M6*/}
        <div className="absolute left-[calc(100%/4*2.56)] top-[calc(100%/6*0.83)] w-[calc(100%/4*0.2)] h-0.5 bg-gray-700" />
        <div className="absolute left-[calc(100%/4*2.76)] top-[calc(100%/6*0.83)] w-0.75 h-[calc(100%/6*1.23)] bg-gray-700" />
        <div className="absolute left-[calc(100%/4*2.76)] top-[calc(100%/6*2.05)] w-[calc(100%/4*0.4)] h-0.5 bg-gray-700" />
        {/*Caminos de llaves M4 y M5 a M6*/}
        <div className="absolute left-[calc(100%/4*2.56)] top-[calc(100%/6*4.1)] w-[calc(100%/4*0.2)] h-0.5 bg-gray-700" />
        <div className="absolute left-[calc(100%/4*2.76)] top-[calc(100%/6*2.84)] w-0.75 h-[calc(100%/6*1.27)] bg-gray-700" />
        <div className="absolute left-[calc(100%/4*2.76)] top-[calc(100%/6*2.84)] w-[calc(100%/4*0.4)] h-0.5 bg-gray-700" />
        {/* Columna 1: M1 */}
        <div className="absolute top-[calc(100%/6*2.5)] col-start-1">
          <MatchCard 
            match={matches[0]}
            onSelect={onSelect}
            selectedTeam={selectedTeamGetter(matches[0].id)}
            disabled={disabled}
          />
        </div>
        <div className="absolute top-[calc(100%/6*4.25)] col-start-1">
          <MatchCard 
            match={matches[1]}
            onSelect={onSelect}
            selectedTeam={selectedTeamGetter(matches[1].id)}
            disabled={disabled}
          />
        </div>

        {/* Columna 2: M3 */}
        <div className="absolute top-[calc(100%/6*3.36)] col-start-2">
          <MatchCard 
            match={matches[2]}
            onSelect={onSelect}
            selectedTeam={selectedTeamGetter(matches[2].id)}
            disabled={disabled}
          />
        </div>

        {/* Columna 3: M4 y M5 */}
        <div className="absolute top-[calc(100%/6*0.1)] col-start-3">
          <MatchCard 
            match={matches[3]}
            onSelect={onSelect}
            selectedTeam={selectedTeamGetter(matches[3].id)}
            disabled={disabled}
          />
        </div>
        <div className="absolute top-[calc(100%/6*3.36)] col-start-3">
          <MatchCard 
            match={matches[4]}
            onSelect={onSelect}
            selectedTeam={selectedTeamGetter(matches[4].id)}
            disabled={disabled}
          />
        </div>

        {/* Columna 4: M6 */}
        <div className="absolute top-[calc(100%/6*1.73)] col-start-4">
          <MatchCard 
            match={matches[5]}
            onSelect={onSelect}
            selectedTeam={selectedTeamGetter(matches[5].id)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
