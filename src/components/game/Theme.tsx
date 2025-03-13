import React from "react";
import Image from "next/image";
import { Theme as ThemeType } from "~/lib/game/types";
import { GAME_CONFIG } from "~/lib/game/constants";

interface ThemeProps {
  theme: ThemeType;
}

export function Theme({ theme }: ThemeProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={theme.background}
          alt="background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Ground */}
      <div
        className="absolute bottom-0 w-full"
        style={{ height: GAME_CONFIG.GROUND_HEIGHT }}
      >
        <Image
          src={theme.groundSprite}
          alt="ground"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Apply theme color scheme to the game container */}
      <style jsx global>{`
        .game-container {
          --primary-color: ${theme.colorScheme.primary};
          --secondary-color: ${theme.colorScheme.secondary};
          --accent-color: ${theme.colorScheme.accent};
        }
      `}</style>
    </div>
  );
}
