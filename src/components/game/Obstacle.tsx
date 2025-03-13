import React from "react";
import Image from "next/image";
import { Obstacle as ObstacleType } from "~/lib/game/types";
import { GAME_CONFIG } from "~/lib/game/constants";

interface ObstacleProps {
  obstacle: ObstacleType;
  theme: string; // URL to obstacle sprite from current theme
}

export function Obstacle({ obstacle, theme }: ObstacleProps) {
  return (
    <div
      className="absolute bottom-0"
      style={{
        transform: `translateX(${obstacle.x}px)`,
        width: obstacle.width,
        height: obstacle.height,
        willChange: "transform",
      }}
    >
      <Image
        src={theme}
        alt="obstacle"
        width={obstacle.width}
        height={obstacle.height}
        className="object-cover"
        priority
      />
    </div>
  );
}

export function ObstacleGroup({
  obstacles,
  theme,
}: {
  obstacles: ObstacleType[];
  theme: string;
}) {
  return (
    <>
      {obstacles.map((obstacle, index) => (
        <Obstacle key={index} obstacle={obstacle} theme={theme} />
      ))}
    </>
  );
}
