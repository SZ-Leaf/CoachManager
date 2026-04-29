<?php

namespace App\Enum;

enum PlayerPosition: string
{
    case Goalkeeper = 'goalkeeper';
    case Defender = 'defender';
    case Midfielder = 'midfielder';
    case Forward = 'forward';
    case Other = 'other';
}
