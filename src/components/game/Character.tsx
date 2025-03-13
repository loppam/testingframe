import React from "react";
import Image from "next/image";
import { Character as CharacterType } from "~/lib/game/types";

interface CharacterProps {
  character: CharacterType;
  y: number;
  isJumping: boolean;
}

export function Character({ character, y, isJumping }: CharacterProps) {
  return (
    <div
      className={`absolute transition-transform ${
        isJumping ? "rotate-[-20deg]" : ""
      }`}
      style={{
        width: character.size.width,
        height: character.size.height,
        transform: `translateY(${y}px)`,
        willChange: "transform",
      }}
    >
      <Image
        src={character.sprite}
        alt={character.name}
        width={character.size.width}
        height={character.size.height}
        className="object-contain"
        priority
      />
    </div>
  );
}
